import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";

const Chip = () => (
  <group position={[0, -0.4, 0]}>
    <mesh>
      <boxGeometry args={[1.7, 0.22, 1.7]} />
      <meshStandardMaterial color="#1b1b1f" metalness={0.85} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.14, 0]}>
      <boxGeometry args={[0.72, 0.07, 0.72]} />
      <meshStandardMaterial color="#b5b5b5" metalness={0.9} roughness={0.2} wireframe />
    </mesh>
    {Array.from({ length: 40 }).map((_, i) => {
      const side = Math.floor(i / 10);
      const t = (i % 10) / 9 - 0.5;
      const pos = [
        [t * 1.55, -0.17, -0.93],
        [t * 1.55, -0.17, 0.93],
        [-0.93, -0.17, t * 1.55],
        [0.93, -0.17, t * 1.55],
      ][side];
      return (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.05, 0.13, 0.05]} />
          <meshStandardMaterial color="#cfcfcf" metalness={1} roughness={0.25} />
        </mesh>
      );
    })}
  </group>
);

const RamStick = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <boxGeometry args={[1.9, 0.55, 0.07]} />
      <meshStandardMaterial color="#16161a" metalness={0.7} roughness={0.35} />
    </mesh>
    {[-0.72, -0.36, 0, 0.36, 0.72].map((x) => (
      <mesh key={x} position={[x, 0, 0.055]}>
        <boxGeometry args={[0.22, 0.3, 0.03]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.9} roughness={0.3} wireframe />
      </mesh>
    ))}
  </group>
);

const Fan = ({ position }) => {
  const blades = useRef();
  useFrame((_, delta) => {
    if (blades.current) blades.current.rotation.z += delta * 2.6;
  });
  return (
    <group position={position} rotation={[Math.PI / 2.6, 0.35, 0]}>
      <mesh>
        <torusGeometry args={[0.62, 0.05, 12, 48]} />
        <meshStandardMaterial color="#a8a8a8" wireframe transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.25} />
      </mesh>
      <group ref={blades}>
        {Array.from({ length: 7 }).map((_, i) => (
          <group key={i} rotation={[0, 0, (i / 7) * Math.PI * 2]}>
            <mesh position={[0, 0.32, 0]} rotation={[0.55, 0, 0]}>
              <boxGeometry args={[0.14, 0.44, 0.02]} />
              <meshStandardMaterial color="#c4c4c4" metalness={0.8} roughness={0.3} transparent opacity={0.85} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

const PortHub = ({ position }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={[1.15, 0.5, 0.4]} />
      <meshStandardMaterial color="#17171b" metalness={0.75} roughness={0.3} />
    </mesh>
    {[-0.32, 0, 0.32].map((x) => (
      <mesh key={x} position={[x, 0, 0.21]}>
        <boxGeometry args={[0.2, 0.12, 0.03]} />
        <meshStandardMaterial color="#050505" metalness={0.4} roughness={0.6} />
      </mesh>
    ))}
  </group>
);

const Scene = () => {
  const g = useRef();
  useFrame((state, delta) => {
    if (!g.current) return;
    g.current.rotation.y += delta * 0.15;
    const { x, y } = state.pointer;
    g.current.position.x += (x * 0.5 - g.current.position.x) * 0.03;
    g.current.position.y += (-y * 0.3 - g.current.position.y) * 0.03;
  });
  return (
    <group ref={g}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <Chip />
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.9}>
        <RamStick position={[-1.7, 0.7, -0.4]} rotation={[0.2, 0.5, 0.12]} />
        <RamStick position={[-1.5, 1.15, -0.75]} rotation={[0.25, 0.55, 0.1]} />
      </Float>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.7}>
        <Fan position={[1.75, 0.65, -0.3]} />
      </Float>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.8}>
        <PortHub position={[1.45, -0.95, 0.35]} />
      </Float>
      <Sparkles count={70} scale={[7, 5, 5]} size={1.4} speed={0.25} color="#ffffff" opacity={0.35} />
    </group>
  );
};

export const Hero3D = () => (
  <div className="absolute inset-0 z-0" data-testid="hero-3d-canvas" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 8]} intensity={1.4} />
      <pointLight position={[-6, -4, 2]} intensity={0.6} color="#ffffff" />
      <Scene />
    </Canvas>
  </div>
);

