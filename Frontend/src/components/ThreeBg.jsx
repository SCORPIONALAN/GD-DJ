/**
 * ThreeBg — fondo 3D interactivo con Three.js.
 *
 * Escena:
 *  - 2 tornamesas de vinilo girando (izquierda/derecha)
 *  - Mixer DJ central con faders y knobs
 *  - 32 barras de ecualizador animadas a 128 BPM
 *  - 1800 partículas que reaccionan al cursor
 *  - Ring giratorio y lasers decorativos
 *  - Iluminación: luz cyan, magenta y blanca
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BPM    = 128;
const BEAT   = 60 / BPM;           // segundos por beat
const CYAN   = 0x00f5ff;
const MAGENTA = 0xff00aa;
const WHITE  = 0xffffff;

export default function ThreeBg() {
  const mountRef  = useRef(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = mountRef.current;
    const W  = el.clientWidth;
    const H  = el.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Escena y cámara ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 0, 0);

    // ── Iluminación ───────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(WHITE, 0.2));
    const cyanLight   = new THREE.PointLight(CYAN, 3, 30);
    const magentaLight = new THREE.PointLight(MAGENTA, 3, 30);
    const whiteLight  = new THREE.PointLight(WHITE, 1, 20);
    cyanLight.position.set(-5, 5, 5);
    magentaLight.position.set(5, 5, 5);
    whiteLight.position.set(0, 8, 0);
    scene.add(cyanLight, magentaLight, whiteLight);

    // ── Grid helper ───────────────────────────────────────────────────────────
    const grid = new THREE.GridHelper(30, 30, CYAN, CYAN);
    grid.material.opacity = 0.07;
    grid.material.transparent = true;
    grid.position.y = -2.5;
    scene.add(grid);

    // ── Tornamesa (función reutilizable) ──────────────────────────────────────
    function makeTurntable(x) {
      const group = new THREE.Group();

      // Base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.15, 2.4),
        new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.7, roughness: 0.3 })
      );
      group.add(base);

      // Plato (disco negro)
      const platter = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 0.08, 48),
        new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.5, roughness: 0.4 })
      );
      platter.position.y = 0.12;
      group.add(platter);

      // Surcos del vinilo
      for (let i = 3; i <= 9; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(i * 0.1, 0.005, 6, 48),
          new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 0.3 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.17;
        group.add(ring);
      }

      // Label central
      const label = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.09, 24),
        new THREE.MeshStandardMaterial({ color: MAGENTA, emissive: MAGENTA, emissiveIntensity: 0.5 })
      );
      label.position.y = 0.17;
      group.add(label);

      // Tonearm
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 0.9 })
      );
      arm.position.set(0.7, 0.35, -0.6);
      arm.rotation.z = Math.PI * 0.08;
      group.add(arm);

      group.position.set(x, -1.5, 0);
      return { group, platter };
    }

    const tt1 = makeTurntable(-3.2);
    const tt2 = makeTurntable(3.2);
    scene.add(tt1.group, tt2.group);

    // ── Mixer central ─────────────────────────────────────────────────────────
    const mixer = new THREE.Group();
    const mixerBody = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.2, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x0a0a1a, metalness: 0.6, roughness: 0.4 })
    );
    mixer.add(mixerBody);

    // Faders (4)
    const faderMat = new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 0.4 });
    [-0.6, -0.2, 0.2, 0.6].forEach((fx) => {
      const fader = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), faderMat);
      fader.position.set(fx, 0.28, 0.2);
      mixer.add(fader);
    });

    // Knobs (6)
    const knobMat = new THREE.MeshStandardMaterial({ color: MAGENTA, emissive: MAGENTA, emissiveIntensity: 0.3 });
    [-0.55, 0, 0.55].forEach((kx) => {
      [-0.15, 0.15].forEach((kz) => {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 12), knobMat);
        knob.position.set(kx, 0.2, kz);
        mixer.add(knob);
      });
    });

    mixer.position.set(0, -1.45, 0);
    scene.add(mixer);

    // ── Barras de ecualizador (32) ────────────────────────────────────────────
    const EQ_COUNT = 32;
    const eqBars = [];
    const eqMat  = new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 0.6 });

    for (let i = 0; i < EQ_COUNT; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1, 0.08), eqMat.clone());
      bar.position.set(-3.8 + i * 0.245, -1.5, -2);
      scene.add(bar);
      eqBars.push(bar);
    }

    // ── Partículas ────────────────────────────────────────────────────────────
    const PARTICLE_COUNT = 1800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: CYAN, size: 0.05, transparent: true, opacity: 0.6 })
    );
    scene.add(particles);

    // ── Ring giratorio ────────────────────────────────────────────────────────
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.04, 8, 80),
      new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 0.5, transparent: true, opacity: 0.4 })
    );
    ring.rotation.x = Math.PI * 0.3;
    ring.position.y = 1;
    scene.add(ring);

    // ── Lasers decorativos ────────────────────────────────────────────────────
    function makeLaser(color, ry) {
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
      const pts = [new THREE.Vector3(0, 3, 0), new THREE.Vector3(Math.cos(ry) * 10, -2, Math.sin(ry) * 10)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      return new THREE.Line(geo, mat);
    }
    [0, 1, 2, 3].forEach((i) => scene.add(makeLaser(i % 2 === 0 ? CYAN : MAGENTA, i * Math.PI / 2)));

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ── Mouse handler ─────────────────────────────────────────────────────────
    const onMouse = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Loop de animación ─────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const beat = (t % BEAT) / BEAT;   // 0..1 por beat

      // Giro platos
      tt1.platter.rotation.y = t * 1.5;
      tt2.platter.rotation.y = -t * 1.5;

      // Ring
      ring.rotation.z = t * 0.2;

      // Ecualizador sincronizado a BPM
      eqBars.forEach((bar, i) => {
        const freq  = Math.sin(t * BPM / 4 + i * 0.4) * 0.5 + 0.5;
        const pulse = Math.pow(Math.max(0, 1 - beat * 2), 2);
        const h     = 0.1 + freq * 2.5 + pulse * 0.8;
        bar.scale.y = h;
        bar.position.y = -1.5 + h / 2;
        bar.material.emissiveIntensity = 0.3 + freq * 0.7;
      });

      // Partículas responden al cursor
      const pos = particleGeo.attributes.position.array;
      const mx  = mouseRef.current.x * 3;
      const my  = -mouseRef.current.y * 3;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += (Math.random() - 0.5) * 0.01;
        pos[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
        // Atracción suave hacia el cursor
        pos[i * 3]     += (mx - pos[i * 3])     * 0.0003;
        pos[i * 3 + 1] += (my - pos[i * 3 + 1]) * 0.0003;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Cámara sigue el cursor levemente
      camera.position.x += (mouseRef.current.x * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseRef.current.y * 0.8 + 3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
