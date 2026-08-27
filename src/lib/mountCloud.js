import * as THREE from 'three';

/* Abdulla's neon cloud hero, recolored to Nocturne's accent and mountable
   on any canvas. Geometry, orbits and fit logic are unchanged from the
   original: contour-swept ring tubes, two small laps, three satellites,
   a mirrored ghost reflection, pointer parallax, visibility gating.

   Ported from the Nocturne design bundle's neon-cloud.js — only the three.js
   import switched from a CDN URL to the npm package. */
export function mountCloud(canvas, opts = {}) {
  const accent = opts.accent || '#9184d9';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.42, 6.6);

  const NEON = new THREE.Color(accent);
  const uniforms = { uTime: { value: 0 }, uA: { value: NEON } };

  const DISKS = [
    [-0.12, -0.16, 0.58],
    [-0.74, -0.14, 0.44], [0.56, -0.16, 0.44],
    [-0.48, 0.20, 0.46],
    [0.14, 0.32, 0.50],
    [0.66, 0.12, 0.38],
  ];
  const Y_BASE = -0.40, DEPTH = 0.56, RINGS = Math.max(4, opts.rings ?? 14), RING_SAMPLES = 640, SOFT = 34;

  function contour(t) {
    const cx = Math.cos(t), cy = Math.sin(t);
    let acc = 0;
    for (const [dx, dy, r] of DISKS) {
      const proj = dx * cx + dy * cy;
      const disc = r * r - (dx * dx + dy * dy - proj * proj);
      if (disc <= 0) continue;
      acc += Math.exp(SOFT * (proj + Math.sqrt(disc)));
    }
    let best = acc > 0 ? Math.log(acc) / SOFT : 0.08;
    if (cy < -0.04) {
      const lim = Y_BASE / cy;
      best = -Math.log(Math.exp(-SOFT * best) + Math.exp(-SOFT * lim)) / SOFT;
    }
    return best;
  }

  function ringCurve(z) {
    const taper = Math.sqrt(Math.max(1 - (z / DEPTH) ** 2 * 0.92, 0));
    const pts = [];
    for (let i = 0; i < RING_SAMPLES; i++) {
      const t = (i / RING_SAMPLES) * Math.PI * 2;
      const r = contour(t) * (0.30 + 0.70 * taper);
      pts.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t) + 0.07 * (1 - taper), 0));
    }
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
  }

  function neonShader(mat, gain) {
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = 'varying float vT;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\n  vT = uv.x;'
      );
      shader.fragmentShader = 'uniform float uTime;\nuniform vec3 uA;\nvarying float vT;\n' +
        shader.fragmentShader.replace('#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          float pulse = 0.5 + 0.5 * sin((vT * 9.0 - uTime * 0.22) * 6.2831853);
          vec3 hue = uA / max(max(uA.r, uA.g), uA.b);
          totalEmissiveRadiance = hue * mix(0.34, ${gain.toFixed(2)}, pulse);`);
    };
    mat.customProgramCacheKey = () => 'noct' + gain;
    return mat;
  }

  const coreMat = neonShader(new THREE.MeshStandardMaterial({
    color: 0x090713, emissive: NEON, roughness: 0.22, metalness: 0.32, envMapIntensity: 1.4,
  }), 0.92);
  const haloMat = neonShader(new THREE.MeshStandardMaterial({
    color: 0x000000, emissive: NEON, roughness: 1, metalness: 0,
    transparent: true, opacity: 0.17, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.BackSide,
  }), 0.85);

  const cloud = new THREE.Group();
  const rings = [];
  for (let i = 0; i < RINGS; i++) {
    const z = -DEPTH + 2 * DEPTH * (i / (RINGS - 1));
    const curve = ringCurve(z);
    const ring = new THREE.Group();
    ring.add(
      new THREE.Mesh(new THREE.TubeGeometry(curve, 620, 0.013, 12, true), coreMat),
      new THREE.Mesh(new THREE.TubeGeometry(curve, 200, 0.042, 6, true), haloMat)
    );
    ring.position.z = z;
    cloud.add(ring);
    rings.push({ ring, baseZ: z, phase: i * 0.83, drift: 0.55 + (i % 5) * 0.11 });
  }

  const smallLaps = [
    { z: DEPTH * 0.52, scale: 0.78, phase: 0.4, drift: 0.74 },
    { z: -DEPTH * 0.52, scale: 0.70, phase: 2.6, drift: 0.61 },
  ].map((cfg) => {
    const ring = new THREE.Group();
    ring.scale.setScalar(cfg.scale);
    ring.add(new THREE.Mesh(new THREE.TubeGeometry(ringCurve(cfg.z), 480, 0.011, 10, true), coreMat));
    ring.position.z = cfg.z;
    cloud.add(ring);
    return { ring, ...cfg };
  });

  const SATS = [
    { scale: 0.32, rings: 11, radius: 1.34, y: 0.46, speed: 0.20, phase: 0.0, lift: 0.10, arc: 1.15, zBase: 1.60, zAmp: 0.40 },
    { scale: 0.24, rings: 9, radius: 1.52, y: -0.24, speed: -0.15, phase: 2.1, lift: 0.14, arc: -0.95, zBase: -1.70, zAmp: 0.42 },
    { scale: 0.18, rings: 7, radius: 1.20, y: 0.82, speed: 0.27, phase: 4.0, lift: 0.08, arc: 0.85, zBase: 1.35, zAmp: 0.36 },
  ];
  const sats = SATS.map((cfg) => {
    const g = new THREE.Group();
    g.scale.setScalar(cfg.scale);
    const rs = [];
    for (let i = 0; i < cfg.rings; i++) {
      const z = -DEPTH + 2 * DEPTH * (i / (cfg.rings - 1));
      const curve = ringCurve(z);
      const ring = new THREE.Group();
      ring.add(
        new THREE.Mesh(new THREE.TubeGeometry(curve, 380, 0.030, 10, true), coreMat),
        new THREE.Mesh(new THREE.TubeGeometry(curve, 150, 0.095, 6, true), haloMat)
      );
      ring.position.z = z;
      g.add(ring);
      rs.push({ ring, baseZ: z, phase: i * 1.21, drift: 0.7 + (i % 4) * 0.13 });
    }
    cloud.add(g);
    return { group: g, rings: rs, cfg };
  });
  scene.add(cloud);

  /* colored studio rig — blurple, no white light */
  scene.add(new THREE.HemisphereLight(0x3b3470, 0x241d47, 0.5));
  const key = new THREE.DirectionalLight(0x453e86, 1.2); key.position.set(4, 7, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0x241d47, 0.28); fill.position.set(-5, 3, -4); scene.add(fill);
  const rim = new THREE.PointLight(NEON, 6, 6, 2); rim.position.set(-1.2, 0.9, -1.1); scene.add(rim);

  const grad = document.createElement('canvas');
  grad.width = 16; grad.height = 256;
  const g2 = grad.getContext('2d');
  const lin = g2.createLinearGradient(0, 0, 0, 256);
  lin.addColorStop(0.00, '#171433'); lin.addColorStop(0.42, accent);
  lin.addColorStop(0.60, '#221f42'); lin.addColorStop(1.00, '#050509');
  g2.fillStyle = lin; g2.fillRect(0, 0, 16, 256);
  const envTex = new THREE.CanvasTexture(grad);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;
  scene.environment = new THREE.PMREMGenerator(renderer).fromEquirectangular(envTex).texture;
  scene.environmentIntensity = 0.75;

  /* mirrored ghost reflection */
  const reflection = new THREE.Group();
  reflection.scale.y = -0.7;
  const reflMat = coreMat.clone();
  reflMat.transparent = true; reflMat.opacity = 0.30;
  reflMat.depthWrite = false; reflMat.depthTest = false;
  reflMat.blending = THREE.AdditiveBlending; reflMat.side = THREE.FrontSide;
  const baseCompile = reflMat.onBeforeCompile;
  reflMat.onBeforeCompile = (shader, r) => {
    baseCompile(shader, r);
    shader.vertexShader = 'varying float vWY;\n' + shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      '#include <worldpos_vertex>\n  vWY = (modelMatrix * vec4(transformed, 1.0)).y;'
    );
    shader.fragmentShader = 'varying float vWY;\n' + shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      '#include <dithering_fragment>\n  gl_FragColor.rgb *= clamp(1.0 + (vWY + 0.5) * 1.15, 0.0, 1.0);'
    );
  };
  reflMat.customProgramCacheKey = () => 'noct_reflected';
  const reflSources = [...rings.map(r => r.ring), ...smallLaps.map(r => r.ring)];
  const reflRings = reflSources.map((ring) => {
    const m = new THREE.Mesh(ring.children[0].geometry, reflMat);
    m.scale.copy(ring.scale);
    m.renderOrder = 3;
    reflection.add(m);
    return m;
  });
  scene.add(reflection);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    pointer.tx = (e.clientX / innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / innerHeight - 0.5) * 2;
  };
  if (!reduce) addEventListener('pointermove', onPointer, { passive: true });

  let visible = true, onScreen = true, stopped = false;
  const sync = () => {
    const want = onScreen && !document.hidden;
    if (want === visible) return;
    visible = want;
    if (visible && !stopped && !reduce) { clock.getDelta(); raf = requestAnimationFrame(tick); }
    else { cancelAnimationFrame(raf); raf = 0; }
  };
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { rootMargin: '150px' });
  io.observe(canvas);
  const onVis = () => sync();
  document.addEventListener('visibilitychange', onVis);

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    frame(clock.getElapsedTime());
  };

  let fitScale = 1;

  const SYS = (() => {
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    for (let i = 0; i < 32; i++) {
      const t = (i / 32) * 40;
      for (const s2 of sats) {
        const a2 = s2.cfg.phase + t * s2.cfg.speed;
        const cross2 = 1 - Math.abs(Math.cos(a2));
        s2.group.position.set(
          Math.cos(a2) * s2.cfg.radius,
          s2.cfg.y + cross2 * s2.cfg.arc + Math.sin(t * 0.5 + s2.cfg.phase) * s2.cfg.lift,
          s2.cfg.zBase + Math.sin(a2) * s2.cfg.zAmp
        );
      }
      cloud.updateMatrixWorld(true);
      box.union(tmp.setFromObject(cloud));
    }
    const yTop = box.max.y;
    const yBot = Math.min(box.min.y, -0.85 - 0.7 * yTop);
    return {
      halfX: Math.max(Math.abs(box.min.x), Math.abs(box.max.x)),
      zNear: box.max.z,
      centreY: (yTop + yBot) / 2,
      halfY: (yTop - yBot) / 2,
    };
  })();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 44 : 32;
    camera.updateProjectionMatrix();
    const tanH = Math.tan((camera.fov * Math.PI / 180) / 2);
    const camZ = camera.position.z;
    const mag = camZ / (camZ - SYS.zNear);
    const fit = Math.min(
      (tanH * camZ * camera.aspect) / (SYS.halfX * mag),
      (tanH * camZ) / (SYS.halfY * mag)
    ) * (opts.fill ?? 0.94);
    fitScale = fit;
    cloud.scale.setScalar(fit);
    reflection.scale.set(fit, -0.7 * fit, fit);
    reflection.position.y = -0.85 * fit;
    camera.position.y = SYS.centreY * fit;
    camera.lookAt(0, SYS.centreY * fit, 0);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const clock = new THREE.Clock();
  let raf = 0;

  function frame(t) {
    uniforms.uTime.value = t;
    for (const r of rings) {
      r.ring.position.y = Math.sin(t * r.drift + r.phase) * 0.055;
      r.ring.position.z = r.baseZ + Math.sin(t * r.drift * 0.6 + r.phase) * 0.02;
      r.ring.rotation.z = Math.sin(t * r.drift * 0.45 + r.phase) * 0.014;
    }
    for (const r of smallLaps) {
      r.ring.position.y = Math.sin(t * r.drift + r.phase) * 0.05;
      r.ring.position.z = r.z + Math.sin(t * r.drift * 0.7 + r.phase) * 0.025;
      r.ring.rotation.z = Math.sin(t * r.drift * 0.5 + r.phase) * 0.022;
    }
    for (const s of sats) {
      const a = s.cfg.phase + t * s.cfg.speed;
      const cross = 1 - Math.abs(Math.cos(a));
      s.group.position.set(
        Math.cos(a) * s.cfg.radius,
        s.cfg.y + cross * s.cfg.arc + Math.sin(t * 0.5 + s.cfg.phase) * s.cfg.lift,
        s.cfg.zBase + Math.sin(a) * s.cfg.zAmp
      );
      s.group.rotation.y = Math.sin(a) * 0.28;
      for (const r of s.rings) {
        r.ring.position.y = Math.sin(t * r.drift + r.phase) * 0.10;
        r.ring.position.z = r.baseZ + Math.sin(t * r.drift * 0.6 + r.phase) * 0.04;
      }
    }
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    cloud.position.y = Math.sin(t * 0.5) * 0.035 * fitScale;
    cloud.rotation.y = pointer.x * 0.28 + Math.sin(t * 0.1) * 0.1;
    cloud.rotation.x = pointer.y * 0.10;
    reflection.rotation.y = cloud.rotation.y;
    reflection.rotation.x = -cloud.rotation.x;
    for (let i = 0; i < reflSources.length; i++) {
      reflRings[i].position.copy(reflSources[i].position);
      reflRings[i].rotation.z = reflSources[i].rotation.z;
    }
    renderer.render(scene, camera);
  }

  if (reduce) {
    frame(2.2);
  } else {
    raf = requestAnimationFrame(tick);
  }

  return function destroy() {
    stopped = true;
    cancelAnimationFrame(raf);
    removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVis);
    io.disconnect(); ro.disconnect();
    renderer.dispose();
  };
}
