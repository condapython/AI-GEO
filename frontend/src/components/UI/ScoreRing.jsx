import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScoreRing({ score = 0, size = 200, strokeWidth = 12 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Color based on score
  const getColor = (s) => {
    if (s >= 80) return '#10B981'; // success
    if (s >= 50) return '#F59E0B'; // warning
    return '#EF4444'; // danger
  };

  const color = getColor(score);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Counter animation
  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;
    
    const duration = 1500;
    let startTimestamp = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out quart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(Math.floor(easeProgress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Ring */}
      <svg className="transform -rotate-90 absolute" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_currentColor]"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-mono font-bold text-textPrimary text-glow" style={{ color }}>
          {displayScore}
        </span>
        <span className="text-sm font-medium text-textSecondary uppercase tracking-widest mt-1">
          GEO Score
        </span>
      </div>
    </div>
  );
}
