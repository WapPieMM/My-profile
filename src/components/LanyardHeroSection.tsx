import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import { RoundedBox, ContactShadows } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  useRopeJoint,
  useSphericalJoint,
  RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PROFILE_DATA, HERO_METRICS } from '../data/portfolioData';

// Register meshline elements for @react-three/fiber JSX
extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElements['bufferGeometry'] & {
      points?: THREE.Vector3[] | number[];
    };
    meshLineMaterial: ThreeElements['material'] & {
      color?: THREE.ColorRepresentation;
      depthTest?: boolean;
      resolution?: [number, number] | THREE.Vector2;
      useMap?: number;
      map?: THREE.Texture;
      repeat?: [number, number] | THREE.Vector2;
      lineWidth?: number;
      transparent?: boolean;
      opacity?: number;
    };
  }
}

export type BadgeColorTheme = 'obsidian' | 'ivory' | 'cobalt';

// Detect software WebGL renderer (SwiftShader / llvmpipe / Basic Render) per Three.js skill
const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

// Pre-allocated math vectors at module scope to prevent GC in useFrame
const _vec = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _ang = new THREE.Vector3();
const _rot = new THREE.Vector3();
const _dragTarget = new THREE.Vector3();

/**
 * Sets up a zero-dependency procedural RoomEnvironment so metallic clips and
 * clearcoat badge surfaces reflect realistic studio softboxes without external HDR files.
 */
function StudioEnvironmentRig() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    return () => {
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
}

/**
 * Generates a high-DPI procedural CanvasTexture for the front and back of the ID Badge.
 * Also loads the user's portrait image asynchronously onto the canvas.
 */
