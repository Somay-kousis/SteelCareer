'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function AbstractMonolith() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(0, 0, 0);
      meshRef.current.material.opacity = 0;
    }
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Intro animation
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime / 4);
      meshRef.current.rotation.y += 0.005;
      
      // Gentle floating effect driven by mouse position
      const pointer = state.pointer;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, pointer.x * 2, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, pointer.y * 2, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[2, 0.6, 256, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          color="#1a1a1a"
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          transparent
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d946ef" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#f97316" />
        
        {/* Glowing floating particles in the background */}
        <Sparkles 
          count={100} 
          scale={12} 
          size={4} 
          speed={0.4} 
          opacity={0.2} 
          color="#d946ef" 
        />
        <Sparkles 
          count={50} 
          scale={10} 
          size={6} 
          speed={0.2} 
          opacity={0.1} 
          color="#ffffff" 
        />

        <AbstractMonolith />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
