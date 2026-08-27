// <dna-helix> — a double helix drawn out of code glyphs. Canvas, DPR-aware,
// respects reduced motion. Ported verbatim from the Nocturne design bundle
// (project/dna-helix.js) — self-contained, no external deps.
// Attributes: axis="vertical|horizontal" amplitude spacing font-size speed twist opacity accent glyphs rungs
(() => {
  const SETS = {
    mixed: '{}[]()<>/=;:*+-|&!?01abcdefconstawaitasyncAWSiot=>',
    symbols: '{}[]()<>/\\=;:.,*+-|&!?$#@~^%_"\'`',
    hex: '0123456789ABCDEFx',
    bases: 'ACGT'
  };
  class DnaHelix extends HTMLElement {
    connectedCallback() {
      if (this._c) return;
      this.style.display = this.style.display || 'block';
      const host = this.parentElement;
      if (host && getComputedStyle(host).position !== 'static') {
        this.style.position = this.style.position || 'absolute';
        this.style.inset = this.style.inset || '0';
      } else {
        if (!this.style.width) this.style.width = '100%';
        if (!this.style.height) this.style.height = '100%';
      }
      this._c = document.createElement('canvas');
      this._c.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(this._c);
      this._ctx = this._c.getContext('2d');
      this._t = 0;
      this._ro = new ResizeObserver(() => this._size());
      this._ro.observe(this);
      this._size();
      this._reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._loop = (ms) => {
        if (this._last == null) this._last = ms;
        const dt = Math.min(64, ms - this._last); this._last = ms;
        if (!this._reduced) this._t += dt / 1000;
        this._draw();
        this._raf = requestAnimationFrame(this._loop);
      };
      this._onScreen = true;
      this._io = new IntersectionObserver(([e]) => {
        this._onScreen = e.isIntersecting;
        if (this._onScreen) { this._last = null; if (!this._raf) this._raf = requestAnimationFrame(this._loop); }
        else if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; this._draw(); }
      }, { rootMargin: '200px' });
      this._io.observe(this);
      this._onVis = () => {
        if (document.hidden) { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; } }
        else if (this._onScreen && !this._raf) { this._last = null; this._raf = requestAnimationFrame(this._loop); }
      };
      document.addEventListener('visibilitychange', this._onVis);
      this._raf = requestAnimationFrame(this._loop);
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf); this._raf = 0;
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      if (this._onVis) document.removeEventListener('visibilitychange', this._onVis);
    }
    _size() {
      const r = this.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this._w = Math.max(1, r.width); this._h = Math.max(1, r.height);
      this._c.width = Math.round(this._w * dpr); this._c.height = Math.round(this._h * dpr);
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    _n(name, d) { const v = parseFloat(this.getAttribute(name)); return isNaN(v) ? d : v; }
    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const vertical = (this.getAttribute('axis') || 'vertical') === 'vertical';
      const len = vertical ? h : w;
      const cross = vertical ? w : h;
      const amp = this._n('amplitude', Math.min(cross * 0.42, 90));
      const spacing = this._n('spacing', 26);
      const fs = this._n('font-size', 12);
      const speed = this._n('speed', 0.5);
      const twist = this._n('twist', 0.011);
      const alpha = this._n('opacity', 0.5);
      const accent = this.getAttribute('accent') || '#9184d9';
      const rungEvery = Math.max(0, Math.round(this._n('rungs', 3)));
      const chars = (SETS[this.getAttribute('glyphs')] || SETS.mixed).split('');
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const mid = cross / 2;
      const count = Math.ceil(len / spacing) + 2;
      const tick = Math.floor(this._t * 3.2);
      const strands = [];
      for (let i = 0; i < count; i++) {
        const along = i * spacing - spacing;
        const phase = along * twist + this._t * speed;
        const pts = [];
        for (let s = 0; s < 2; s++) {
          const p = phase + s * Math.PI;
          const off = Math.sin(p) * amp;
          const z = Math.cos(p);                 // 1 = front, -1 = back
          const depth = (z + 1) / 2;             // 0..1
          const x = vertical ? mid + off : along;
          const y = vertical ? along : mid + off;
          pts.push({ x, y, depth, z });
        }
        strands.push(pts);
        if (rungEvery && i % rungEvery === 0) {
          const a = pts[0], b = pts[1];
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          const ra = alpha * 0.28 * (0.35 + 0.65 * a.depth);
          const rb = alpha * 0.28 * (0.35 + 0.65 * b.depth);
          g.addColorStop(0, `rgba(145,132,217,${ra.toFixed(3)})`);
          g.addColorStop(0.5, `rgba(145,132,217,${(Math.max(ra, rb) * 0.5).toFixed(3)})`);
          g.addColorStop(1, `rgba(145,132,217,${rb.toFixed(3)})`);
          ctx.strokeStyle = g; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (let i = 0; i < strands.length; i++) {
        for (let s = 0; s < 2; s++) {
          const p = strands[i][s];
          const idx = (i * 7 + s * 13 + ((tick + i * 3 + s) % 5) * 31) % chars.length;
          const size = fs * (0.78 + 0.32 * p.depth);
          const a = alpha * (0.14 + 0.86 * Math.pow(p.depth, 1.5));
          ctx.font = `${size.toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          if (p.depth > 0.72) {
            ctx.fillStyle = `rgba(185,177,236,${(a * 0.95).toFixed(3)})`;
            ctx.shadowColor = accent; ctx.shadowBlur = 8 * (p.depth - 0.72) * 3;
          } else {
            ctx.fillStyle = `rgba(233,233,237,${(a * 0.55).toFixed(3)})`;
            ctx.shadowBlur = 0;
          }
          ctx.fillText(chars[idx], p.x, p.y);
          ctx.shadowBlur = 0;
        }
      }
    }
  }
  if (!customElements.get('dna-helix')) customElements.define('dna-helix', DnaHelix);
})();
