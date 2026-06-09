import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const R = 2.0;

function ll(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

const HUBS: [number, number][] = [
  [6.93, 79.85],  // Colombo
  [25.20, 55.27],  // Dubai
  [1.35, 103.82],  // Singapore
  [22.31, 114.17],  // Hong Kong
  [51.90, 4.48],  // Rotterdam
  [51.50, -0.12],  // London
  [-1.28, 36.82],  // Nairobi
  [13.75, 100.52],  // Bangkok
  [19.08, 72.88],  // Mumbai
  [-33.87, 151.21], // Sydney
];

function buildArc(from: [number, number], to: [number, number], lift = 1.25, segs = 72) {
  const A = ll(from[0], from[1]);
  const B = ll(to[0], to[1]);
  const mid = A.clone().add(B).multiplyScalar(0.5).normalize().multiplyScalar(R * lift);
  return new THREE.QuadraticBezierCurve3(A, mid, B).getPoints(segs);
}

// Custom shader material for day/night Earth blend
const EarthMaterial = ({ colorMap, normalMap, specularMap, nightMap, cloudsAlpha }: {
  colorMap: THREE.Texture;
  normalMap: THREE.Texture;
  specularMap: THREE.Texture;
  nightMap: THREE.Texture;
  cloudsAlpha: THREE.Texture;
}) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uDayMap: { value: colorMap },
    uNightMap: { value: nightMap },
    uNormalMap: { value: normalMap },
    uSpecMap: { value: specularMap },
    uCloudsMap: { value: cloudsAlpha },
    uSunDir: { value: new THREE.Vector3(5, 3, 5).normalize() },
  }), [colorMap, nightMap, normalMap, specularMap, cloudsAlpha]);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uDayMap;
    uniform sampler2D uNightMap;
    uniform sampler2D uNormalMap;
    uniform sampler2D uSpecMap;
    uniform sampler2D uCloudsMap;
    uniform vec3 uSunDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      // Normal mapping
      vec3 nMap = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
      vec3 N = normalize(vNormal + nMap * 0.6);

      float NdotL = dot(N, normalize(uSunDir));

      // Day/night blend with soft terminator
      float terminator = smoothstep(-0.18, 0.22, NdotL);

      vec4 dayColor   = texture2D(uDayMap,   vUv);
      vec4 nightColor = texture2D(uNightMap, vUv);

      // City lights only on the night side
      vec3 nightLit = nightColor.rgb * (1.0 - terminator) * 1.8;

      // Specular highlight (ocean glint)
      float specMask = texture2D(uSpecMap, vUv).r;
      vec3 viewDir = normalize(-vWorldPos);
      vec3 halfDir = normalize(normalize(uSunDir) + viewDir);
      float specPow = pow(max(dot(N, halfDir), 0.0), 80.0);
      vec3 specColor = vec3(0.4, 0.5, 0.7) * specPow * specMask * terminator;

      // Clouds (from alpha channel of clouds texture)
      float cloud = texture2D(uCloudsMap, vUv).r;
      vec3 cloudColor = mix(vec3(0.85, 0.88, 0.92), vec3(1.0), cloud) * terminator;
      float cloudMix  = cloud * 0.72;

      // Compose
      vec3 dayLit  = dayColor.rgb * (0.08 + 0.92 * terminator);
      vec3 surface = mix(dayLit, cloudColor, cloudMix);
      vec3 color   = surface + nightLit + specColor;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <shaderMaterial
      ref={matRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
};

function Globe() {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Mesh[]>([]);
  const tRef = useRef<number[]>([]);

  // High-quality textures from three.js r154 CDN
  // Day: NASA Blue Marble 2048, Night: city lights, Normal + Specular for realism
  const [colorMap, normalMap, specularMap, nightMap, cloudsMap] = useTexture([
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_atmos_2048.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_normal_2048.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_specular_2048.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_lights_2048.png',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r154/examples/textures/planets/earth_clouds_1024.png',
  ]);

  // Improve texture filtering for sharper detail
  [colorMap, normalMap, specularMap, nightMap, cloudsMap].forEach(t => {
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 8;
  });

  const curves = useMemo(() =>
    HUBS.slice(1).map(hub => {
      const pts = buildArc(HUBS[0], hub);
      return new THREE.CatmullRomCurve3(pts);
    }),
    []);

  const tubeGeoms = useMemo(() =>
    curves.map(c => new THREE.TubeGeometry(c, 80, 0.007, 4, false)),
    [curves]);

  const hubPos = useMemo(() => HUBS.map(([a, o]) => ll(a, o)), []);

  useMemo(() => {
    tRef.current = curves.map(() => Math.random());
  }, [curves]);

  useFrame((_, dt) => {
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.035;
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.008;

    tRef.current = tRef.current.map((t, i) => {
      const next = (t + dt * (0.05 + i * 0.005)) % 1;
      const pos = curves[i].getPoint(next);
      particleRefs.current[i]?.position.copy(pos);
      return next;
    });
  });

  // Initial rotation to face the route-marked side (Colombo / South Asia region) toward camera
  // Colombo is at ~80°E longitude. We rotate the group so this faces the camera.
  const initialGroupRotation: [number, number, number] = [0, -1.4, 0]; // ~ -80° in radians

  return (
    <group ref={groupRef} rotation={initialGroupRotation}>
      {/* ── Realistic Earth with day/night shader ── */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[R, 128, 128]} />
        <EarthMaterial
          colorMap={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          nightMap={nightMap}
          cloudsAlpha={cloudsMap}
        />
      </mesh>

      {/* ── Route Lines ── */}
      {tubeGeoms.map((geom, i) => (
        <mesh key={`rt${i}`} geometry={geom}>
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* ── Colombo Hub ── */}
      <mesh position={hubPos[0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial color="#eab308" blending={THREE.AdditiveBlending} />
      </mesh>

      {/* ── Other Hub Markers ── */}
      {hubPos.slice(1).map((pos, i) => (
        <mesh key={`hub${i}`} position={pos}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#f97316" blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* ── Routing Particles ── */}
      {curves.map((_, i) => (
        <mesh
          key={`pt${i}`}
          ref={el => { if (el) particleRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#fef08a" blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function GlobeLoader() {
  return (
    <mesh>
      <sphereGeometry args={[R, 32, 32]} />
      <meshStandardMaterial color="#1e293b" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function EarthScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On mobile, pull camera further back to prevent edge clipping
  const cameraPosition: [number, number, number] = isMobile ? [0, 0.3, 6.2] : [0, 0.3, 5.2];

  return (
    <div className="w-full h-full min-h-[250px] sm:min-h-[350px] lg:min-h-[600px]">
      <Canvas
        camera={{ position: cameraPosition, fov: isMobile ? 45 : 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<GlobeLoader />}>
          {/* Sun-like key light from upper-right */}
          <ambientLight intensity={0.08} />
          <directionalLight position={[5, 3, 5]} intensity={1.6} color="#fff8f0" />
          {/* Soft fill from opposite side — deep blue space bounce */}
          <directionalLight position={[-6, -2, -4]} intensity={0.15} color="#1a2a4a" />

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