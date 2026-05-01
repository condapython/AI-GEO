import { motion } from 'framer-motion';

export function Hero() {
  const text = "Is your business visible to AI?";
  const words = text.split(" ");

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-textPrimary leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="inline-block mr-3"
            >
              {word === "AI?" ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl md:text-2xl text-textSecondary font-mono max-w-2xl mb-12"
        >
          Generative Engine Optimization (GEO) is the new SEO.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.5 }}
          onClick={() => {
            document.getElementById('analysis-tool').scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-4 bg-transparent border border-primary text-primary font-bold rounded-full uppercase tracking-wider relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-primary opacity-10 group-hover:opacity-20 transition-opacity"></span>
          Start Analysis
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-xs text-textSecondary uppercase tracking-widest mb-2 font-mono">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-borderBase relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-primary absolute top-0 left-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
