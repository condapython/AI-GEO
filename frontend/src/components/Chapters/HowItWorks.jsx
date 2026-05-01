import { motion } from 'framer-motion';

export function HowItWorks() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-24 z-10 pointer-events-auto overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-textPrimary mb-4">How AI Search Works</h2>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto">
            AI engines synthesize information from across the web. To be mentioned, your data must be structured for immediate extraction.
          </p>
        </motion.div>

        {/* 2D CSS Representation of the Pipeline for the UI overlay */}
        <div className="relative w-full max-w-4xl mx-auto mt-20">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-borderBase -translate-y-1/2 z-0 hidden md:block">
            <motion.div 
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="w-full h-full bg-primary/50"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between relative z-10 space-y-8 md:space-y-0">
            {['User Query', 'Neural Extraction', 'Knowledge Graph', 'Your Business'].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.4 + 0.5 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 
                  ${i === 3 ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'border-borderBase bg-surface backdrop-blur-sm'}`}>
                  <span className="font-mono text-sm">{i + 1}</span>
                </div>
                <span className={`font-medium ${i === 3 ? 'text-primary font-bold text-glow' : 'text-textSecondary'}`}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
