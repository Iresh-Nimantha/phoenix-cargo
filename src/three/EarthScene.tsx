import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const R = 2.0; // Globe radius

/** Convert lat/lon degrees to a 3-D point on the sphere surface */
function ll(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

/** Major global freight / air hubs [lat, lon] — Colombo is index 0 */
const HUBS: [number, number][] = [
  [ 6.93,  79.85],  // Colombo (Sri Lanka)
  [25.20,  55.27],  // Dubai
  [ 1.35, 103.82],  // Singapore
  [22.31, 114.17],  // Hong Kong
  [51.90,   4.48],  // Rotterdam
  [51.50,  -0.12],  // London
  [-1.28,  36.82],  // Nairobi
  [13.75, 100.52],  // Bangkok
  [19.08,  72.88],  // Mumbai
  [-33.87, 151.21], // Sydney
];

/** Build a lifted arc (QuadraticBezier) between two hubs */
function buildArc(from: [number, number], to: [number, number], lift = 1.25, segs = 72) {
  const A   = ll(from[0], from[1]);
  const B   = ll(to[0],   to[1]);
  const mid = A.clone().add(B).multiplyScalar(0.5).normalize().multiplyScalar(R * lift);
  return new THREE.QuadraticBezierCurve3(A, mid, B).getPoints(segs);
}

// ─── Textured Earth Globe with Clouds & Routes ───────────────────────────────
function Globe() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Mesh[]>([]);
  const tRef = useRef<number[]>([]);

  // Load high-resolution textures from jsdelivr CDN
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_atmos_2048.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_normal_2048.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_specular_2048.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_clouds_1024.png'
  ]);

  // Arc curves: Colombo → every other hub
  const curves = useMemo(() =>
    HUBS.slice(1).map(hub => {
      const pts = buildArc(HUBS[0], hub);
      return new THREE.CatmullRomCurve3(pts);
    }),
  []);

  // TubeGeometry for each route
  const tubeGeoms = useMemo(() =>
    curves.map(c => new THREE.TubeGeometry(c, 80, 0.008, 4, false)),
  [curves]);

  // Hub 3-D positions
  const hubPos = useMemo(() => HUBS.map(([a, o]) => ll(a, o)), []);

  // Init particle offsets
  useMemo(() => {
    tRef.current = curves.map(() => Math.random());
  }, [curves]);

  useFrame((_, dt) => {
    // Rotate Earth and Clouds
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.035;
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.045;
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.01; // Slow group drift

    // Animate air routing particles
    tRef.current = tRef.current.map((t, i) => {
      const next = (t + dt * (0.05 + i * 0.005)) % 1;
      const pos = curves[i].getPoint(next);
      particleRefs.current[i]?.position.copy(pos);
      return next;
    });
  });

  return (
    <group ref={groupRef}>
      {/* ── Base Earth Mesh with Real Textures ── */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          specularMap={specularMap}
          specular={new THREE.Color('#333333')}
          shininess={15}
        />
      </mesh>

      {/* ── Clouds Layer ── */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[R * 1.015, 64, 64]} />
        <meshPhongMaterial
          alphaMap={cloudsMap}
          transparent
          blending={THREE.NormalBlending}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* ── Atmosphere Outer Glow ── */}
      <mesh>
        <sphereGeometry args={[R * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Route Tubes (glowing routing lines) ── */}
      {tubeGeoms.map((geom, i) => (
        <mesh key={`rt${i}`} geometry={geom}>
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* ── Colombo Hub (gold star marker) ── */}
      <mesh position={hubPos[0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#eab308" blending={THREE.AdditiveBlending} />
      </mesh>

      {/* ── Other Hub Markers ── */}
      {hubPos.slice(1).map((pos, i) => (
        <mesh key={`hub${i}`} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#f97316" blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* ── Glowing Shipping/Air Routing Particles ── */}
      {curves.map((_, i) => (
        <mesh
          key={`pt${i}`}
          ref={el => { if (el) particleRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial color="#fef08a" blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// Loader state fallback
function GlobeLoader() {
  return (
    <mesh>
      <sphereGeometry args={[R, 32, 32]} />
      <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

// ─── Main Exported EarthScene Canvas ─────────────────────────────────────────
export default function EarthScene() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px]">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<GlobeLoader />}>
          {/* Calibrated Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#3b82f6" />
          <pointLight position={[0, 0, 8]} intensity={0.5} />

          <Globe />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(Math.PI * 3) / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
