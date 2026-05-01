import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EarthGlobe({ scale = 1, position = [0, 0, 0] }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const { geometry, edges } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 4);
    const edg = new THREE.EdgesGeometry(geo);
    return { geometry: geo, edges: edg };
  }, []);

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef}>
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        <lineSegments>
          <primitive object={edges} attach="geometry" />
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.3} />
        </lineSegments>
        
        {/* Glow / Core */}
        <mesh>
          <sphereGeometry args={[1.9, 32, 32]} />
          <meshPhongMaterial 
            color="#00E5FF" 
            emissive="#00E5FF" 
            emissiveIntensity={0.2}
            transparent 
            opacity={0.1}
            wireframe
          />
        </mesh>
      </mesh>
    </group>
  );
}
