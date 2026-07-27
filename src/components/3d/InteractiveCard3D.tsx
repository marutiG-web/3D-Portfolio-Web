import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface InteractiveCard3DProps {
  category: 'fullstack' | 'data' | 'ai' | 'webgl' | string;
  image: string;
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const InteractiveCard3D: React.FC<InteractiveCard3DProps> = ({
  category,
  image,
  title,
  children,
  onClick,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // Mouse tilt effect calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0 to rect.width
    const y = e.clientY - rect.top;  // 0 to rect.height

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  // Three.js 3D Micro Canvas inside Card Header
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.parentElement?.clientWidth || 300;
    const height = 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mouseLight = new THREE.PointLight(0x38bdf8, 5, 10);
    mouseLight.position.set(2, 2, 3);
    scene.add(mouseLight);

    const purpleLight = new THREE.PointLight(0xd946ef, 4, 10);
    purpleLight.position.set(-2, -2, 2);
    scene.add(purpleLight);

    // Create Category-Specific 3D Geometry
    let meshGroup = new THREE.Group();
    scene.add(meshGroup);

    if (category === 'data') {
      // 3D Point-Cloud Data Globe
      const geo = new THREE.IcosahedronGeometry(1.2, 2);
      const mat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.06,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geo, mat);
      meshGroup.add(points);

      const wireGeo = new THREE.IcosahedronGeometry(1.21, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      meshGroup.add(wire);
    } else if (category === 'fullstack') {
      // 3D Wireframe Micro-Architecture Cube Lattice
      const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5, 3, 3, 3);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        wireframe: true,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4
      });
      const cube = new THREE.Mesh(geo, mat);
      meshGroup.add(cube);

      const innerGeo = new THREE.OctahedronGeometry(0.7);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.9,
        roughness: 0.1
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      meshGroup.add(inner);
    } else if (category === 'ai') {
      // 3D Neural Network Synapse Cluster
      const count = 30;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2.6;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({ color: 0xd946ef, size: 0.12, transparent: true, opacity: 0.95 });
      const pMesh = new THREE.Points(pGeo, pMat);
      meshGroup.add(pMesh);

      const ringGeo = new THREE.TorusGeometry(1.3, 0.02, 16, 60);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      meshGroup.add(ring);
    } else {
      // 3D Liquid Metal Glossy Torus Knot (WebGL)
      const geo = new THREE.TorusKnotGeometry(0.85, 0.22, 100, 16);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        emissive: 0x6366f1,
        emissiveIntensity: 0.3,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0
      });
      const knot = new THREE.Mesh(geo, mat);
      meshGroup.add(knot);
    }

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      meshGroup.rotation.y = elapsedTime * 0.6;
      meshGroup.rotation.x = elapsedTime * 0.3;

      if (category === 'data') {
        meshGroup.rotation.z = Math.sin(elapsedTime) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const newWidth = canvas.parentElement.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [category]);

  return (
    <div
      ref={cardRef}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`group relative rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 cursor-pointer ${className}`}
    >
      {/* 3D WebGL Canvas + Background Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950/80">
        {/* Background Image with Blending */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        {/* Live Interactive Three.js Viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
        />

        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest backdrop-blur-md shadow-lg">
            3D {category}
          </span>
        </div>

        {/* Hover Glowing Frame Ring */}
        <div className="absolute inset-0 border-2 border-cyan-500/0 group-hover:border-cyan-500/40 rounded-3xl transition-all duration-500 z-20 pointer-events-none" />
      </div>

      {/* Card Content Children */}
      {children}
    </div>
  );
};