function useBadgeCanvasTextures(
  theme: BadgeColorTheme,
  maxAnisotropy: number,
  portraitUrl: string
) {
  return useMemo(() => {
    // 1. FRONT CARD TEXTURE
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1024;
    frontCanvas.height = 1440;
    const fCtx = frontCanvas.getContext('2d')!;

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTexture.anisotropy = maxAnisotropy;

    const palette =
      theme === 'obsidian'
        ? {
            bg: '#0C0C0E',
            surface: '#18181B',
            border: '#27272A',
            textPrimary: '#FAFAFA',
            textSecondary: '#A1A1AA',
            accent: '#2563EB',
            chipBg: '#1E293B',
            chipText: '#60A5FA',
          }
        : theme === 'cobalt'
        ? {
            bg: '#0F172A',
            surface: '#1E293B',
            border: '#334155',
            textPrimary: '#F8FAFC',
            textSecondary: '#94A3B8',
            accent: '#38BDF8',
            chipBg: '#0284C7',
            chipText: '#FFFFFF',
          }
        : {
            bg: '#FAF9F6',
            surface: '#F4F4F5',
            border: '#E4E4E7',
            textPrimary: '#18181B',
            textSecondary: '#52525B',
            accent: '#2563EB',
            chipBg: '#DBEAFE',
            chipText: '#1D4ED8',
          };

    const drawFront = (portraitImg?: HTMLImageElement) => {
      fCtx.clearRect(0, 0, 1024, 1440);

      // Card background
      fCtx.fillStyle = palette.bg;
      fCtx.fillRect(0, 0, 1024, 1440);

      // Subtle architectural grid lines
      fCtx.strokeStyle = palette.border;
      fCtx.lineWidth = 2;
      fCtx.beginPath();
      fCtx.moveTo(72, 185);
      fCtx.lineTo(952, 185);
      fCtx.moveTo(72, 860);
      fCtx.lineTo(952, 860);
      fCtx.moveTo(72, 1215);
      fCtx.lineTo(952, 1215);
      fCtx.stroke();

      // Top Lanyard Slot Cutout Graphic
      fCtx.fillStyle = palette.border;
      fCtx.beginPath();
      fCtx.roundRect(412, 48, 200, 34, 17);
      fCtx.fill();

      // Top Header Brand & Pass Type
      fCtx.fillStyle = palette.textPrimary;
      fCtx.font = '700 36px "Plus Jakarta Sans", sans-serif';
      fCtx.fillText('NAPAT.STUDIO', 72, 145);

      fCtx.fillStyle = palette.accent;
      fCtx.font = '600 26px "JetBrains Mono", monospace';
      fCtx.textAlign = 'right';
      fCtx.fillText('VERIFIED PARTNER // 26', 952, 143);
      fCtx.textAlign = 'left';

      // Portrait Frame (x: 72, y: 225, w: 880, h: 590)
      fCtx.save();
      fCtx.beginPath();
      fCtx.roundRect(72, 225, 880, 590, 28);
      fCtx.clip();

      // Fallback stylized studio gradient portrait
      const grad = fCtx.createLinearGradient(72, 225, 952, 815);
      grad.addColorStop(0, '#1E293B');
      grad.addColorStop(0.5, '#0F172A');
      grad.addColorStop(1, '#18181B');
      fCtx.fillStyle = grad;
      fCtx.fillRect(72, 225, 880, 590);

      if (portraitImg) {
        // Center-crop portrait image into 880x590 frame
        const imgRatio = portraitImg.width / portraitImg.height;
        const boxRatio = 880 / 590;
        let drawW = 880;
        let drawH = 590;
        let offsetX = 72;
        let offsetY = 225;
        if (imgRatio > boxRatio) {
          drawW = 590 * imgRatio;
          offsetX = 72 - (drawW - 880) / 2;
        } else {
          drawH = 880 / imgRatio;
          offsetY = 225 - (drawH - 590) * 0.25;
        }
        fCtx.drawImage(portraitImg, offsetX, offsetY, drawW, drawH);

        // Subtle bottom vignette inside photo
        const vig = fCtx.createLinearGradient(72, 580, 72, 815);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.65)');
        fCtx.fillStyle = vig;
        fCtx.fillRect(72, 580, 880, 235);
      } else {
        // Minimalist geometric monogram avatar while image loads
        fCtx.fillStyle = '#334155';
        fCtx.beginPath();
        fCtx.arc(512, 460, 110, 0, Math.PI * 2);
        fCtx.fill();
        fCtx.fillStyle = '#F8FAFC';
        fCtx.font = '700 84px "Plus Jakarta Sans", sans-serif';
        fCtx.textAlign = 'center';
        fCtx.fillText('NW', 512, 490);
        fCtx.textAlign = 'left';
      }

      // Overlay location tag inside bottom-left of photo
      fCtx.fillStyle = '#FFFFFF';
      fCtx.font = '500 24px "JetBrains Mono", monospace';
      fCtx.fillText('BANGKOK · SINGAPORE · REMOTE', 108, 775);
      fCtx.restore();

      // Name & Role Typography
      fCtx.fillStyle = palette.textPrimary;
      fCtx.font = '700 58px "Plus Jakarta Sans", sans-serif';
      fCtx.fillText('Napat Worachot', 72, 945);

      fCtx.fillStyle = palette.accent;
      fCtx.font = '600 32px "Plus Jakarta Sans", sans-serif';
      fCtx.fillText('Lead Product Designer & Full-Stack Dev', 72, 1005);

      fCtx.fillStyle = palette.textSecondary;
      fCtx.font = '400 28px "Plus Jakarta Sans", sans-serif';
      fCtx.fillText('UX/UI Architecture · Design Systems · React & TypeScript', 72, 1068);

      // Metrics Strip inside ID card
      fCtx.fillStyle = palette.surface;
      fCtx.beginPath();
      fCtx.roundRect(72, 1105, 880, 82, 16);
      fCtx.fill();

      fCtx.fillStyle = palette.textPrimary;
      fCtx.font = '600 25px "JetBrains Mono", monospace';
      fCtx.fillText('EXP: 7+ YRS   |   DELIVERED: 42 PROJECTS   |   RATING: 4.98/5.0', 104, 1155);

      // Bottom Barcode & Pass ID
      fCtx.fillStyle = palette.textSecondary;
      fCtx.font = '500 24px "JetBrains Mono", monospace';
      fCtx.fillText('ID: NS-2026-8841-TH', 72, 1285);
      fCtx.fillText('AVAILABLE FOR FREELANCE & CONSULTING', 72, 1328);

      // Procedural Barcode Bars on bottom right
      fCtx.fillStyle = palette.textPrimary;
      const barWidths = [6, 3, 9, 4, 3, 8, 4, 6, 3, 10, 4, 3, 6, 8, 3, 5, 4, 9, 3, 6];
      let bx = 680;
      barWidths.forEach((w, idx) => {
        if (idx % 2 === 0) {
          fCtx.fillRect(bx, 1252, w, 92);
        }
        bx += w + 5;
      });

      frontTexture.needsUpdate = true;
    };

    drawFront();

    // Load portrait image asynchronously onto the badge texture
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawFront(img);
    };
    img.src = portraitUrl;

    // 2. BACK CARD TEXTURE
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 1024;
    backCanvas.height = 1440;
    const bCtx = backCanvas.getContext('2d')!;

    bCtx.fillStyle = palette.bg;
    bCtx.fillRect(0, 0, 1024, 1440);

    bCtx.strokeStyle = palette.border;
    bCtx.lineWidth = 3;
    bCtx.strokeRect(64, 64, 896, 1312);

    bCtx.fillStyle = palette.textPrimary;
    bCtx.font = '700 44px "Plus Jakarta Sans", sans-serif';
    bCtx.fillText('CAPABILITIES & STACK', 120, 220);

    const skills = [
      '01. Product Strategy & UX Research',
      '02. Scalable Figma Design Systems',
      '03. React 19, TypeScript & Next.js',
      '04. Interactive 3D & WebGL Experiences',
      '05. High-Conversion Brand Websites',
    ];
    bCtx.fillStyle = palette.textSecondary;
    bCtx.font = '500 32px "Plus Jakarta Sans", sans-serif';
    skills.forEach((s, i) => {
      bCtx.fillText(s, 120, 320 + i * 76);
    });

    // QR Code style procedural matrix on back
    bCtx.fillStyle = palette.surface;
    bCtx.beginPath();
    bCtx.roundRect(120, 760, 784, 380, 24);
    bCtx.fill();

    bCtx.fillStyle = palette.textPrimary;
    bCtx.font = '700 34px "JetBrains Mono", monospace';
    bCtx.fillText('DIRECT CONTACT', 168, 845);
    bCtx.fillStyle = palette.accent;
    bCtx.font = '500 28px "JetBrains Mono", monospace';
    bCtx.fillText('napat.work@studio-napat.com', 168, 910);
    bCtx.fillStyle = palette.textSecondary;
    bCtx.fillText('linkedin.com/in/napat-worachot', 168, 965);
    bCtx.fillText('Line Official: @napat.studio', 168, 1020);

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;
    backTexture.anisotropy = maxAnisotropy;

    // 3. LANYARD STRAP WEAVE TEXTURE
    const strapCanvas = document.createElement('canvas');
    strapCanvas.width = 1024;
    strapCanvas.height = 128;
    const sCtx = strapCanvas.getContext('2d')!;

    sCtx.fillStyle = '#141417';
    sCtx.fillRect(0, 0, 1024, 128);

    // Subtle nylon weave ribs
    sCtx.fillStyle = '#1F1F24';
    for (let x = 0; x < 1024; x += 8) {
      sCtx.fillRect(x, 0, 4, 128);
    }

    // Accent edge stitching
    sCtx.fillStyle = '#2563EB';
    sCtx.fillRect(0, 6, 1024, 6);
    sCtx.fillRect(0, 116, 1024, 6);

    // Repeating brand text along the strap
    sCtx.fillStyle = '#E4E4E7';
    sCtx.font = '700 34px "JetBrains Mono", monospace';
    sCtx.fillText('NAPAT.STUDIO  //  PRODUCT DESIGN & ENGINEERING  //  ', 40, 76);

    const strapTexture = new THREE.CanvasTexture(strapCanvas);
    strapTexture.colorSpace = THREE.SRGBColorSpace;
    strapTexture.wrapS = THREE.RepeatWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    strapTexture.anisotropy = maxAnisotropy;

    return { frontTexture, backTexture, strapTexture };
  }, [theme, maxAnisotropy, portraitUrl]);
}

