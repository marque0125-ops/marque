"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  Zap, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Play, 
  Maximize2, 
  Eye, 
  EyeOff,
  Keyboard,
  Info
} from "lucide-react";

export default function ThreeDShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // UI Customization States
  const [paintColor, setPaintColor] = useState<string>("#f97316"); // Default orange
  const [activeCar, setActiveCar] = useState<string>("traxxas"); // traxxas, arrma, rlaarlo
  const [bodyExposedRatio, setBodyExposedRatio] = useState<number>(0); // 0 = closed, 1 = shell lifted
  const [isDriveMode, setIsDriveMode] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(true);
  const [isInternalsVisible, setIsInternalsVisible] = useState<boolean>(true);
  
  // Physics & Sound references for the driving loop
  const physicsRef = useRef({
    x: 0,
    z: 0,
    speed: 0,
    angle: 0,
    maxSpeed: 0.18,
    accel: 0.006,
    decel: 0.96,
    steerSpeed: 0.045,
    keys: { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false }
  });

  // Audio Synthesizer reference
  const audioRef = useRef<{
    context: AudioContext | null;
    oscillator: OscillatorNode | null;
    gainNode: GainNode | null;
  }>({
    context: null,
    oscillator: null,
    gainNode: null
  });

  // Three.js References for clean animation updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const bodyShellRef = useRef<THREE.Mesh | null>(null);
  const underglowRef = useRef<THREE.PointLight | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const steeringPivotsRef = useRef<THREE.Group[]>([]);
  const shocksRef = useRef<{ springMesh: THREE.Mesh; initialScaleY: number }[]>([]);
  const particleGroupRef = useRef<THREE.Points | null>(null);
  const particleDataRef = useRef<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number }[]>([]);
  const skidmarksRef = useRef<THREE.Line[]>([]);

  // Update selected car and properties
  useEffect(() => {
    if (activeCar === "traxxas") {
      setPaintColor("#f97316"); // Solar Flare Orange
      physicsRef.current.maxSpeed = 0.18;
      physicsRef.current.accel = 0.006;
    } else if (activeCar === "arrma") {
      setPaintColor("#e11d48"); // Venom Crimson
      physicsRef.current.maxSpeed = 0.28; // Insane highway speed
      physicsRef.current.accel = 0.009;
    } else {
      setPaintColor("#06b6d4"); // Cyberpunk Turquoise
      physicsRef.current.maxSpeed = 0.16;
      physicsRef.current.accel = 0.005;
    }
  }, [activeCar]);

  // Main Three.js Lifecycle
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. SCENE CREATION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");
    scene.fog = new THREE.FogExp2("#020617", 0.04);
    sceneRef.current = scene;

    // 2. CAMERA CREATION
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.5, 2.2, 4.5);
    cameraRef.current = camera;

    // 3. RENDERER CREATION
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. LIGHTS
    const ambientLight = new THREE.AmbientLight("#0f172a", 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffffff", 2.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const ringLight = new THREE.SpotLight("#ffffff", 4, 15, Math.PI / 4, 0.3, 1);
    ringLight.position.set(0, 5, 0);
    scene.add(ringLight);

    // 5. STYLISH SHOWROOM FLOOR (NEON GRID)
    const floorGeo = new THREE.PlaneGeometry(50, 50, 50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#030712",
      roughness: 0.3,
      metalness: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Showroom Grid Overlay
    const grid = new THREE.GridHelper(50, 50, "#f97316", "#1e293b");
    grid.position.y = 0.001;
    scene.add(grid);

    // Showroom boundary circle
    const boundaryGeo = new THREE.RingGeometry(5.95, 6.0, 64);
    const boundaryMat = new THREE.MeshBasicMaterial({ color: "#f97316", side: THREE.DoubleSide });
    const boundaryRing = new THREE.Mesh(boundaryGeo, boundaryMat);
    boundaryRing.rotation.x = -Math.PI / 2;
    boundaryRing.position.y = 0.002;
    scene.add(boundaryRing);

    // 6. PROCEDURAL TEXTURES (CARBON FIBER & TIRE TREADS)
    const createCarbonTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillRect(16, 16, 16, 16);
      ctx.fillStyle = "#374151";
      ctx.fillRect(8, 8, 8, 8);
      ctx.fillRect(24, 24, 8, 8);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
      return texture;
    };

    const createTireTreadTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = "#0f172a";
      // Chevron style tread marks
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000000";
      for (let i = 0; i < 64; i += 16) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(32, i + 8);
        ctx.lineTo(64, i);
        ctx.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 6);
      return texture;
    };

    const carbonMap = createCarbonTexture();
    const tireTreadMap = createTireTreadTexture();

    // 7. REALISTIC HELICAL COIL SPRING BUILDER
    // Generates a true mathematical helix spline tube for realistic suspension
    const buildHelicalCoilSpring = (springHeight: number, coilRadius: number, paintColor: string) => {
      const points = [];
      const coilCount = 7.5;
      const pointCount = 100;
      
      for (let i = 0; i <= pointCount; i++) {
        const t = i / pointCount;
        const angle = t * coilCount * Math.PI * 2;
        // Helix coordinates
        const x = Math.cos(angle) * coilRadius;
        const y = (t - 0.5) * springHeight; // Center on origin
        const z = Math.sin(angle) * coilRadius;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.016, 8, false);
      const springMat = new THREE.MeshStandardMaterial({
        color: paintColor,
        metalness: 0.8,
        roughness: 0.2
      });
      
      return new THREE.Mesh(tubeGeo, springMat);
    };

    // 8. BUILD DYNAMIC 3D RC CAR MODEL
    const buildRCCar = (carKey: string, colorHex: string) => {
      if (carGroupRef.current) {
        scene.remove(carGroupRef.current);
      }

      wheelsRef.current = [];
      steeringPivotsRef.current = [];
      shocksRef.current = [];

      const carGroup = new THREE.Group();
      carGroup.position.set(0, 0.1, 0);
      scene.add(carGroup);
      carGroupRef.current = carGroup;

      const carbonMat = new THREE.MeshStandardMaterial({
        color: "#1e1e24",
        roughness: 0.2,
        metalness: 0.9,
        bumpMap: carbonMap,
        bumpScale: 0.02
      });

      const anodizedMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.95,
        roughness: 0.15
      });

      const metalChassisMat = new THREE.MeshStandardMaterial({
        color: "#d1d5db",
        metalness: 0.9,
        roughness: 0.2
      });

      const blackPlasticMat = new THREE.MeshStandardMaterial({
        color: "#111827",
        roughness: 0.8
      });

      // --- CHASSIS TUB ---
      const chassisGeo = new THREE.BoxGeometry(1.6, 0.1, 0.7);
      const chassis = new THREE.Mesh(chassisGeo, carbonMat);
      chassis.position.y = 0.25;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      carGroup.add(chassis);

      // Aluminum bottom skid plate
      const plateGeo = new THREE.BoxGeometry(1.62, 0.02, 0.6);
      const plate = new THREE.Mesh(plateGeo, metalChassisMat);
      plate.position.y = 0.19;
      carGroup.add(plate);

      // Front & Rear bumper blocks
      const bumperGeo = new THREE.BoxGeometry(0.2, 0.15, 0.8);
      const frontBumper = new THREE.Mesh(bumperGeo, blackPlasticMat);
      frontBumper.position.set(0.9, 0.28, 0);
      carGroup.add(frontBumper);

      const rearBumper = new THREE.Mesh(bumperGeo, blackPlasticMat);
      rearBumper.position.set(-0.9, 0.28, 0);
      carGroup.add(rearBumper);

      // --- BRUSHLESS MOTOR & ESC INTERNALS ---
      const internalsGroup = new THREE.Group();
      internalsGroup.position.y = 0.3;
      carGroup.add(internalsGroup);

      // Brushless Electric Motor
      const motorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
      const motorMat = new THREE.MeshStandardMaterial({ color: "#2563eb", metalness: 0.9, roughness: 0.1 });
      const motor = new THREE.Mesh(motorGeo, motorMat);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(-0.25, 0.08, -0.12);
      internalsGroup.add(motor);

      // Copper Windings visual inside motor
      const coilGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.38, 12);
      const coilMat = new THREE.MeshStandardMaterial({ color: "#ea580c", metalness: 0.9, roughness: 0.1 });
      const coil = new THREE.Mesh(coilGeo, coilMat);
      coil.rotation.z = Math.PI / 2;
      coil.position.set(-0.25, 0.08, -0.12);
      internalsGroup.add(coil);

      // Blue Anodized ESC Box
      const escGeo = new THREE.BoxGeometry(0.24, 0.18, 0.24);
      const esc = new THREE.Mesh(escGeo, anodizedMat);
      esc.position.set(0.15, 0.1, 0.15);
      internalsGroup.add(esc);

      // ESC Cooling fan fins
      const fanGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.04, 12);
      const fan = new THREE.Mesh(fanGeo, blackPlasticMat);
      fan.position.set(0.15, 0.2, 0.15);
      internalsGroup.add(fan);

      // LiPo Battery Pack
      const batGeo = new THREE.BoxGeometry(0.65, 0.18, 0.25);
      const batMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4 });
      const battery = new THREE.Mesh(batGeo, batMat);
      battery.position.set(-0.1, 0.1, 0.18);
      internalsGroup.add(battery);

      // Battery strap
      const strapGeo = new THREE.BoxGeometry(0.5, 0.2, 0.02);
      const strap = new THREE.Mesh(strapGeo, blackPlasticMat);
      strap.position.set(-0.1, 0.1, 0.31);
      internalsGroup.add(strap);

      // ESC Copper power leads
      const curve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 0.1, -0.12),
        new THREE.Vector3(-0.02, 0.2, -0.05),
        new THREE.Vector3(0.08, 0.1, 0.1)
      ]);
      const wire1Geo = new THREE.TubeGeometry(curve1, 16, 0.02, 8, false);
      const wireMat = new THREE.MeshStandardMaterial({ color: "#dc2626", roughness: 0.5 });
      const wire1 = new THREE.Mesh(wire1Geo, wireMat);
      internalsGroup.add(wire1);

      // --- STEERING SERVO ASSEMBLY ---
      const servoGeo = new THREE.BoxGeometry(0.15, 0.15, 0.2);
      const servo = new THREE.Mesh(servoGeo, blackPlasticMat);
      servo.position.set(0.4, 0.08, -0.15);
      internalsGroup.add(servo);

      const armLink = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.3), metalChassisMat);
      armLink.position.set(0.45, 0.08, 0);
      internalsGroup.add(armLink);

      // --- NEON UNDERGLOW DYNAMIC POINT LIGHT ---
      const underglow = new THREE.PointLight(colorHex, 6, 2.5);
      underglow.position.set(0, 0.05, 0);
      carGroup.add(underglow);
      underglowRef.current = underglow;

      // --- WHEELS AND DOUBLE WISHBONE ACTIVE SUSPENSION ---
      const tireRadius = 0.38;
      const tireWidth = 0.24;

      const wheelsInfo = [
        { x: 0.65, z: 0.44, isLeft: true, isFront: true },   // Front Left
        { x: 0.65, z: -0.44, isLeft: false, isFront: true },  // Front Right
        { x: -0.65, z: 0.44, isLeft: true, isFront: false },  // Rear Left
        { x: -0.65, z: -0.44, isLeft: false, isFront: false }  // Rear Right
      ];

      wheelsInfo.forEach((wInfo) => {
        // 1. Suspension arms (wishbone)
        const armGeo = new THREE.BoxGeometry(0.5, 0.06, 0.15);
        const armMat = new THREE.MeshStandardMaterial({ color: "#27272a", roughness: 0.6 });
        const lowerArm = new THREE.Mesh(armGeo, armMat);
        lowerArm.position.set(wInfo.x / 2, 0.3, wInfo.z);
        lowerArm.rotation.z = wInfo.isLeft ? -0.15 : 0.15;
        carGroup.add(lowerArm);

        // 2. Oil Shocks with dynamic continuous HELICAL coils!
        const shockGroup = new THREE.Group();
        shockGroup.position.set(wInfo.x * 0.7, 0.45, wInfo.z);
        shockGroup.rotation.z = wInfo.isLeft ? 0.35 : -0.35;
        carGroup.add(shockGroup);

        // Upper shock cylinder body
        const shockUpperGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
        const shockUpper = new THREE.Mesh(shockUpperGeo, anodizedMat);
        shockUpper.position.y = 0.2;
        shockGroup.add(shockUpper);
        
        // Lower shaft sliding inside upper body
        const shockLowerGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
        const shockLower = new THREE.Mesh(shockLowerGeo, armMat);
        shockLower.position.y = -0.1;
        shockGroup.add(shockLower);

        // helical spring geometry (Continuous tube curve)
        const helicalSpringMesh = buildHelicalCoilSpring(0.42, 0.08, colorHex);
        helicalSpringMesh.position.y = 0.05;
        shockGroup.add(helicalSpringMesh);

        // Track spring mesh for scaling on bumps
        shocksRef.current.push({
          springMesh: helicalSpringMesh,
          initialScaleY: 1.0
        });

        // 3. Wheel steering hubs (only fronts pivot)
        const hubGroup = new THREE.Group();
        hubGroup.position.set(wInfo.x, 0.3, wInfo.z);
        carGroup.add(hubGroup);

        if (wInfo.isFront) {
          steeringPivotsRef.current.push(hubGroup);
        }

        // 4. Wheels (Silver alloys + realistic grooved bump tires)
        const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 24);
        const tireMat = new THREE.MeshStandardMaterial({
          color: "#1e1e24",
          roughness: 0.85,
          bumpMap: tireTreadMap,
          bumpScale: 0.04
        });

        const wheelMesh = new THREE.Mesh(tireGeo, tireMat);
        wheelMesh.rotation.z = Math.PI / 2;
        wheelMesh.castShadow = true;
        hubGroup.add(wheelMesh);

        // Alloy spoke rim inserts
        const rimGeo = new THREE.CylinderGeometry(tireRadius * 0.65, tireRadius * 0.65, tireWidth + 0.02, 16);
        const rimMat = new THREE.MeshStandardMaterial({
          color: "#d1d5db",
          metalness: 0.95,
          roughness: 0.15
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.z = Math.PI / 2;
        hubGroup.add(rim);

        // Center hub caps
        const capGeo = new THREE.CylinderGeometry(tireRadius * 0.18, tireRadius * 0.18, tireWidth + 0.04, 8);
        const cap = new THREE.Mesh(capGeo, anodizedMat);
        cap.rotation.z = Math.PI / 2;
        hubGroup.add(cap);

        // Spokes
        const spokeGeo = new THREE.BoxGeometry(tireRadius * 0.6, 0.04, 0.04);
        for (let s = 0; s < 5; s++) {
          const spoke = new THREE.Mesh(spokeGeo, rimMat);
          spoke.position.x = wInfo.isLeft ? tireWidth / 2 : -tireWidth / 2;
          spoke.rotation.x = (s * Math.PI) / 2.5;
          hubGroup.add(spoke);
        }

        wheelsRef.current.push(hubGroup);
      });

      // --- DUST PARTICLES (DRIFT & ACCEL EFFECTS) ---
      const pCount = 80;
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const colors = new Float32Array(pCount * 3);

      for (let pIdx = 0; pIdx < pCount * 3; pIdx += 3) {
        positions[pIdx] = 0;
        positions[pIdx + 1] = -100; // hide initially
        positions[pIdx + 2] = 0;

        colors[pIdx] = 0.5;
        colors[pIdx + 1] = 0.5;
        colors[pIdx + 2] = 0.5;
      }

      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const particleGroup = new THREE.Points(pGeo, pMat);
      scene.add(particleGroup);
      particleGroupRef.current = particleGroup;

      const pDataList = [];
      for (let i = 0; i < pCount; i++) {
        pDataList.push({ x: 0, y: -100, z: 0, vx: 0, vy: 0, vz: 0, life: 0 });
      }
      particleDataRef.current = pDataList;

      // --- POLYCARBONATE COATED BODY SHELL ---
      const shellGroup = new THREE.Group();
      carGroup.add(shellGroup);

      const mainShellGeo = new THREE.BoxGeometry(1.5, 0.24, 0.72);
      const mainShellMat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        metalness: 0.85,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
      const mainShell = new THREE.Mesh(mainShellGeo, mainShellMat);
      mainShell.position.y = 0.44;
      mainShell.castShadow = true;
      shellGroup.add(mainShell);
      bodyShellRef.current = mainShell;

      // Cab canopy roof
      const cabGeo = new THREE.BoxGeometry(0.7, 0.22, 0.54);
      const cab = new THREE.Mesh(cabGeo, mainShellMat);
      cab.position.set(-0.1, 0.65, 0);
      shellGroup.add(cab);

      // Canopy Glass wind screen
      const glassGeo = new THREE.BoxGeometry(0.25, 0.2, 0.52);
      const glassMat = new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.05, metalness: 0.95 });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(0.3, 0.64, 0);
      glass.rotation.z = -0.4;
      shellGroup.add(glass);

      // Front bonnet slope
      const noseGeo = new THREE.BoxGeometry(0.3, 0.12, 0.7);
      const nose = new THREE.Mesh(noseGeo, mainShellMat);
      nose.position.set(0.75, 0.38, 0);
      nose.rotation.z = 0.2;
      shellGroup.add(nose);

      // Huge Downforce Rear Wing
      const wingGeo = new THREE.BoxGeometry(0.18, 0.04, 0.82);
      const wing = new THREE.Mesh(wingGeo, carbonMat);
      wing.position.set(-0.85, 0.68, 0);
      shellGroup.add(wing);

      // Wing support struts
      const strutGeo = new THREE.BoxGeometry(0.1, 0.25, 0.04);
      const strutL = new THREE.Mesh(strutGeo, blackPlasticMat);
      strutL.position.set(-0.76, 0.52, 0.24);
      strutL.rotation.y = 0.25;
      shellGroup.add(strutL);

      const strutR = new THREE.Mesh(strutGeo, blackPlasticMat);
      strutR.position.set(-0.76, 0.52, -0.24);
      strutR.rotation.y = -0.25;
      shellGroup.add(strutR);
    };

    buildRCCar(activeCar, paintColor);

    // 9. ANIMATION LOOP AND DRIVING PHYSICS
    let animationFrameId: number;
    let cameraAngle = 0;
    const clock = new THREE.Clock();

    const spawnDriftSparks = (wheelX: number, wheelZ: number, count: number) => {
      if (!particleGroupRef.current) return;
      const positions = particleGroupRef.current.geometry.attributes.position.array as Float32Array;
      const colors = particleGroupRef.current.geometry.attributes.position.array as Float32Array;
      
      let spawned = 0;
      for (let i = 0; i < particleDataRef.current.length; i++) {
        if (particleDataRef.current[i].life <= 0) {
          particleDataRef.current[i].life = 1.0;
          particleDataRef.current[i].x = wheelX;
          particleDataRef.current[i].y = 0.01;
          particleDataRef.current[i].z = wheelZ;

          // Eject backwards with spread
          particleDataRef.current[i].vx = (Math.random() - 0.5) * 0.15 - Math.cos(physicsRef.current.angle) * 0.05;
          particleDataRef.current[i].vy = Math.random() * 0.08 + 0.02;
          particleDataRef.current[i].vz = (Math.random() - 0.5) * 0.15 - Math.sin(physicsRef.current.angle) * 0.05;

          const pIdx = i * 3;
          positions[pIdx] = wheelX;
          positions[pIdx + 1] = 0.01;
          positions[pIdx + 2] = wheelZ;

          spawned++;
          if (spawned >= count) break;
        }
      }
      particleGroupRef.current.geometry.attributes.position.needsUpdate = true;
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const pState = physicsRef.current;

      // Update particle physics
      if (particleGroupRef.current) {
        const positions = particleGroupRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleDataRef.current.length; i++) {
          const p = particleDataRef.current[i];
          if (p.life > 0) {
            p.life -= delta * 2.2; // fade particle
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.vy -= delta * 0.4; // gravity pull

            const pIdx = i * 3;
            positions[pIdx] = p.x;
            positions[pIdx + 1] = Math.max(-0.5, p.y);
            positions[pIdx + 2] = p.z;
          }
        }
        particleGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (isDriveMode && carGroupRef.current) {
        // --- 1. KEYBOARD DRIVING INPUTS ---
        const forward = pState.keys.w || pState.keys.ArrowUp;
        const backward = pState.keys.s || pState.keys.ArrowDown;
        const left = pState.keys.a || pState.keys.ArrowLeft;
        const right = pState.keys.d || pState.keys.ArrowRight;

        // Steering logic
        let steerTarget = 0;
        if (left) steerTarget = 0.45;
        if (right) steerTarget = -0.45;

        // Smooth steering return
        pState.angle += (forward || backward ? (backward ? -1 : 1) : 1) * pState.speed * steerTarget * 0.15;
        
        // Front wheels turn animation
        steeringPivotsRef.current.forEach((pivot) => {
          pivot.rotation.y = steerTarget * 0.9;
        });

        // Acceleration and braking
        if (forward) {
          pState.speed = Math.min(pState.speed + pState.accel, pState.maxSpeed);
        } else if (backward) {
          pState.speed = Math.max(pState.speed - pState.accel, -pState.maxSpeed / 2);
        } else {
          pState.speed *= pState.decel;
        }

        // Apply movement vector
        const vx = Math.cos(pState.angle) * pState.speed;
        const vz = -Math.sin(pState.angle) * pState.speed;
        pState.x += vx;
        pState.z += vz;

        // Boundaries containment
        const distFromCenter = Math.sqrt(pState.x * pState.x + pState.z * pState.z);
        if (distFromCenter > 5.8) {
          // Bounce off boundary ring
          pState.x = (pState.x / distFromCenter) * 5.78;
          pState.z = (pState.z / distFromCenter) * 5.78;
          pState.speed = -pState.speed * 0.4; // reverse rebound
        }

        carGroupRef.current.position.set(pState.x, 0.1, pState.z);
        carGroupRef.current.rotation.y = pState.angle;

        // Roll wheels rotation proportional to speed
        wheelsRef.current.forEach((wheel) => {
          wheel.children[0].rotation.x += pState.speed * 2.8;
        });

        // Dynamic Suspension Compression Roll
        const isTurning = Math.abs(steerTarget) > 0.1;
        shocksRef.current.forEach((shock, index) => {
          let scaleY = 1.0;
          if (forward) {
            // Nose dive: compress front shocks (index 0, 1)
            if (index < 2) scaleY = 0.88;
          } else if (backward && pState.speed < 0) {
            // Squat: compress rear shocks
            if (index >= 2) scaleY = 0.88;
          }
          if (isTurning && pState.speed > 0.05) {
            // Body roll: compress outer shocks
            const rollRight = steerTarget < 0;
            if (rollRight && (index === 0 || index === 2)) scaleY = 0.86;
            if (!rollRight && (index === 1 || index === 3)) scaleY = 0.86;
          }
          shock.springMesh.scale.y = scaleY;
        });

        // Drift sparks spawn
        if (isTurning && Math.abs(pState.speed) > 0.08) {
          spawnDriftSparks(pState.x + Math.cos(pState.angle) * -0.5, pState.z - Math.sin(pState.angle) * -0.5, 4);
        }

        // --- 2. DYNAMIC SYNTHESIZER MECHANICAL AUDIO Pitch Shift ---
        if (!isSoundMuted && audioRef.current.oscillator && audioRef.current.gainNode) {
          const baseFreq = 80;
          const speedRatio = Math.abs(pState.speed) / pState.maxSpeed;
          // Brushless pitch shifts upwards under acceleration
          audioRef.current.oscillator.frequency.setValueAtTime(
            baseFreq + (speedRatio * 520) + (forward ? 60 : 0), 
            audioRef.current.context?.currentTime || 0
          );
          audioRef.current.gainNode.gain.setValueAtTime(
            0.015 + (speedRatio * 0.035), 
            audioRef.current.context?.currentTime || 0
          );
        }

        // Camera smoothly tracks car position
        camera.position.set(
          pState.x + 3.2 * Math.cos(pState.angle + Math.PI / 6),
          2.0,
          pState.z - 3.2 * Math.sin(pState.angle + Math.PI / 6)
        );
        camera.lookAt(pState.x, 0.4, pState.z);

      } else {
        // --- 3. STUDIO DISPLAY ORBIT ANIMATION ---
        cameraAngle += delta * 0.15;
        camera.position.x = Math.cos(cameraAngle) * 5.2;
        camera.position.z = Math.sin(cameraAngle) * 5.2;
        camera.position.y = 1.95;
        camera.lookAt(0, 0.35, 0);

        // Slowly pivot steering fronts to show mobility
        const steerOsc = Math.sin(clock.getElapsedTime() * 1.5) * 0.3;
        steeringPivotsRef.current.forEach((pivot) => {
          pivot.rotation.y = steerOsc;
        });

        if (carGroupRef.current) {
          carGroupRef.current.position.set(0, 0.1, 0);
          carGroupRef.current.rotation.y = 0;
        }

        // Dynamic Shell lifts when "Expose Ratio" changes
        if (bodyShellRef.current) {
          bodyShellRef.current.position.y = 0.44 + (bodyExposedRatio * 0.85);
          bodyShellRef.current.parent!.children[1].position.y = 0.65 + (bodyExposedRatio * 0.85); // Cab canopy
          bodyShellRef.current.parent!.children[2].position.y = 0.64 + (bodyExposedRatio * 0.85); // canopy glass
          bodyShellRef.current.parent!.children[3].position.y = 0.38 + (bodyExposedRatio * 0.85); // front bonnet
          bodyShellRef.current.parent!.children[4].position.y = 0.68 + (bodyExposedRatio * 0.85); // rear wing
          bodyShellRef.current.parent!.children[5].position.y = 0.52 + (bodyExposedRatio * 0.85); // support L
          bodyShellRef.current.parent!.children[6].position.y = 0.52 + (bodyExposedRatio * 0.85); // support R
        }

        // Ensure engine audio remains completely silent in Studio
        if (audioRef.current.gainNode) {
          audioRef.current.gainNode.gain.setValueAtTime(0, audioRef.current.context?.currentTime || 0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. CLEAN RESIZING
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 11. KEYBOARD LISTENERS FOR DRIVING ARENA
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = physicsRef.current.keys as Record<string, boolean>;
      if (e.key in keys) {
        keys[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = physicsRef.current.keys as Record<string, boolean>;
      if (e.key in keys) {
        keys[e.key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeCar, isDriveMode, isSoundMuted, bodyExposedRatio, paintColor]);

  // Audio Synthesizer Initialization
  const handleToggleSound = () => {
    if (isSoundMuted) {
      // Initialize Audio
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        
        audioRef.current = {
          context: ctx,
          oscillator: osc,
          gainNode: gain
        };
        setIsSoundMuted(false);
      } catch (err) {
        console.warn("Failed to initialize audio oscillator context", err);
      }
    } else {
      // Mute audio
      if (audioRef.current.oscillator) {
        audioRef.current.oscillator.stop();
      }
      setIsSoundMuted(true);
    }
  };

  // Change metallic paint swatches
  const handleColorChange = (hexColor: string) => {
    setPaintColor(hexColor);
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 flex flex-col lg:flex-row h-[600px] rounded-3xl border border-brand-border">
      
      {/* 3D RENDER CANVAS CONTAINER */}
      <div 
        ref={containerRef} 
        className="w-full lg:w-3/4 h-[380px] lg:h-full relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900"
      >
        {/* DRIVE MODE CONTROLS OVERLAY */}
        {isDriveMode ? (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3 p-3 rounded-2xl glass-panel text-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-black animate-pulse">
              <Keyboard className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white uppercase tracking-wider">DRIVE CONTROLS ACTIVE</p>
              <p className="text-slate-400">Steer using <span className="font-bold text-brand-orange">WASD</span> or <span className="font-bold text-brand-orange">ARROWS</span> keys</p>
            </div>
          </div>
        ) : (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-brand-border text-xs text-slate-400">
            <Info className="h-4 w-4 text-brand-orange" />
            <span>Interactive Auto-Orbit active. Rotate mesh using cursor.</span>
          </div>
        )}

        {/* DRIVE ARENA WATERMARK BOUNDS */}
        {isDriveMode && (
          <div className="absolute bottom-4 left-4 z-10 text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">
            MARQUE SHOCK ARENA 12.8M • BOUNDARY FENCE ACTIVE
          </div>
        )}
      </div>

      {/* SIDEBAR PANEL CONTROLS */}
      <div className="w-full lg:w-1/4 h-[220px] lg:h-full flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-brand-border bg-slate-950 p-6 space-y-6 overflow-y-auto">
        
        {/* CAR SWITCHER SELECTOR */}
        <div className="space-y-3">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Select Rig Model</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "traxxas", label: "X-MAXX", desc: "8S Basher", speed: "80 KM/H" },
              { id: "arrma", label: "INFRACTION", desc: "6S Street", speed: "130 KM/H" },
              { id: "rlaarlo", label: "AM-X12", desc: "Alloy Drift", speed: "80 KM/H" }
            ].map(car => (
              <button
                key={car.id}
                onClick={() => { setActiveCar(car.id); setIsDriveMode(false); }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-300 ${
                  activeCar === car.id 
                    ? "border-brand-orange bg-brand-orange/10 text-white shadow-glow" 
                    : "border-brand-border bg-slate-900 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="font-display text-xs font-black tracking-tight">{car.label}</span>
                <span className="text-[9px] text-slate-500 mt-0.5">{car.desc}</span>
                <span className="text-[9px] font-bold text-brand-gold mt-1">{car.speed}</span>
              </button>
            ))}
          </div>
        </div>

        {/* INTERACTIVE SHOCK SHELL CONTROLLER */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Expose Brushless Internals</label>
            <span className="text-[10px] text-brand-orange font-bold font-mono">{(bodyExposedRatio * 100).toFixed(0)}% Lift</span>
          </div>
          <div className="flex items-center gap-3">
            <Sliders className="h-4 w-4 text-slate-500" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              disabled={isDriveMode}
              value={bodyExposedRatio}
              onChange={(e) => setBodyExposedRatio(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-orange disabled:opacity-30"
            />
          </div>
          {!isDriveMode && (
            <p className="text-[9px] text-slate-500 leading-relaxed">
              Lift the polycarbonate body shell to inspect copper stator coils, anodized cooling heat sinks, and battery configurations.
            </p>
          )}
        </div>

        {/* SOLID METALLIC FINISH COLOR SWATCHES */}
        <div className="space-y-3">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Body Clearcoat Paint</label>
          <div className="flex gap-3">
            {[
              { hex: "#f97316", name: "Solar Flare Orange" },
              { hex: "#e11d48", name: "Venom Crimson" },
              { hex: "#06b6d4", name: "Cyberpunk Turquoise" },
              { hex: "#d97706", name: "Liquid Gold" },
              { hex: "#111827", name: "Stealth Carbon" }
            ].map(col => (
              <button
                key={col.hex}
                onClick={() => handleColorChange(col.hex)}
                style={{ backgroundColor: col.hex }}
                className={`h-7 w-7 rounded-full border-2 transition-transform duration-300 hover:scale-115 ${
                  paintColor === col.hex ? "border-white scale-110 shadow-lg" : "border-transparent"
                }`}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* DRIVE MODE TOGGLES */}
        <div className="space-y-3 pt-3 border-t border-brand-border">
          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={() => { setIsDriveMode(!isDriveMode); setBodyExposedRatio(0); }}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase transition-all duration-300 ${
                isDriveMode
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-brand-orange text-black hover:bg-brand-gold hover:shadow-glow"
              }`}
            >
              <Zap className="h-4 w-4 stroke-[2.5]" />
              {isDriveMode ? "Studio Mode" : "Drive Arena"}
            </button>

            <button
              onClick={handleToggleSound}
              disabled={!isDriveMode}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase border transition-colors ${
                !isDriveMode 
                  ? "border-slate-800 text-slate-600 cursor-not-allowed" 
                  : isSoundMuted 
                    ? "border-brand-border bg-slate-900 text-slate-400 hover:text-white"
                    : "border-brand-orange/40 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20"
              }`}
            >
              {isSoundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-bounce" />}
              Engine Sound
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
