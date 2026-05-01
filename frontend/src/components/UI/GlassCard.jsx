import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function GlassCard({ children, className, delay = 0, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.25, 1, 0.5, 1] // Custom spring-like easing
      }}
      style={style}
      className={cn(
        "glass-panel glass-panel-hover p-8 relative overflow-hidden group",
        className
      )}
    >
      {/* Inner glow effect on hover */}
      <div className="absolute inset-0 bg-glass-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
