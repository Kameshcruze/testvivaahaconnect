import 'dotenv/config';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

// Catch process-level errors to prevent container crash
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in server:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to strip quotes and trim env values if user enters them with quotes
function cleanEnvVal(val?: string, fallback = ''): string {
  if (!val) return fallback;
  let str = val.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1);
  }
  return str.trim() || fallback;
}

// Helper to validate and clean Supabase URL
function getValidSupabaseConfig() {
  const envUrl = cleanEnvVal(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const envKey = cleanEnvVal(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY
  );

  let url = 'https://wdscpvjjyltsuvivlsta.supabase.co';
  let key =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkc2NwdmpqeWx0c3V2aXZsc3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODY1MzMsImV4cCI6MjEwMzc2MjUzM30.J9b5WcfVrWUPsohuuivOIgnjPTxtvPWx75MluLrzagE';

  if (envUrl && !envUrl.includes('awigjicq') && !envUrl.includes('localhost') && !envUrl.includes('your-project-id')) {
    url = envUrl;
  }
  if (envKey && envUrl && !envUrl.includes('awigjicq')) {
    key = envKey;
  }

  return { url, key };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY } = getValidSupabaseConfig();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Admin Configuration - Kept strictly on server side
const ADMIN_USERNAME = cleanEnvVal(process.env.ADMIN_USERNAME, 'admin');
const ADMIN_PASSWORD = cleanEnvVal(process.env.ADMIN_PASSWORD, 'vivaaha@admin2026');
const SESSION_SECRET = cleanEnvVal(process.env.ADMIN_SESSION_SECRET, 'vivaaha-admin-crypt-secret-2026-key');

// Helper for timing-safe string comparison
function safeCompare(a: string, b: string): boolean {
  try {
    const cleanA = (a || '').trim();
    const cleanB = (b || '').trim();
    if (cleanA.length !== cleanB.length) {
      return false;
    }
    const bufA = Buffer.from(cleanA);
    const bufB = Buffer.from(cleanB);
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Generate signed session token
function generateToken(username: string): string {
  const payload = {
    u: username,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${signature}`;
}

// Verify signed session token
function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    if (!token || typeof token !== 'string') return { valid: false };
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadStr, sig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr)
      .digest('base64url');

    if (!safeCompare(sig, expectedSig)) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString());
    if (payload.exp < Date.now()) {
      return { valid: false };
    }

    return { valid: true, username: payload.u };
  } catch {
    return { valid: false };
  }
}

// Admin Authentication Middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const { valid, username } = verifyToken(token);

  if (!valid) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).adminUser = username;
  next();
}

// ================= API ROUTES =================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const isValidUser = safeCompare(username.trim(), ADMIN_USERNAME);
  const isValidPass = safeCompare(password, ADMIN_PASSWORD);

  if (!isValidUser || !isValidPass) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = generateToken(username.trim());
  return res.json({
    success: true,
    token,
    user: {
      username: ADMIN_USERNAME,
      role: 'Super Admin',
    },
  });
});

// Verify Session
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];
  const { valid, username } = verifyToken(token);

  if (!valid) {
    return res.status(401).json({ valid: false });
  }

  return res.json({
    valid: true,
    user: { username, role: 'Super Admin' },
  });
});

// Cache for fast admin registrations fetching
let cachedAdminData: { timestamp: number; data: any[] } | null = null;
const CACHE_TTL_MS = 5000; // 5 seconds cache to make repeated clicks/refreshes instant

// Public candidate registration submission endpoint
app.post('/api/registrations', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name) {
      return res.status(400).json({ error: 'Candidate name is required' });
    }

    const registrationId = payload.id || `VC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const recordPayload = {
      ...payload,
      id: registrationId,
      created_at: payload.created_at || new Date().toISOString(),
      status: payload.status || 'Pending Review',
    };

    let insertError = null;
    const { error } = await supabase.from('registrations').insert([recordPayload]);

    if (error) {
      console.warn('Server Supabase insert error:', error.message);
      if (error.message?.includes('dhosham')) {
        const { dhosham, ...withoutDhosham } = recordPayload;
        const retry = await supabase.from('registrations').insert([withoutDhosham]);
        insertError = retry.error;
      } else if (error.message?.includes('lagnam')) {
        const { lagnam, ...withoutLagnam } = recordPayload;
        const retry = await supabase.from('registrations').insert([withoutLagnam]);
        insertError = retry.error;
      } else if (error.message?.includes('laknam')) {
        const { laknam, ...withoutLaknam } = recordPayload;
        const retry = await supabase.from('registrations').insert([withoutLaknam]);
        insertError = retry.error;
      } else {
        insertError = error;
      }
    }

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    // Invalidate admin cache so fresh record shows up immediately
    cachedAdminData = null;

    return res.json({
      success: true,
      id: registrationId,
    });
  } catch (err: any) {
    console.error('Error in /api/registrations:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Fetch All Registrations (Protected) - High speed with memory caching
app.get('/api/admin/registrations', requireAdmin, async (req, res) => {
  try {
    const now = Date.now();
    // Return instant memory cache if valid and not a forced reload
    if (cachedAdminData && now - cachedAdminData.timestamp < CACHE_TTL_MS && !req.query.force) {
      return res.json({
        success: true,
        count: cachedAdminData.data.length,
        registrations: cachedAdminData.data,
        cached: true,
      });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations from database:', error);
      // If error occurs but we have stale cache, serve stale cache gracefully
      if (cachedAdminData) {
        return res.json({
          success: true,
          count: cachedAdminData.data.length,
          registrations: cachedAdminData.data,
          stale: true,
        });
      }
      return res.status(500).json({ error: error.message });
    }

    const resultList = data || [];
    cachedAdminData = {
      timestamp: now,
      data: resultList,
    };

    return res.json({
      success: true,
      count: resultList.length,
      registrations: resultList,
    });
  } catch (err: any) {
    console.error('Server error fetching registrations:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Update Registration Status or Details (Protected)
app.patch('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Registration ID is required' });
    }

    // Filter allowed update keys
    const allowedKeys = [
      'status',
      'name',
      'mobile_number',
      'whatsapp_number',
      'current_location',
      'native_place',
      'community',
      'kulam',
      'kuladeivam',
      'rasi',
      'natchatram',
      'laknam',
      'lagnam',
      'dhosham',
      'education_qualification',
      'profession',
      'income',
      'partner_age_range',
      'partner_education',
      'partner_profession',
      'partner_community_preference',
      'partner_location_preference',
    ];

    const cleanUpdates: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    }

    const { data, error } = await supabase
      .from('registrations')
      .update(cleanUpdates)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Invalidate cache
    cachedAdminData = null;

    return res.json({ success: true, registration: data?.[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Delete Registration (Protected)
app.delete('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Registration ID is required' });
    }

    const { error } = await supabase.from('registrations').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Invalidate cache
    cachedAdminData = null;

    return res.json({ success: true, message: `Registration ${id} deleted successfully` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// In-memory persistent stores for resilient fallback
let memoryEnquiriesStore: any[] = [];
let cachedAdminEnquiries: { timestamp: number; data: any[] } | null = null;
let memoryDraftsStore: any[] = [];
let cachedAdminDrafts: { timestamp: number; data: any[] } | null = null;

// ==========================================
// REGISTRATION DRAFTS (INCOMPLETE REGISTRATIONS)
// ==========================================

// Public Save / Upsert Registration Draft (auto-saved mid-way progress)
app.post('/api/registration-drafts', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.id) {
      return res.status(400).json({ error: 'Draft ID is required' });
    }

    const draftId = payload.id;
    const now = payload.updated_at || new Date().toISOString();

    const standardDraft = {
      ...payload,
      id: draftId,
      updated_at: now,
      created_at: payload.created_at || now,
      status: payload.status || 'Incomplete',
    };

    // 1. Update resilient server memory store
    const existingIdx = memoryDraftsStore.findIndex((d) => d.id === draftId || (d.session_token && d.session_token === payload.session_token));
    if (existingIdx >= 0) {
      memoryDraftsStore[existingIdx] = { ...memoryDraftsStore[existingIdx], ...standardDraft };
    } else {
      memoryDraftsStore.unshift(standardDraft);
    }

    // Invalidate admin cache
    cachedAdminDrafts = null;

    // 2. Upsert to Supabase `registration_drafts` table
    try {
      const fd = standardDraft.form_data || {};
      const candidateName = standardDraft.candidate_name || standardDraft.name || fd.name || null;
      const exactDraft = {
        id: draftId,
        session_token: payload.session_token || null,
        current_step: Number(payload.current_step || standardDraft.current_step || 1),
        candidate_name: candidateName,
        gender: standardDraft.gender || fd.gender || null,
        mobile_number: standardDraft.mobile_number || standardDraft.mobile || fd.mobileNumber || fd.mobile_number || null,
        whatsapp_number: standardDraft.whatsapp_number || fd.whatsappNumber || fd.whatsapp_number || null,
        email: standardDraft.email || fd.email || null,
        community: standardDraft.community || fd.community || null,
        kulam: standardDraft.kulam || fd.kulam || null,
        rasi: standardDraft.rasi || fd.rasi || null,
        natchatram: standardDraft.natchatram || fd.natchatram || fd.natchathiram || null,
        laknam: standardDraft.lagnam || standardDraft.laknam || fd.lagnam || fd.laknam || null,
        lagnam: standardDraft.lagnam || standardDraft.laknam || fd.lagnam || fd.laknam || null,
        dhosham: standardDraft.dhosham || fd.dhosham || fd.dosham || null,
        current_location: standardDraft.current_location || fd.currentLocation || fd.current_location || null,
        form_data: fd,
        status: standardDraft.status || 'Incomplete',
        updated_at: now,
        created_at: standardDraft.created_at || now,
      };

      const { error } = await supabase
        .from('registration_drafts')
        .upsert(exactDraft, { onConflict: 'id' });

      if (error) {
        console.warn('Notice upserting exact draft to Supabase, trying minimal schema:', error.message);

        const minimalDraft = {
          id: draftId,
          session_token: payload.session_token || null,
          current_step: payload.current_step || 1,
          form_data: fd,
          status: standardDraft.status || 'Incomplete',
          updated_at: now,
        };

        await supabase
          .from('registration_drafts')
          .upsert(minimalDraft, { onConflict: 'id' });
      }
    } catch (e: any) {
      console.warn('Error connecting to Supabase for drafts:', e?.message);
    }

    return res.json({ success: true, id: draftId });
  } catch (err: any) {
    console.error('Error in /api/registration-drafts:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Public Retrieve Registration Draft by ID or Session Token
app.get('/api/registration-drafts/:tokenOrId', async (req, res) => {
  try {
    const { tokenOrId } = req.params;
    if (!tokenOrId) {
      return res.status(400).json({ error: 'Token or ID is required' });
    }

    // 1. Check in Supabase first
    try {
      const { data, error } = await supabase
        .from('registration_drafts')
        .select('*')
        .or(`id.eq.${tokenOrId},session_token.eq.${tokenOrId}`)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return res.json({ success: true, draft: data });
      }
    } catch (e) {}

    // 2. Check memory store
    const memoryDraft = memoryDraftsStore.find(
      (d) => d.id === tokenOrId || d.session_token === tokenOrId
    );

    if (memoryDraft) {
      return res.json({ success: true, draft: memoryDraft });
    }

    return res.status(404).json({ error: 'Draft not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Mark Draft Completed
app.post('/api/registration-drafts/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { completedRegistrationId } = req.body || {};
    const now = new Date().toISOString();

    const existingIdx = memoryDraftsStore.findIndex((d) => d.id === id);
    if (existingIdx >= 0) {
      memoryDraftsStore[existingIdx] = {
        ...memoryDraftsStore[existingIdx],
        status: 'Completed',
        completed_registration_id: completedRegistrationId || null,
        updated_at: now,
      };
    }

    try {
      await supabase
        .from('registration_drafts')
        .update({
          status: 'Completed',
          completed_registration_id: completedRegistrationId || null,
          updated_at: now,
        })
        .eq('id', id);
    } catch (e) {}

    cachedAdminDrafts = null;
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Fetch All Incomplete Drafts (Admin Protected)
app.get('/api/admin/registration-drafts', requireAdmin, async (req, res) => {
  try {
    const now = Date.now();
    if (cachedAdminDrafts && now - cachedAdminDrafts.timestamp < CACHE_TTL_MS && !req.query.force) {
      return res.json({
        success: true,
        count: cachedAdminDrafts.data.length,
        drafts: cachedAdminDrafts.data,
        cached: true,
      });
    }

    let cloudList: any[] = [];
    try {
      const { data, error } = await supabase
        .from('registration_drafts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        cloudList = data;
      }
    } catch (e: any) {
      console.warn('Error fetching drafts from Supabase:', e?.message);
    }

    // Merge cloud list with memory store
    const mergedMap = new Map<string, any>();
    memoryDraftsStore.forEach((d) => { if (d && d.id) mergedMap.set(d.id, d); });
    cloudList.forEach((d) => { if (d && d.id) mergedMap.set(d.id, d); });

    const combinedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime()
    );

    memoryDraftsStore = combinedList;
    cachedAdminDrafts = { timestamp: now, data: combinedList };

    return res.json({ success: true, count: combinedList.length, drafts: combinedList });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Update Draft Status or Notes (Admin Protected)
app.patch('/api/admin/registration-drafts/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body || {};
    const now = new Date().toISOString();

    const existingIdx = memoryDraftsStore.findIndex((d) => d.id === id);
    if (existingIdx >= 0) {
      if (status !== undefined) memoryDraftsStore[existingIdx].status = status;
      if (notes !== undefined) memoryDraftsStore[existingIdx].notes = notes;
      memoryDraftsStore[existingIdx].updated_at = now;
    }

    const updates: Record<string, any> = { updated_at: now };
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    try {
      await supabase.from('registration_drafts').update(updates).eq('id', id);
    } catch (e) {}

    cachedAdminDrafts = null;
    return res.json({ success: true, message: `Draft ${id} updated` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Delete Draft (Admin Protected)
app.delete('/api/admin/registration-drafts/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    memoryDraftsStore = memoryDraftsStore.filter((d) => d.id !== id);

    try {
      await supabase.from('registration_drafts').delete().eq('id', id);
    } catch (e) {}

    cachedAdminDrafts = null;
    return res.json({ success: true, message: `Draft ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Public Enquiry Submission (Callbacks, WhatsApp clicks, Contact form)
app.post('/api/enquiries', async (req, res) => {
  try {
    const payload = req.body;
    const enquiryId = payload?.id || `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = payload?.created_at || new Date().toISOString();
    
    const standardRecord = {
      id: enquiryId,
      created_at: now,
      type: payload?.type || 'callback_request',
      name: payload?.name || null,
      phone: payload?.phone || null,
      email: payload?.email || null,
      community: payload?.community || null,
      source: payload?.source || 'Website',
      message: payload?.message || null,
      status: payload?.status || 'New',
      notes: payload?.notes || null,
    };

    // 1. Always save in resilient server memory store
    const existingIdx = memoryEnquiriesStore.findIndex((e) => e.id === enquiryId);
    if (existingIdx >= 0) {
      memoryEnquiriesStore[existingIdx] = { ...memoryEnquiriesStore[existingIdx], ...standardRecord };
    } else {
      memoryEnquiriesStore.unshift(standardRecord);
    }

    // 2. Insert into Supabase with live table schema compatibility
    try {
      const dbPayload = {
        id: enquiryId,
        created_at: now,
        name: payload?.name || null,
        phone: payload?.phone || null,
        email: payload?.email || null,
        channel: payload?.type || 'callback',
        topic: payload?.community || null,
        source_page: payload?.source || 'Website',
        message: payload?.message || null,
        status: payload?.status || 'New',
        notes: payload?.notes || null,
      };

      const { error } = await supabase.from('enquiries').insert([dbPayload]);
      if (error) {
        // Fallback to alternative schema
        const altPayload = {
          id: enquiryId,
          created_at: now,
          type: payload?.type || 'callback_request',
          name: payload?.name || null,
          phone: payload?.phone || null,
          email: payload?.email || null,
          community: payload?.community || null,
          source: payload?.source || 'Website',
          message: payload?.message || null,
          status: payload?.status || 'New',
          notes: payload?.notes || null,
        };
        try {
          await supabase.from('enquiries').insert([altPayload]);
        } catch {}
      }
    } catch (dbErr: any) {
      console.warn('Supabase DB notice for enquiry insert:', dbErr?.message);
    }

    cachedAdminEnquiries = null;
    return res.json({ success: true, id: enquiryId, enquiry: standardRecord });
  } catch (err: any) {
    console.error('Error in /api/enquiries:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Fetch All Enquiries (Protected)
app.get('/api/admin/enquiries', requireAdmin, async (req, res) => {
  try {
    const now = Date.now();
    if (cachedAdminEnquiries && now - cachedAdminEnquiries.timestamp < CACHE_TTL_MS && !req.query.force) {
      return res.json({
        success: true,
        count: cachedAdminEnquiries.data.length,
        enquiries: cachedAdminEnquiries.data,
        cached: true,
      });
    }

    let cloudList: any[] = [];
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        cloudList = data.map((raw: any) => ({
          id: raw.id,
          created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
          type: raw.type || raw.channel || 'callback_request',
          name: raw.name || null,
          phone: raw.phone || null,
          email: raw.email || null,
          community: raw.community || raw.topic || null,
          source: raw.source || raw.source_page || 'Website',
          message: raw.message || null,
          status: raw.status || 'New',
          notes: raw.notes || (raw.preferred_time ? `Preferred Time: ${raw.preferred_time}` : null),
        }));
      } else if (error) {
        console.warn('Notice querying Supabase enquiries table:', error.message);
      }
    } catch (e: any) {
      console.warn('Error querying Supabase enquiries:', e?.message);
    }

    // Merge cloud list with memory store by ID
    const mergedMap = new Map<string, any>();
    memoryEnquiriesStore.forEach((e) => { if (e && e.id) mergedMap.set(e.id, e); });
    cloudList.forEach((e) => { if (e && e.id) mergedMap.set(e.id, e); });

    const combinedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    // Sync memory store
    memoryEnquiriesStore = combinedList;
    cachedAdminEnquiries = { timestamp: now, data: combinedList };

    return res.json({ success: true, count: combinedList.length, enquiries: combinedList });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Update Enquiry (Protected)
app.patch('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'Enquiry ID is required' });
    }

    // Update in memory
    const existingIdx = memoryEnquiriesStore.findIndex((e) => e.id === id);
    if (existingIdx >= 0) {
      if (status !== undefined) memoryEnquiriesStore[existingIdx].status = status;
      if (notes !== undefined) memoryEnquiriesStore[existingIdx].notes = notes;
    }

    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    try {
      await supabase.from('enquiries').update(updates).eq('id', id);
    } catch (e) {}

    cachedAdminEnquiries = null;
    return res.json({ success: true, message: `Enquiry ${id} updated` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Delete Enquiry (Protected)
app.delete('/api/admin/enquiries/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Enquiry ID is required' });
    }

    // Remove from memory
    memoryEnquiriesStore = memoryEnquiriesStore.filter((e) => e.id !== id);

    try {
      await supabase.from('enquiries').delete().eq('id', id);
    } catch (e) {}

    cachedAdminEnquiries = null;
    return res.json({ success: true, message: `Enquiry ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
