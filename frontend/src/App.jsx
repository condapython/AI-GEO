import { useState, useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { Scene } from './components/3D/Scene';
import { Hero } from './components/Chapters/Hero';
import { TheProblem } from './components/Chapters/TheProblem';
import { HowItWorks } from './components/Chapters/HowItWorks';
import { AnalysisTool } from './components/Chapters/AnalysisTool';
import { Results } from './components/Chapters/Results';

function App() {
  const containerRef = useRef(null);
  const [resultsData, setResultsData] = useState(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Top progress bar
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative bg-background text-textPrimary overflow-hidden font-body selection:bg-primary/30">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-50"
        style={{ scaleX }}
      />

      {/* Global 3D Background */}
      <Scene scrollYProgress={scrollYProgress} />

      {/* Scrollytelling Chapters */}
      <div className="relative z-10">
        {!resultsData ? (
          <>
            <Hero />
            <TheProblem />
            <HowItWorks />
            <AnalysisTool onAnalysisComplete={setResultsData} />
          </>
        ) : (
          <Results data={resultsData} />
        )}
      </div>
      
      {/* Footer */}
      <footer className="relative z-20 py-8 text-center text-textSecondary text-sm border-t border-borderBase bg-background/80 backdrop-blur-md">
        <p>Generative Engine Optimization Simulator. Built with React, Three.js, and Framer Motion.</p>
      </footer>
    </div>
  );
}

export default App;