interface BandAndCardProps {
  theme: BadgeColorTheme;
  triggerImpulseCount: number;
  dropResetCount: number;
  minSpeed?: number;
  maxSpeed?: number;
}

/**
 * Physics Lanyard Band & Interactive 3D ID Card Component
 * Connects 4 rigid bodies (`fixed` -> `j1` -> `j2` -> `j3`) via `useRopeJoint`
 * and connects `j3` -> `card` via `useSphericalJoint`.
 */
function LanyardBandAndCard({
  theme,
  triggerImpulseCount,
  dropResetCount,
  minSpeed = 10,
  maxSpeed = 50,
}: BandAndCardProps) {
  const { gl, size } = useThree();
  const maxAniso = useMemo(() => gl.capabilities.getMaxAnisotropy(), [gl]);

  // Physics RigidBody references (4 invisible joint nodes + 1 card body)
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  // Smoothed lerped positions for intermediate rope joints
  const j1Lerped = useRef(new THREE.Vector3());
  const j2Lerped = useRef(new THREE.Vector3());

  // MeshLine ref for rendering the strap ribbon
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bandRef = useRef<any>(null);

  // Pointer drag & hover state
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  // Procedural textures for card front, card back, and woven lanyard strap
  const { frontTexture, backTexture, strapTexture } = useBadgeCanvasTextures(
    theme,
    maxAniso,
    PROFILE_DATA.heroImage
  );

  // Smooth Catmull-Rom spline connecting the 4 joints (initialized with non-zero span to avoid NaN bounding sphere warning)
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.65, 3.75, 0.15),
      new THREE.Vector3(1.1, 3.95, 0.1),
      new THREE.Vector3(0.55, 4.1, 0.05),
      new THREE.Vector3(0, 4.2, 0),
    ]);
    c.curveType = 'chordal';
    return c;
  });

  const initialStrapPoints = useMemo(() => curve.getPoints(32), [curve]);

  // Connect the 4 invisible physics nodes down to the card using Rope & Spherical joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.85]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.85]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.85]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  // Cursor feedback on hover / drag
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  // Apply an initial lateral swing impulse on mount or when the user clicks "Flick / Swing"
  useEffect(() => {
    if (!card.current) return;
    card.current.wakeUp();
    card.current.applyImpulse({ x: 1.35, y: 0.2, z: 0.45 }, true);
    card.current.applyTorqueImpulse({ x: 0.04, y: 0.28, z: -0.08 }, true);
  }, [triggerImpulseCount]);

  // Re-drop the card from the top of the screen when the user clicks "Drop from Top"
  useEffect(() => {
    if (dropResetCount === 0) return;
    if (!card.current || !j1.current || !j2.current || !j3.current) return;

    j1.current.setTranslation({ x: 0.6, y: 4.1, z: 0.1 }, true);
    j2.current.setTranslation({ x: 1.2, y: 3.9, z: 0.2 }, true);
    j3.current.setTranslation({ x: 1.8, y: 3.7, z: 0.3 }, true);
    card.current.setTranslation({ x: 2.35, y: 3.1, z: 0.45 }, true);
    card.current.setLinvel({ x: -0.5, y: -1.5, z: 0 }, true);
    card.current.setAngvel({ x: 0, y: 1.8, z: -0.4 }, true);
    card.current.wakeUp();
  }, [dropResetCount]);

  // Per-frame physics synchronization, pointer dragging, and MeshLine curve update
  useFrame((state, delta) => {
    if (dragged && card.current) {
      _vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      _dir.copy(_vec).sub(state.camera.position).normalize();
      _vec.add(_dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      _dragTarget.set(
        _vec.x - dragged.x,
        _vec.y - dragged.y,
        _vec.z - dragged.z
      );
      card.current.setNextKinematicTranslation(_dragTarget);
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      // Smoothly damp intermediate joint positions to prevent high-velocity rope jitter
      const j1Trans = j1.current.translation();
      const j2Trans = j2.current.translation();

      if (j1Lerped.current.lengthSq() === 0) j1Lerped.current.copy(j1Trans);
      if (j2Lerped.current.lengthSq() === 0) j2Lerped.current.copy(j2Trans);

      const clampedDelta1 = Math.max(0.1, Math.min(1, j1Lerped.current.distanceTo(j1Trans)));
      j1Lerped.current.lerp(
        j1Trans,
        delta * (minSpeed + clampedDelta1 * (maxSpeed - minSpeed))
      );

      const clampedDelta2 = Math.max(0.1, Math.min(1, j2Lerped.current.distanceTo(j2Trans)));
      j2Lerped.current.lerp(
        j2Trans,
        delta * (minSpeed + clampedDelta2 * (maxSpeed - minSpeed))
      );

      // Update Catmull-Rom curve points from bottom (j3) to top anchor (fixed)
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2Lerped.current);
      curve.points[2].copy(j1Lerped.current);
      curve.points[3].copy(fixed.current.translation());

      if (bandRef.current?.geometry) {
        bandRef.current.geometry.setPoints(curve.getPoints(32));
      }

      // Apply subtle angular restoring torque on Y so the ID card naturally faces the viewer
      const angVel = card.current.angvel();
      const rot = card.current.rotation();
      _ang.set(angVel.x, angVel.y, angVel.z);
      _rot.set(rot.x, rot.y, rot.z);
      card.current.setAngvel(
        { x: _ang.x, y: _ang.y - _rot.y * 0.25, z: _ang.z },
        false
      );
    }
  });

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 3.5,
    linearDamping: 3.5,
  };

  return (
    <>
      {/*
        Initial positions are elevated and angled to the right (`x: 0.6 -> 2.1, y: 4.2 -> 3.3`)
        so on initial page load, the card drops under gravity and swings like a pendulum!
      */}
      <group position={[0, 4.2, 0]}>
        {/* Node 0: Fixed Top Anchor Point */}
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        {/* Node 1: Invisible Rope Joint 1 */}
        <RigidBody position={[0.55, -0.1, 0.05]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Node 2: Invisible Rope Joint 2 */}
        <RigidBody position={[1.1, -0.25, 0.1]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Node 3: Invisible Rope Joint 3 (Attaches to top clip of card) */}
        <RigidBody position={[1.65, -0.45, 0.15]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Node 4: The Draggable ID Card RigidBody */}
        <RigidBody
          position={[2.15, -0.95, 0.25]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.85, 1.18, 0.04]} />

          <group
            scale={1.0}
            position={[0, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.target as Element)?.setPointerCapture?.(e.pointerId);
              if (card.current) {
                const cardPos = card.current.translation();
                setDragged(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(_vec.set(cardPos.x, cardPos.y, cardPos.z))
                );
              }
            }}
            onPointerMove={(e) => {
              if (!dragged) return;
              e.stopPropagation();
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              (e.target as Element)?.releasePointerCapture?.(e.pointerId);
              setDragged(false);
            }}
          >
            {/* =====================================================================
                CUSTOM .GLB MODEL REPLACEMENT ZONE:
                To replace this procedural RoundedBox + Metallic Clip with your own
                custom 3D model (e.g. a custom Blender badge & clamp `.glb`),
                1. Import `useGLTF` from `@react-three/drei`:
                   `const { nodes, materials } = useGLTF('/models/custom-badge.glb');`
                2. Replace the `<group name="procedural-badge-assembly">...</group>`
                   below with your `<mesh geometry={nodes.card.geometry} ... />`
                   and `<mesh geometry={nodes.clip.geometry} ... />`.
               ===================================================================== */}
            <group name="procedural-badge-assembly">
              {/* 1. Primary Silhouette: Polycarbonate Frosted / Clearcoat Outer Holder */}
              <RoundedBox
                args={[1.72, 2.38, 0.06]}
                radius={0.07}
                smoothness={4}
                castShadow={!isSoftwareGl}
                receiveShadow={!isSoftwareGl}
              >
                <meshPhysicalMaterial
                  color={theme === 'ivory' ? '#E4E4E7' : '#18181B'}
                  roughness={0.22}
                  metalness={0.15}
                  clearcoat={1.0}
                  clearcoatRoughness={0.12}
                />
              </RoundedBox>

              {/* 2. Front Printed ID Card Insert (Uses High-DPI Dynamic CanvasTexture) */}
              <mesh position={[0, -0.02, 0.032]}>
                <planeGeometry args={[1.58, 2.22]} />
                <meshPhysicalMaterial
                  map={frontTexture}
                  roughness={0.28}
                  metalness={0.05}
                  clearcoat={0.85}
                  clearcoatRoughness={0.15}
                />
              </mesh>

              {/* 3. Back Printed ID Card Insert */}
              <mesh position={[0, -0.02, -0.032]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[1.58, 2.22]} />
                <meshPhysicalMaterial
                  map={backTexture}
                  roughness={0.32}
                  metalness={0.05}
                  clearcoat={0.7}
                  clearcoatRoughness={0.18}
                />
              </mesh>

              {/* 4. Secondary Read: Metallic Clamp Jaw Gripping Top of Card */}
              <RoundedBox
                position={[0, 1.18, 0]}
                args={[0.42, 0.16, 0.1]}
                radius={0.025}
                smoothness={3}
              >
                <meshStandardMaterial
                  color="#D4D4D8"
                  metalness={0.92}
                  roughness={0.2}
                />
              </RoundedBox>

              {/* 5. Secondary Read: Swivel Clasp Barrel */}
              <mesh position={[0, 1.31, 0]}>
                <cylinderGeometry args={[0.07, 0.09, 0.14, 20]} />
                <meshStandardMaterial
                  color="#A1A1AA"
                  metalness={0.95}
                  roughness={0.18}
                />
              </mesh>

              {/* 6. Accent Detail: Top D-Ring Loop Connecting to Lanyard Strap */}
              <mesh position={[0, 1.42, 0]}>
                <torusGeometry args={[0.12, 0.026, 16, 32]} />
                <meshStandardMaterial
                  color="#E4E4E7"
                  metalness={0.95}
                  roughness={0.14}
                />
              </mesh>

              {/* 7. Accent Detail: Precision Rivet Pins on Front & Back of Clamp */}
              <mesh position={[0.12, 1.18, 0.052]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
                <meshStandardMaterial color="#71717A" metalness={0.9} roughness={0.3} />
              </mesh>
              <mesh position={[-0.12, 1.18, 0.052]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
                <meshStandardMaterial color="#71717A" metalness={0.9} roughness={0.3} />
              </mesh>
            </group>
          </group>
        </RigidBody>
      </group>

      {/* Smooth MeshLine Ribbon Strap Connecting the 4 Physics Joints */}
      <mesh ref={bandRef}>
        <meshLineGeometry points={initialStrapPoints} />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap={1}
          map={strapTexture}
          repeat={[-3.2, 1]}
          lineWidth={0.95}
        />
      </mesh>
    </>
  );
}

