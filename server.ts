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

    const { error } = await supabase.from('registrations').insert([recordPayload]);

    if (error) {
      console.warn('Server Supabase insert error:', error.message);
      return res.status(500).json({ error: error.message });
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
