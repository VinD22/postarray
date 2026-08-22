'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Vector3,
  type Mesh,
  type MeshBasicMaterial,
} from 'three';

/**
 * The hero's one WebGL element: one draft, fanning out to several distinct,
 * simultaneous platform destinations.
 *
 * This is the literal thing `dynamic(..., { ssr: false })`-loads client-side
 * from `hero-webgl-stage.tsx`, once `webgl-guard.ts` has cleared the browser
 * and the canvas has scrolled into view. Nothing here is a generic orb,
 * particle field or spinning shape: it is a hub (the draft, a wireframe
 * icosahedron so it reads as a faceted document rather than a glowing ball)
 * with a fixed number of spokes, one per destination, each carrying its own
 * small pulse that travels outward and fades — a publish event landing.
 * There is no whole-scene rotation and no camera movement; the only motion is
 * the thing the product actually does.
 *
 * Geometry is procedural only (icosahedron, octahedron, a `BufferGeometry`
 * built from two points) — there is no asset pipeline for 3D models in this
 * repo, and none is needed for six low-poly meshes. Materials are all
 * `meshBasicMaterial`/`lineBasicMaterial`, both unlit, so the scene needs no
 * lights: cheap to draw and cheap to reason about.
 */

/** Resolved from design tokens by `scene-colors.ts`; never invented here. */
export interface PublishSceneColors {
  /** The draft, the scene's one hub. `--text-primary`. */
  readonly node: string;
  /** The destination markers. `--border-strong`. */
  readonly satellite: string;
  /** The spokes connecting hub to destinations. `--border-default`. */
  readonly line: string;
  /** The travelling publish pulses. `--accent-cool-default` ("published" ultramarine). */
  readonly pulse: string;
}

export interface HeroPublishCanvasProps {
  readonly colors: PublishSceneColors;
  /** Set by `hero-webgl-stage.tsx` from its IntersectionObserver + `document.hidden`. */
  readonly active: boolean;
  /** `Math.min(window.devicePixelRatio, 2)`, computed once by the caller. */
  readonly dpr: number;
}

const ORIGIN = new Vector3(0, 0, 0);

/** One destination per spoke. Fixed, not derived from the real connector count: this is a diagram, not a stated metric. */
const DESTINATION_COUNT: number = 6;
const FAN_SPAN_RADIANS = Math.PI * 0.64;
const FAN_RADIUS = 1.3;
/** Seconds for one pulse to travel from hub to destination and fade back out. */
const PULSE_CYCLE_SECONDS = 2.8;

interface Destination {
  readonly id: string;
  readonly position: Vector3;
  /** 0-1, staggers each spoke's pulse so they do not all arrive together. */
  readonly phaseOffset: number;
}

function buildDestinations(): readonly Destination[] {
  return Array.from({ length: DESTINATION_COUNT }, (_, index) => {
    const t = DESTINATION_COUNT === 1 ? 0.5 : index / (DESTINATION_COUNT - 1);
    const angle = -FAN_SPAN_RADIANS / 2 + t * FAN_SPAN_RADIANS;
    const depth = (index % 2 === 0 ? 1 : -1) * 0.22 * (1 - Math.abs(t - 0.5) * 2);
    return {
      id: `destination-${index}`,
      position: new Vector3(
        Math.sin(angle) * FAN_RADIUS,
        Math.cos(angle) * FAN_RADIUS * 0.6 - 0.1,
        depth,
      ),
      phaseOffset: t,
    };
  });
}

/** The hub. A faceted wireframe rather than a solid sphere, on purpose — see the file doc comment. */
function DraftNode({ color }: { readonly color: string }) {
  const ref = useRef<Mesh>(null);

  useFrame((state: RootState) => {
    const mesh = ref.current;
    if (!mesh) return;
    // A slow, small breathing scale — not a rotation. Enough to read as
    // "alive" without the composition becoming "a shape that spins".
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.045;
    mesh.scale.setScalar(breathe);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.34, 0]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

/**
 * Built imperatively via `<primitive>` rather than the JSX `<line>`
 * intrinsic: `<line>` is also the SVG line element, and `@react-three/fiber`'s
 * global JSX augmentation loses that naming collision to React's own DOM
 * types, so `<line geometry={...}>` type-checks as an `<svg>` line and
 * rejects the `geometry` prop. `<primitive>` has no such collision, and is
 * the documented way to render a plain `THREE.Line`.
 */
function SpokeLine({ to, color }: { readonly to: Vector3; readonly color: string }) {
  const line = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints([ORIGIN, to]);
    const material = new LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
    return new Line(geometry, material);
  }, [to, color]);

  // `<primitive>` never disposes what it did not create, so this scene's
  // handful of geometries/materials are cleaned up explicitly rather than
  // left for the renderer to guess about.
  useEffect(() => {
    return () => {
      line.geometry.dispose();
      line.material.dispose();
    };
  }, [line]);

  return <primitive object={line} />;
}

function DestinationNode({
  position,
  color,
}: {
  readonly position: Vector3;
  readonly color: string;
}) {
  return (
    <mesh position={position}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/** One publish event travelling from the hub to a single destination, looping. */
function PublishPulse({
  to,
  color,
  phaseOffset,
}: {
  readonly to: Vector3;
  readonly color: string;
  readonly phaseOffset: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state: RootState) => {
    const mesh = ref.current;
    if (!mesh) return;
    const progress = (state.clock.elapsedTime / PULSE_CYCLE_SECONDS + phaseOffset) % 1;
    mesh.position.lerpVectors(ORIGIN, to, progress);
    // Fades in from the hub, fades out on arrival, rather than popping or
    // teleporting on loop.
    const fade = Math.sin(progress * Math.PI);
    mesh.scale.setScalar(0.5 + fade * 0.6);
    const material = mesh.material;
    if (!Array.isArray(material) && 'opacity' in material) {
      (material as MeshBasicMaterial).opacity = 0.15 + fade * 0.85;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

function PublishFanoutGraph({ colors }: { readonly colors: PublishSceneColors }) {
  const destinations = useMemo(buildDestinations, []);

  return (
    <group>
      <DraftNode color={colors.node} />
      {destinations.map((d) => (
        <SpokeLine key={d.id} to={d.position} color={colors.line} />
      ))}
      {destinations.map((d) => (
        <DestinationNode key={d.id} position={d.position} color={colors.satellite} />
      ))}
      {destinations.map((d) => (
        <PublishPulse key={d.id} to={d.position} color={colors.pulse} phaseOffset={d.phaseOffset} />
      ))}
    </group>
  );
}

/**
 * The default export is what `next/dynamic(() => import('./hero-publish-scene'), { ssr: false })`
 * resolves in `hero-webgl-stage.tsx`.
 *
 * `frameloop` is the pause switch: `"never"` stops `@react-three/fiber`'s
 * internal `requestAnimationFrame` loop outright rather than merely skipping
 * work inside it, so a scrolled-away or backgrounded tab genuinely calls no
 * per-frame code. `dpr` is a plain number, not the `[min, max]` tuple form —
 * the caller already computed `Math.min(devicePixelRatio, 2)` once, so this
 * stays a fixed value rather than something r3f re-derives every frame.
 */
export default function HeroPublishCanvas({ colors, active, dpr }: HeroPublishCanvasProps) {
  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 3.1], fov: 38 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <PublishFanoutGraph colors={colors} />
    </Canvas>
  );
}
