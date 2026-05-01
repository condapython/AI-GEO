import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { useEffect, useState } from 'react';

function Counter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export function TheProblem() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-24 z-10 pointer-events-auto">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-textPrimary mb-4">The AI Visibility Gap</h2>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            Traditional search engines are being replaced by Generative AI. But AI doesn't read websites the way Google does.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard delay={0.1}>
            <div className="text-5xl font-mono font-bold text-primary mb-4">
              <Counter end={1} suffix="B+" />
            </div>
            <h3 className="text-xl font-display font-bold text-textPrimary mb-2">Questions Daily</h3>
            <p className="text-textSecondary text-sm">
              Users are asking ChatGPT, Claude, and Perplexity billions of questions about products and services every single day.
            </p>
          </GlassCard>

          <GlassCard delay={0.3}>
            <div className="text-5xl font-mono font-bold text-danger mb-4">
              <Counter end={93} suffix="%" />
            </div>
            <h3 className="text-xl font-display font-bold text-textPrimary mb-2">Invisible Businesses</h3>
            <p className="text-textSecondary text-sm">
              The vast majority of modern businesses lack the structured data and semantic depth required for AI engines to cite them.
            </p>
          </GlassCard>

          <GlassCard delay={0.5}>
            <div className="text-5xl font-mono font-bold text-secondary mb-4">
              <Counter end={10} suffix="x" />
            </div>
            <h3 className="text-xl font-display font-bold text-textPrimary mb-2">Conversion Rate</h3>
            <p className="text-textSecondary text-sm">
              Traffic originating from direct AI citations converts significantly higher than traditional organic search traffic.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
