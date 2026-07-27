import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WebGLSettings } from '../../types';
import { soundFx } from '../../utils/audio';

interface Scene3DProps {
  settings: WebGLSettings;
  onTelemetryUpdate?: (data: {
    fps: number;
    posX: number;
    posY: number;
    posZ: number;
    rotX: number;
    rotY: number;
    scrollProgress: number;
    activeShape: string;
  }) => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ settings, onTelemetryUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const scrollSpeedRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050711, 0.025);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // --- 2. LIGHTING (ATMOSPHERIC CHROME & VIOLET RIM STUDIO LIGHTING) ---
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 0.8);
    scene.add(ambientLight);

    // Front-Left White Key Light for specular chrome reflections
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    // Front-Right Soft Blue Fill Light
    const fillLight = new THREE.DirectionalLight(0x60a5fa, 2.5);
    fillLight.position.set(-6, 4, 6);
    scene.add(fillLight);

    // Signature Violet / Deep Purple Rim Light (recreates the vivid violet edge reflection in the photo)
    const purpleRimLight = new THREE.DirectionalLight(0x9333ea, 12);
    purpleRimLight.position.set(8, -2, -6);
    scene.add(purpleRimLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 10, 25);
    purplePointLight.position.set(-5, -3, 3);
    scene.add(purplePointLight);

    const topSpecularLight = new THREE.SpotLight(0xffffff, 8, 30, Math.PI / 4, 0.5);
    topSpecularLight.position.set(0, 12, 5);
    scene.add(topSpecularLight);

    // Color preset values
    let primaryColor = 0x6366f1;
    let accentColor = 0xa855f7;
    let particleColor = 0x818cf8;

    if (settings.colorPreset === 'gold') {
      primaryColor = 0xf59e0b;
      accentColor = 0xef4444;
      particleColor = 0xfcd34d;
      scene.fog.color.setHex(0x0d0903);
    } else if (settings.colorPreset === 'emerald') {
      primaryColor = 0x10b981;
      accentColor = 0x06b6d4;
      particleColor = 0x6ee7b7;
      scene.fog.color.setHex(0x030f0a);
    } else if (settings.colorPreset === 'cosmos') {
      primaryColor = 0xc084fc;
      accentColor = 0x6366f1;
      particleColor = 0xe9d5ff;
      scene.fog.color.setHex(0x0a0412);
    } else {
      scene.fog.color.setHex(0x050711);
    }

    // --- 3. HIGH-PRECISION 3D RETRO CHROME ROCKET OBJECT GROUP ---
    const mainGroup = new THREE.Group();
    mainGroup.position.set(2.2, 0, 0); // Initial position on the right side of the Hero screen
    scene.add(mainGroup);

    const rocketGroup = new THREE.Group();
    mainGroup.add(rocketGroup);

    // Dark Glossy Chrome Body Material (matches reference photo's polished dark chrome finish)
    const darkChromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x12151d,
      metalness: 0.98,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      wireframe: settings.wireframe
    });

    // Metallic Silver Trim Material
    const silverMetalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd1d5db,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 0.8,
      wireframe: settings.wireframe
    });

    // Dark Mirror Glass Porthole Window Material
    const windowGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x030712,
      emissive: 0x312e81,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02
    });

    // Dark Chrome Fin Material
    const finMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      wireframe: settings.wireframe
    });

    // 1. Rocket Smooth Aerodynamic Hull (Lathe Geometry for seamless retro torpedo curves)
    const curveSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.4, 0),
      new THREE.Vector3(0.28, 2.2, 0),
      new THREE.Vector3(0.70, 1.6, 0),
      new THREE.Vector3(0.98, 0.8, 0),
      new THREE.Vector3(1.05, 0.0, 0),
      new THREE.Vector3(0.98, -0.8, 0),
      new THREE.Vector3(0.82, -1.4, 0),
      new THREE.Vector3(0.68, -1.75, 0),
      new THREE.Vector3(0.50, -1.85, 0),
      new THREE.Vector3(0, -1.85, 0)
    ]);

    const splinePoints = curveSpline.getPoints(60);
    const lathePoints = splinePoints.map((p) => new THREE.Vector2(p.x, p.y));
    const bodyGeo = new THREE.LatheGeometry(lathePoints, 48);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkChromeMaterial);
    rocketGroup.add(bodyMesh);

    // 2. Circular Porthole / Window with Dual Metallic Bezel (Front of fuselage)
    const windowGroup = new THREE.Group();
    windowGroup.position.set(0, 0.55, 0.98);
    windowGroup.rotation.x = -0.15; // Match body taper angle

    // Outer Chrome Ring Bezel
    const outerBezelGeo = new THREE.TorusGeometry(0.38, 0.05, 16, 40);
    const outerBezelMesh = new THREE.Mesh(outerBezelGeo, silverMetalMaterial);
    windowGroup.add(outerBezelMesh);

    // Inner Bezel Inset Ring
    const innerBezelGeo = new THREE.TorusGeometry(0.30, 0.03, 16, 40);
    const innerBezelMesh = new THREE.Mesh(innerBezelGeo, darkChromeMaterial);
    windowGroup.add(innerBezelMesh);

    // Window Glass Lens
    const windowGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.06, 32);
    const windowMesh = new THREE.Mesh(windowGeo, windowGlassMaterial);
    windowMesh.rotation.x = Math.PI / 2;
    windowGroup.add(windowMesh);

    rocketGroup.add(windowGroup);

    // 3. Engine Nozzle at Base
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.y = -1.95;

    const nozzleRingGeo = new THREE.TorusGeometry(0.65, 0.08, 16, 36);
    const nozzleRingMesh = new THREE.Mesh(nozzleRingGeo, silverMetalMaterial);
    nozzleRingMesh.rotation.x = Math.PI / 2;
    nozzleGroup.add(nozzleRingMesh);

    const nozzleConeGeo = new THREE.CylinderGeometry(0.55, 0.72, 0.35, 32, 1, true);
    const nozzleConeMesh = new THREE.Mesh(nozzleConeGeo, darkChromeMaterial);
    nozzleGroup.add(nozzleConeMesh);

    rocketGroup.add(nozzleGroup);

    // 4. Swept-Back Aerodynamic Curved Fins (3 fins placed at 120-degree intervals)
    const finCount = 3;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0.5);
    finShape.bezierCurveTo(0.4, 0.4, 1.15, -0.1, 1.35, -1.1); // Outer curved sweep
    finShape.bezierCurveTo(1.3, -1.45, 0.95, -1.6, 0.72, -1.55); // Rounded tip
    finShape.bezierCurveTo(0.4, -1.2, 0.1, -0.8, 0, -0.9); // Curve back to hull
    finShape.closePath();

    const finExtrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
    // Center geometry depth
    finGeo.center();

    for (let i = 0; i < finCount; i++) {
      const angle = (i * Math.PI * 2) / finCount;
      const finMesh = new THREE.Mesh(finGeo, finMaterial);

      const radiusOffset = 0.82;
      finMesh.position.set(
        Math.sin(angle) * radiusOffset,
        -1.15,
        Math.cos(angle) * radiusOffset
      );
      finMesh.rotation.y = angle - Math.PI / 2;
      rocketGroup.add(finMesh);
    }

    // 5. High-Impact Plasma Thruster Exhaust Flame (Rebuilt Top-Anchored Geometry)
    const flameGroup = new THREE.Group();
    flameGroup.position.y = -2.15; // Placed at engine nozzle exit level

    // Glowing Engine Light (Dynamic Pulsing Under-glow)
    const enginePointLight = new THREE.PointLight(0x38bdf8, 12, 16);
    enginePointLight.position.set(0, -0.2, 0);
    flameGroup.add(enginePointLight);

    // Nozzle Interior Hot White Core Disk
    const nozzleGlowGeo = new THREE.CylinderGeometry(0.55, 0.40, 0.2, 32);
    const nozzleGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });
    const nozzleGlowMesh = new THREE.Mesh(nozzleGlowGeo, nozzleGlowMat);
    nozzleGlowMesh.position.y = -0.1;
    flameGroup.add(nozzleGlowMesh);

    // Outer Ion Aura Plume (Top-anchored at y=0, extends downward)
    const outerFlameGeo = new THREE.ConeGeometry(0.70, 3.0, 32, 1, true);
    outerFlameGeo.rotateX(Math.PI);
    outerFlameGeo.translate(0, -1.5, 0); // Anchors top base at y = 0
    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const outerFlameMesh = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    outerFlameMesh.position.set(0, 0, 0);
    flameGroup.add(outerFlameMesh);

    // Middle Electric Blue/Violet Plasma Jet (Top-anchored)
    const midFlameGeo = new THREE.ConeGeometry(0.48, 2.3, 32, 1, true);
    midFlameGeo.rotateX(Math.PI);
    midFlameGeo.translate(0, -1.15, 0); // Anchors top base at y = 0
    const midFlameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const midFlameMesh = new THREE.Mesh(midFlameGeo, midFlameMat);
    midFlameMesh.position.set(0, 0, 0);
    flameGroup.add(midFlameMesh);

    // Inner White Hot Plasma Needle Core (Top-anchored)
    const innerFlameGeo = new THREE.ConeGeometry(0.28, 1.6, 24);
    innerFlameGeo.rotateX(Math.PI);
    innerFlameGeo.translate(0, -0.8, 0); // Anchors top base at y = 0
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });
    const innerFlameMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlameMesh.position.set(0, 0, 0);
    flameGroup.add(innerFlameMesh);

    // Mach Diamond Shockwave Octahedrons along Exhaust Jet
    const machRings: THREE.Mesh[] = [];
    const ringCount = 3;
    for (let r = 0; r < ringCount; r++) {
      const ringGeo = new THREE.OctahedronGeometry(0.22 - r * 0.04, 0);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r === 0 ? 0xffffff : (r === 1 ? 0x38bdf8 : 0xd946ef),
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = -0.6 - r * 0.65;
      flameGroup.add(ringMesh);
      machRings.push(ringMesh);
    }

    rocketGroup.add(flameGroup);

    // Ambient Orbiting Particle Ring around Rocket
    const ringGeo = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.6,
      metalness: 0.9
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.8;
    mainGroup.add(ringMesh);

    // --- 4. THRUSTER PARTICLES EXHAUST TRAIL ---
    const exhaustCount = 420;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPositions = new Float32Array(exhaustCount * 3);
    const exhaustColors = new Float32Array(exhaustCount * 3);
    const exhaustSpeeds = new Float32Array(exhaustCount);
    const exhaustAngles = new Float32Array(exhaustCount);

    for (let i = 0; i < exhaustCount; i++) {
      exhaustPositions[i * 3] = (Math.random() - 0.5) * 0.2;
      exhaustPositions[i * 3 + 1] = -Math.random() * 6.5;
      exhaustPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      exhaustSpeeds[i] = 0.08 + Math.random() * 0.12;
      exhaustAngles[i] = Math.random() * Math.PI * 2;

      // Initial White-Cyan Gradient
      exhaustColors[i * 3] = 0.22 + Math.random() * 0.78;
      exhaustColors[i * 3 + 1] = 0.74 + Math.random() * 0.26;
      exhaustColors[i * 3 + 2] = 0.97;
    }

    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
    exhaustGeo.setAttribute('color', new THREE.BufferAttribute(exhaustColors, 3));

    const exhaustMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const exhaustParticles = new THREE.Points(exhaustGeo, exhaustMat);
    exhaustParticles.position.y = -2.15; // Attached to nozzle
    rocketGroup.add(exhaustParticles);

    // --- 4B. WORLD-SPACE PERSISTENT ROCKET MOTION TRAIL ---
    // Soft radial gradient canvas texture for glowing particles
    const particleGlowTexture = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.25, 'rgba(56, 189, 248, 0.9)');
        grad.addColorStop(0.6, 'rgba(192, 132, 252, 0.45)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    })();

    const trailParticleCount = Math.floor(750 * settings.particleDensity);
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailParticleCount * 3);
    const trailColors = new Float32Array(trailParticleCount * 3);
    const trailSizes = new Float32Array(trailParticleCount);

    const trailLives = new Float32Array(trailParticleCount);
    const trailMaxLives = new Float32Array(trailParticleCount);
    const trailVelocities = new Float32Array(trailParticleCount * 3);

    for (let i = 0; i < trailParticleCount; i++) {
      trailPositions[i * 3] = 9999;
      trailPositions[i * 3 + 1] = 9999;
      trailPositions[i * 3 + 2] = 9999;

      trailColors[i * 3] = 0.22;
      trailColors[i * 3 + 1] = 0.74;
      trailColors[i * 3 + 2] = 0.97;

      trailSizes[i] = 0.22 + Math.random() * 0.25;

      trailLives[i] = 0;
      trailMaxLives[i] = 1.0 + Math.random() * 1.6;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    trailGeo.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));

    const trailMat = new THREE.PointsMaterial({
      size: 0.28,
      map: particleGlowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const worldRocketTrail = new THREE.Points(trailGeo, trailMat);
    scene.add(worldRocketTrail);

    // --- 5. DEEP SPACE BACKDROP & NEBULAE STARFIELD ---
    // Tier 1: Distant Twinkling Star Field
    const starCount = Math.floor(2200 * settings.particleDensity);
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const baseStarColors = [
      new THREE.Color(0xffffff), // Crisp White
      new THREE.Color(0x38bdf8), // Electric Cyan
      new THREE.Color(0xc084fc), // Soft Purple
      new THREE.Color(0xa7f3d0), // Mint Gold
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;

      const c = baseStarColors[Math.floor(Math.random() * baseStarColors.length)];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;

      starSizes[i] = 0.04 + Math.random() * 0.12;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Tier 2: Drifting Cosmic Dust Grains (Close to camera for 3D depth speed feel)
    const dustCount = Math.floor(450 * settings.particleDensity);
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 35;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const cosmicDust = new THREE.Points(dustGeo, dustMat);
    scene.add(cosmicDust);

    // Tier 3: Glowing Space Nebulae Clouds (Volumetric Soft Colored Disks)
    const nebulaeGroup = new THREE.Group();
    const nebulaeColors = [0x4c1d95, 0x1e3a8a, 0x581c87, 0x0284c7];
    
    for (let n = 0; n < 5; n++) {
      const nebGeo = new THREE.PlaneGeometry(28 + n * 6, 28 + n * 6);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.28)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
        grad.addColorStop(1, 'rgba(5, 7, 17, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
      }
      const nebTex = new THREE.CanvasTexture(canvas);
      const nebMat = new THREE.MeshBasicMaterial({
        map: nebTex,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const nebMesh = new THREE.Mesh(nebGeo, nebMat);
      nebMesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        -25 - n * 10
      );
      nebMesh.rotation.z = Math.random() * Math.PI;
      nebulaeGroup.add(nebMesh);
    }
    scene.add(nebulaeGroup);

    // --- 6. LISTENERS ---
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = Math.abs(currentScrollY - lastScrollYRef.current);
      scrollSpeedRef.current = deltaY;
      lastScrollYRef.current = currentScrollY;

      // Update ambient audio soundtrack pitch based on scroll speed!
      soundFx.updateScrollPitch(deltaY);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollProgressRef.current = Math.min(Math.max(currentScrollY / totalScroll, 0), 1);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    // --- 7. ANIMATION LOOP ---
    let animFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();
    let lastFrameTime = performance.now();
    let fps = 60;

    const animate = () => {
      const time = clock.getElapsedTime();

      // Decay scroll speed value smoothly
      scrollSpeedRef.current *= 0.92;
      soundFx.updateScrollPitch(scrollSpeedRef.current);

      // Smooth damp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // --- WORLD-CLASS 3D ROCKET TRAJECTORY & BANKING PHYSICS ---
      const progress = scrollProgressRef.current; // 0.0 to 1.0

      // Catmull-Rom style 3D S-Curve Trajectory across page sections starting on the right side (+2.2)
      const sideSwing = 2.2 * Math.cos(progress * Math.PI * 3.0); 
      const altitudeWave = Math.cos(progress * Math.PI * 2.5) * 0.8;
      
      // Mouse interactive guidance with smooth spring damper
      const targetX = sideSwing + mouseRef.current.x * 0.9;
      const targetY = altitudeWave + mouseRef.current.y * 0.8 + Math.sin(time * 2.2) * 0.18;
      const targetZ = -progress * 2.8;

      // Track directional velocity vector for realistic aerodynamic banking & pitch
      const prevX = mainGroup.position.x;
      const prevY = mainGroup.position.y;

      // Smooth group interpolation (0.07 dampening)
      mainGroup.position.x += (targetX - mainGroup.position.x) * 0.07;
      mainGroup.position.y += (targetY - mainGroup.position.y) * 0.07;
      mainGroup.position.z += (targetZ - mainGroup.position.z) * 0.07;

      const vx = mainGroup.position.x - prevX;
      const vy = mainGroup.position.y - prevY;

      const speed = settings.spinSpeed;
      
      // Aerodynamic Banking (Roll into turn), Pitch (Climb/Dive), and Yaw (Turn Heading)
      const rollBankZ = -vx * 4.2 + Math.cos(progress * Math.PI * 3.8) * 0.28;
      const pitchX = vy * 3.5 - 0.15 + Math.cos(time * 1.8) * 0.06;
      const yawY = time * 0.45 * speed + vx * 2.0 + progress * Math.PI * 2;

      rocketGroup.rotation.z += (rollBankZ - rocketGroup.rotation.z) * 0.1;
      rocketGroup.rotation.x += (pitchX - rocketGroup.rotation.x) * 0.1;
      rocketGroup.rotation.y += (yawY - rocketGroup.rotation.y) * 0.1;

      ringMesh.rotation.z = time * 0.35 * speed;
      ringMesh.rotation.y = time * 0.25 * speed;

      // High-Impact Thruster Plasma Flame Pulse & Mach Diamond Wave Animation
      const flameFlicker = 0.85 + Math.sin(time * 35) * 0.18 + Math.random() * 0.1;
      const boostStretch = 1.0 + (scrollSpeedRef.current / 80) * 1.2 + Math.abs(vx) * 3.0;

      outerFlameMesh.scale.set(flameFlicker, boostStretch * (1.0 + Math.sin(time * 25) * 0.15), flameFlicker);
      midFlameMesh.scale.set(flameFlicker * 0.9, boostStretch * (1.0 + Math.cos(time * 30) * 0.15), flameFlicker * 0.9);
      innerFlameMesh.scale.set(flameFlicker * 0.8, boostStretch * (1.0 + Math.sin(time * 40) * 0.2), flameFlicker * 0.8);

      // Engine Underglow Light Pulse
      enginePointLight.intensity = 8.0 + Math.sin(time * 30) * 4.0 + (scrollSpeedRef.current / 80) * 12;

      // Mach Diamond Pulsating Shockwave Disks
      machRings.forEach((ring, idx) => {
        const ringPulse = 1.0 + Math.sin(time * 22 + idx * 1.5) * 0.3;
        ring.scale.set(ringPulse, ringPulse, ringPulse);
        ring.rotation.z = time * (3 + idx);
      });

      // Animate Exhaust Particles shooting downward from nozzle (local y=0)
      const posAttr = exhaustParticles.geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = exhaustParticles.geometry.attributes.color as THREE.BufferAttribute;

      for (let i = 0; i < exhaustCount; i++) {
        let py = posAttr.getY(i);
        py -= exhaustSpeeds[i] * (1.0 + (scrollSpeedRef.current / 60) * 1.5 + Math.abs(vx) * 2.5);

        if (py < -7.5) {
          py = 0.0; // Reset right at nozzle opening
          posAttr.setX(i, (Math.random() - 0.5) * 0.08);
          posAttr.setZ(i, (Math.random() - 0.5) * 0.08);
          exhaustAngles[i] = Math.random() * Math.PI * 2;
        }

        // Conical spray expansion as particle travels downward
        const dist = Math.abs(py);
        const sprayRadius = 0.08 + dist * 0.16;
        const angle = exhaustAngles[i];
        
        posAttr.setX(i, Math.cos(angle + time) * sprayRadius + (Math.random() - 0.5) * 0.04);
        posAttr.setY(i, py);
        posAttr.setZ(i, Math.sin(angle + time) * sprayRadius + (Math.random() - 0.5) * 0.04);

        // Dynamic Color Shift: White/Cyan Core -> Electric Purple -> Flame Crimson
        if (dist < 1.8) {
          colAttr.setXYZ(i, 0.7, 0.95, 1.0); // White Hot Cyan
        } else if (dist < 4.2) {
          colAttr.setXYZ(i, 0.85, 0.35, 0.95); // Magenta Violet
        } else {
          colAttr.setXYZ(i, 0.95, 0.2, 0.3); // Deep Flame Crimson Ember
        }
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // --- 3D WORLD-SPACE PERSISTENT ROCKET MOTION TRAIL ANIMATION ---
      const nowTime = performance.now();
      const delta = Math.min(0.05, (nowTime - lastFrameTime) / 1000);
      lastFrameTime = nowTime;

      if (settings.trailEnabled && worldRocketTrail) {
        worldRocketTrail.visible = true;

        // Compute exact world position of the thruster nozzle
        const localNozzleOffset = new THREE.Vector3(0, -2.15, 0);
        localNozzleOffset.applyEuler(rocketGroup.rotation);
        const nozzleX = mainGroup.position.x + localNozzleOffset.x;
        const nozzleY = mainGroup.position.y + localNozzleOffset.y;
        const nozzleZ = mainGroup.position.z + localNozzleOffset.z;

        // Emission rate scales with rocket trajectory velocity + scroll boost
        const rocketSpeed = Math.sqrt(vx * vx + vy * vy) + Math.abs(scrollSpeedRef.current) / 35 + 0.05;
        const emitQuota = Math.min(16, Math.max(3, Math.floor(rocketSpeed * 55)));

        let emitted = 0;

        const tPosAttr = worldRocketTrail.geometry.attributes.position as THREE.BufferAttribute;
        const tColAttr = worldRocketTrail.geometry.attributes.color as THREE.BufferAttribute;

        for (let i = 0; i < trailParticleCount; i++) {
          if (trailLives[i] <= 0) {
            if (emitted < emitQuota) {
              emitted++;
              const mLife = 0.9 + Math.random() * 1.5;
              trailLives[i] = mLife;
              trailMaxLives[i] = mLife;

              // Spawn at rocket thruster nozzle with subtle radial dispersion
              const dispersion = 0.16;
              tPosAttr.setXYZ(
                i,
                nozzleX + (Math.random() - 0.5) * dispersion,
                nozzleY + (Math.random() - 0.5) * dispersion,
                nozzleZ + (Math.random() - 0.5) * dispersion
              );

              // Velocity: reaction against rocket motion vector + soft explosion spray
              const sprayAngle = Math.random() * Math.PI * 2;
              const sprayRadius = 0.015 + Math.random() * 0.025;

              trailVelocities[i * 3] = -vx * 0.75 + Math.cos(sprayAngle) * sprayRadius;
              trailVelocities[i * 3 + 1] = -0.035 - vy * 0.75 + Math.sin(sprayAngle) * sprayRadius;
              trailVelocities[i * 3 + 2] = (Math.random() - 0.5) * sprayRadius;

              // Start with bright white/hot cyan spark
              tColAttr.setXYZ(i, 0.9, 0.95, 1.0);
            }
          } else {
            // Particle decay & motion
            trailLives[i] -= delta;
            const lifeRatio = Math.max(0, trailLives[i] / trailMaxLives[i]); // 1.0 -> 0.0

            let px = tPosAttr.getX(i) + trailVelocities[i * 3];
            let py = tPosAttr.getY(i) + trailVelocities[i * 3 + 1];
            let pz = tPosAttr.getZ(i) + trailVelocities[i * 3 + 2];

            // Cosmic air drag / turbulence dampening
            trailVelocities[i * 3] *= 0.96;
            trailVelocities[i * 3 + 1] *= 0.96;
            trailVelocities[i * 3 + 2] *= 0.96;

            // Micro turbulence wave
            py += Math.sin(time * 4 + i) * 0.0012;

            tPosAttr.setXYZ(i, px, py, pz);

            // Futuristic color gradient along lifeRatio:
            // 1.0 -> 0.65: Pure Electric Cyan / Diamond White
            // 0.65 -> 0.3: Vibrant Neon Purple / Magenta
            // 0.3 -> 0.0: Deep Cosmic Amethyst / Crimson Glow
            let r = 0.2, g = 0.8, b = 1.0;
            const alphaFactor = Math.pow(lifeRatio, 0.85);

            if (lifeRatio > 0.65) {
              const t = (lifeRatio - 0.65) / 0.35;
              r = 0.3 + t * 0.7;
              g = 0.85 + t * 0.15;
              b = 1.0;
            } else if (lifeRatio > 0.3) {
              const t = (lifeRatio - 0.3) / 0.35;
              r = 0.75 - t * 0.45;
              g = 0.3 + t * 0.55;
              b = 0.95;
            } else {
              const t = lifeRatio / 0.3;
              r = 0.85 * t;
              g = 0.12 * t;
              b = 0.45 * t;
            }

            tColAttr.setXYZ(i, r * alphaFactor, g * alphaFactor, b * alphaFactor);
          }
        }

        tPosAttr.needsUpdate = true;
        tColAttr.needsUpdate = true;
      } else if (worldRocketTrail) {
        worldRocketTrail.visible = false;
      }

      // Space Starfield & Cosmic Dust Movement
      starField.rotation.y = time * 0.008 * speed;
      starField.rotation.x = Math.sin(time * 0.005) * 0.02;

      cosmicDust.rotation.y = time * 0.015 * speed;
      cosmicDust.position.y = -Math.sin(time * 0.5) * 0.5;

      nebulaeGroup.rotation.z = time * 0.003;

      // Camera Parallax
      camera.position.x = mouseRef.current.x * 0.3;
      camera.position.y = mouseRef.current.y * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      // FPS update
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 500) {
        fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;

        if (onTelemetryUpdate) {
          onTelemetryUpdate({
            fps,
            posX: parseFloat(mainGroup.position.x.toFixed(2)),
            posY: parseFloat(mainGroup.position.y.toFixed(2)),
            posZ: parseFloat(mainGroup.position.z.toFixed(2)),
            rotX: parseFloat(rocketGroup.rotation.x.toFixed(2)),
            rotY: parseFloat(rocketGroup.rotation.y.toFixed(2)),
            scrollProgress: Math.round(progress * 100),
            activeShape: 'rocket'
          });
        }
      }

      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      bodyGeo.dispose();
      darkChromeMaterial.dispose();
      silverMetalMaterial.dispose();
      windowGlassMaterial.dispose();
      finMaterial.dispose();
      outerBezelGeo.dispose();
      innerBezelGeo.dispose();
      windowGeo.dispose();
      nozzleRingGeo.dispose();
      nozzleConeGeo.dispose();
      nozzleGlowGeo.dispose();
      nozzleGlowMat.dispose();
      finGeo.dispose();
      outerFlameGeo.dispose();
      outerFlameMat.dispose();
      midFlameGeo.dispose();
      midFlameMat.dispose();
      innerFlameGeo.dispose();
      innerFlameMat.dispose();
      machRings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      ringGeo.dispose();
      ringMat.dispose();
      exhaustGeo.dispose();
      exhaustMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [settings]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
