import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

const Knot = () => {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.y += delta * 0.18;
    const { x, y } = state.pointer;
    ref.current.position.x += (x * 0.7 - ref.current.position.x) * 0.03;
    ref.current.position.y += (-y * 0.45 - ref.current.position.y) * 0.03;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[1.15, 0.34, 220, 36]} />
        <meshStandardMaterial
          color="#9a9a9a"
          wireframe
          transparent
          opacity={0.3}
          roughness={0.35}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
};

export const Hero3D = () => (
  <div className="absolute inset-0 z-0" data-testid="hero-3d-canvas" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 8]} intensity={1.4} />
      <pointLight position={[-6, -4, 2]} intensity={0.6} color="#ffffff" />
      <Knot />
    </Canvas>
  </div>
);

