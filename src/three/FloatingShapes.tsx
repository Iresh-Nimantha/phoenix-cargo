import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track mouse for subtle interaction
  useMemo(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.05 + mouseRef.current.x * 0.1;
    groupRef.current.rotation.x = mouseRef.current.y * 0.05;

    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 1.5) * 0.3;
      child.rotation.x = t * 0.2 + i;
      child.rotation.z = t * 0.15 + i * 0.5;
    });
  });

  const shapes = useMemo(
    () => [
      { position: [-3, 1, -2] as [number, number, number], geometry: 'icosahedron', scale: 0.6, color: '#0B2545' },
      { position: [3, -1, -3] as [number, number, number], geometry: 'octahedron', scale: 0.5, color: '#00A8E8' },
      { position: [-1.5, -2, -1] as [number, number, number], geometry: 'torus', scale: 0.4, color: '#185FA5' },
      { position: [2, 2, -4] as [number, number, number], geometry: 'dodecahedron', scale: 0.35, color: '#0052CC' },
      { position: [0, 0.5, -2.5] as [number, number, number], geometry: 'icosahedron', scale: 0.25, color: '#2F6DFF' },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position} scale={shape.scale}>
          {shape.geometry === 'icosahedron' && <icosahedronGeometry args={[1, 1]} />}
          {shape.geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
          {shape.geometry === 'torus' && <torusGeometry args={[1, 0.4, 16, 32]} />}
          {shape.geometry === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial
            color={shape.color}
            transparent
            opacity={0.15}
            wireframe
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
