import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';

const FloatingShapes = lazy(() => import('./FloatingShapes'));
const ParticleField = lazy(() => import('./ParticleField'));

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.3} color="#00A8E8" />
          <pointLight position={[-3, 2, 4]} intensity={0.2} color="#0B2545" />
          <FloatingShapes />
          <ParticleField count={150} />
        </Suspense>
      </Canvas>
    </div>
  );
}