interface LanyardHeroSectionProps {
  onOpenResume: () => void;
  copiedKey: string | null;
  onCopyText: (key: string, text: string) => void;
}

export const LanyardHeroSection: React.FC<LanyardHeroSectionProps> = ({
  onOpenResume,
  copiedKey,
  onCopyText,
}) => {
  const [badgeTheme, setBadgeTheme] = useState<BadgeColorTheme>('obsidian');
  const [impulseCount, setImpulseCount] = useState(0);
  const [dropResetCount, setDropResetCount] = useState(0);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [showDevSpec, setShowDevSpec] = useState(false);
  const [webglLost, setWebglLost] = useState(false);

  const npmInstallCmd =
    'npm install three @types/three @react-three/fiber @react-three/drei @react-three/rapier meshline';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
      {/* Split Hero Grid: Left Column Typography/Intro | Right Column Full-Height 3D Physics Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* LEFT COLUMN: Editorial Typography, Bio Intro & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 py-2">
          <div className="space-y-5">
            {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
            <p className="text-xs sm:text-sm text-zinc-500 tracking-normal">
              {PROFILE_DATA.location}
            </p>

            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-blue-600 tracking-tight">
                {PROFILE_DATA.fullNameThai} ({PROFILE_DATA.fullNameEn}) — {PROFILE_DATA.roleTitle}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 leading-[1.15] balance-text">
                {PROFILE_DATA.headline}
              </h1>
            </div>

            <p className="text-base text-zinc-600 leading-relaxed max-w-xl">
              {PROFILE_DATA.leadBio}
            </p>
          </div>

          {/* Primary CTA Buttons & Shareable Profile Controls */}
          <div className="pt-2 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>เริ่มพูดคุยโปรเจกต์ของคุณ</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="px-4 py-3 bg-white border border-zinc-200 text-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 text-zinc-500" />
                <span>ดูเรซูเม่ฉบับเต็ม (CV / LinkedIn Kit)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onCopyText(
                    'hero-portfolio-link',
                    window.location.href.split('#')[0]
                  )
                }
                className="px-4 py-3 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedKey === 'hero-portfolio-link' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>คัดลอกลิงก์พอร์ตแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500" />
                    <span>คัดลอกลิงก์แปะโปรไฟล์</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Profile Credentials & 3D Lanyard Spec Drawer Toggle */}
            <div className="pt-3 border-t border-zinc-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>ช่องทางโปรไฟล์ทางการ:</span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopyText('linkedin-url', `https://${PROFILE_DATA.linkedinHandle}`)
                    }
                    className="text-zinc-800 font-medium hover:text-blue-600 underline underline-offset-4 cursor-pointer"
                  >
                    {copiedKey === 'linkedin-url' ? 'คัดลอก LinkedIn แล้ว' : 'LinkedIn'}
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopyText('fastwork-url', `https://${PROFILE_DATA.fastworkHandle}`)
                    }
                    className="text-zinc-800 font-medium hover:text-blue-600 underline underline-offset-4 cursor-pointer"
                  >
                    {copiedKey === 'fastwork-url' ? 'คัดลอก Fastwork แล้ว' : 'Fastwork'}
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => onCopyText('email-top', PROFILE_DATA.email)}
                    className="text-zinc-800 font-medium hover:text-blue-600 underline underline-offset-4 cursor-pointer font-mono"
                  >
                    {copiedKey === 'email-top' ? 'คัดลอกอีเมลแล้ว' : PROFILE_DATA.email}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDevSpec((prev) => !prev)}
                  className="text-xs font-mono font-medium text-blue-600 hover:underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showDevSpec ? 'ซ่อนคำสั่งติดตั้ง 3D' : 'คำสั่ง npm install & 3D Spec'}</span>
                </button>
              </div>

              {/* Expandable Developer Install Command Box */}
              {showDevSpec && (
                <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 text-xs font-mono space-y-2 border border-zinc-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400">
                      Required Packages (React Three Fiber + Rapier + Meshline):
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopyText('npm-cmd', npmInstallCmd)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] cursor-pointer whitespace-nowrap"
                    >
                      {copiedKey === 'npm-cmd' ? 'Copied ✓' : 'Copy Command'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto text-blue-300 py-1 select-all">
                    <code>{npmInstallCmd}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Full-Height Interactive 3D Physics ID Card Lanyard Viewport */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden border border-zinc-200 bg-gradient-to-b from-[#111115] via-[#16161C] to-[#0B0B0E] flex flex-col justify-between">
            {/* Minimal Top-Left Spec Header (Unobstructed Center Viewport) */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 pointer-events-none">
              <div className="text-xs font-mono text-zinc-300">
                <span>INTERACTIVE 3D LANYARD</span>
                <span className="mx-1.5 text-zinc-600">·</span>
                <span className="text-zinc-400">Drag & flick badge to swing</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                RAPIER PHYSICS // MESHLINE
              </span>
            </div>

            {/* Dedicated WebGL Canvas Mount Container */}
            <div className="absolute inset-0 w-full h-full">
              {!webglLost ? (
                <Canvas
                  camera={{ position: [0, 0, 12], fov: 25 }}
                  dpr={isSoftwareGl ? 1 : [1, 2]}
                  gl={{
                    antialias: !isSoftwareGl,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1,
                  }}
                  onCreated={({ gl }) => {
                    const dom = gl.domElement;
                    dom.addEventListener('webglcontextlost', (e) => {
                      e.preventDefault();
                      setWebglLost(true);
                    });
                    dom.addEventListener('webglcontextrestored', () => {
                      setWebglLost(false);
                    });
                  }}
                >
                  {/* Zero-Dependency Studio Environment Map */}
                  <StudioEnvironmentRig />

                  {/* Balanced 3-Point Warm/Cool Studio Lighting Rig */}
                  <hemisphereLight
                    args={['#E0F2FE', '#18181B', 0.85]}
                  />
                  <directionalLight
                    position={[5, 8, 6]}
                    intensity={2.2}
                    color="#FFFBEB"
                  />
                  <directionalLight
                    position={[-6, 4, -5]}
                    intensity={1.4}
                    color="#60A5FA"
                  />

                  {/* Rapier Gravity & Rope/Spherical Joint Physics Simulation */}
                  <React.Suspense fallback={null}>
                    <Physics
                      gravity={[0, -40, 0]}
                      timeStep={isSoftwareGl ? 1 / 30 : 1 / 60}
                    >
                      <LanyardBandAndCard
                        theme={badgeTheme}
                        triggerImpulseCount={impulseCount}
                        dropResetCount={dropResetCount}
                      />
                    </Physics>
                  </React.Suspense>

                  {/* Soft Grounding Contact Shadow Plane */}
                  {!isSoftwareGl && (
                    <ContactShadows
                      position={[0, -2.55, 0]}
                      opacity={0.45}
                      scale={8}
                      blur={2.4}
                      far={4}
                    />
                  )}
                </Canvas>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-200">
                  <p className="text-sm font-semibold">
                    3D Preview Paused (WebGL Context Restoring)
                  </p>
                  <button
                    type="button"
                    onClick={() => setWebglLost(false)}
                    className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium cursor-pointer"
                  >
                    รีเซ็ตมุมมอง 3D
                  </button>
                </div>
              )}
            </div>

            {/* Unified Collapsible Bottom Control Dock (No backdrop-filter over WebGL per Three.js skill) */}
            <div className="relative z-10 mx-auto mb-3 w-[94%] max-w-lg flex flex-col items-center pointer-events-auto">
              <button
                type="button"
                onClick={() => setHudCollapsed((prev) => !prev)}
                className="px-3 py-1 rounded-t-lg bg-[#18181D] border border-b-0 border-zinc-700/80 text-[11px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {hudCollapsed ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span>แสดงแผงควบคุมบัตร 3D</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    <span>ซ่อนแผงควบคุม</span>
                  </>
                )}
              </button>

              {!hudCollapsed && (
                <div className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181D] border border-zinc-700/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-200 shadow-lg">
                  {/* Card Color Finish Selector */}
                  <div className="flex items-center gap-1">
                    {(
                      [
                        { id: 'obsidian', label: 'Obsidian' },
                        { id: 'ivory', label: 'Ivory' },
                        { id: 'cobalt', label: 'Cobalt' },
                      ] as { id: BadgeColorTheme; label: string }[]
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setBadgeTheme(t.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          badgeTheme === t.id
                            ? 'bg-blue-600 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Physics Action Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImpulseCount((c) => c + 1)}
                      className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>แกว่งบัตร</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDropResetCount((c) => c + 1)}
                      className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3 h-3 text-zinc-400" />
                      <span>ปล่อยบัตรลงมาใหม่</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column Quantitative Proof Row Below Hero Split */}
      <div className="mt-10 pt-8 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {HERO_METRICS.map((metric) => (
          <div key={metric.value} className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono tabular-nums tracking-tight">
              {metric.value}
            </p>
            <p className="text-sm font-medium text-zinc-800 leading-snug">
              {metric.label}
            </p>
            <p className="text-xs text-zinc-500">{metric.context}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
