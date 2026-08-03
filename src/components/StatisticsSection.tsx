import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Users, Lock, HeartHandshake, ShieldCheck } from 'lucide-react';

interface StatItem {
  id: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
  icon: any;
}

export default function StatisticsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats: StatItem[] = [
    {
      id: "stat-1",
      number: 1000,
      suffix: "+",
      label: "Happy Registrations",
      description: "Brides & grooms from all communities",
      icon: Users
    },
    {
      id: "stat-2",
      number: 100,
      suffix: "%",
      label: "Privacy Protection",
      description: "Confidential handling of contact data",
      icon: Lock
    },
    {
      id: "stat-3",
      number: 100,
      suffix: "%",
      label: "Personal Guidance",
      description: "Dedicated matrimony consultants",
      icon: HeartHandshake
    },
    {
      id: "stat-4",
      number: 100,
      suffix: "%",
      label: "Trusted Support",
      description: "Assistance across TN & India",
      icon: ShieldCheck
    }
  ];

  return (
    <section ref={ref} className="relative py-16 sm:py-24 bg-gradient-to-r from-[#3B0E17] via-[#6A1E2C] to-[#3B0E17] text-[#FFF9F5] overflow-hidden shadow-2xl">
      {/* Background shimmer lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C89B63]/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:border-[#C89B63]/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C89B63]/20 text-[#C89B63] flex items-center justify-center mb-4">
                  <IconComp className="w-6 h-6" />
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#FFF9F5] tracking-tight mb-1">
                  <AnimatedCounter value={stat.number} isInView={isInView} />
                  <span className="text-[#C89B63]">{stat.suffix}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#F8E8DA] font-heading mb-1">
                  {stat.label}
                </h3>

                <p className="text-xs text-[#FFF9F5]/70 max-w-[180px]">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ value, isInView }: { value: number; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800; // ms
    const increment = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span>{count.toLocaleString()}</span>;
}
