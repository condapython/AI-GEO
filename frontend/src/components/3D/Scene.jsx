import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EarthGlobe } from './EarthGlobe';
import { ParticleField } from './ParticleField';
import { useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

// We pass the global scrollYProgress down to the 3D scene to drive animations
export function Scene({ scrollYProgress }) {
  // We can track the global scroll state here to animate the globe scale/position
  // However, since we can't easily pass framer-motion values directly into Canvas primitives
  // without motion/three (which we didn't install), we can just use an effect to update a ref
  // or use state, but state causes re-renders. 
  // Given the constraints, we will just render the base 3D elements and let CSS/Framer handle the Canvas DOM element opacity/scale if needed, or implement a custom hook.

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00E5FF" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#7C3AED" />
        
        <EarthGlobe position={[0, 0, 0]} scale={1} />
        <ParticleField count={2000} />
        
        {/* We can use Environment for better reflections if needed, but our cosmos is dark */}
      </Canvas>
    </div>
  );
}
