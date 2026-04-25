// SVGキャンバス描画エンジン
import { renderSymbol, getSymbolDef, getConnectionPoints } from './symbols.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CONN_RADIUS = 5;
const CONN_HOVER_RADIUS = 8;

export class Renderer {
  constructor(svgEl) {
    this.svg = svgEl;
    this.vx = 0; this.vy = 0; this.scale = 1;
    this.gridSize = 20;
    this.showGrid = true;

    this._layers = {};
    this._buildLayers();
    this._buildDefs();
    this._resizeObserver = new ResizeObserver(() => this._updateGrid());
    this._resizeObserver.observe(this.svg);
  }

  _buildLayers() {
    const layerIds = ['grid', 'wires', 'components', 'labels', 'connpoints', 'overlay'];
    for (const id of layerIds) {
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('id', `layer-${id}`);
      this.svg.appendChild(g);
      this._layers[id] = g;
    }
  }

  _buildDefs() {
    const defs = document.createElementNS(SVG_NS, 'defs');
    // グリッドパターン
    const pat = document.createElementNS(SVG_NS, 'pattern');
    pat.setAttribute('id', 'grid-pattern');
    pat.setAttribute('patternUnits', 'userSpaceOnUse');
    this._gridPatEl = pat;
    const minorLine1 = this._makeLine('grid-line', 0, 0, 0, 0);
    const minorLine2 = this._makeLine('grid-line', 0, 0, 0, 0);
    pat.appendChild(minorLine1); pat.appendChild(minorLine2);
    this._gridLineH = minorLine2; this._gridLineV = minorLine1;
    defs.appendChild(pat);
    this.svg.insertBefore(defs, this.svg.firstChild);
    this._defs = defs;
  }

  _makeLine(cls, x1, y1, x2, y2) {
    const l = document.createElementNS(SVG_NS, 'line');
    l.setAttribute('class', cls);
    l.setAttribute('x1', x1); l.setAttribute('y1', y1);
    l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    return l;
  }

  setViewport(x, y, scale) {
    this.vx = x; this.vy = y; this.scale = scale;
    this._applyTransform();
    this._updateGrid();
  }

  _applyTransform() {
    const tx = `translate(${-this.vx * this.scale},${-this.vy * this.scale}) scale(${this.scale})`;
    for (const id of ['wires', 'components', 'labels', 'connpoints', 'overlay']) {
      this._layers[id].setAttribute('transform', tx);
    }
  }

  _updateGrid() {
    const sz = this.gridSize * this.scale;
    if (!this.showGrid || sz < 4) {
      this._layers.grid.innerHTML = '';
      return;
    }
    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('width', '100%'); r.setAttribute('height', '100%');
    r.setAttribute('fill', `url(#grid-pattern)`);
    this._gridPatEl.setAttribute('width', sz);
    this._gridPatEl.setAttribute('height', sz);
    // オフセット計算
    const ox = ((-this.vx * this.scale) % sz + sz) % sz;
    const oy = ((-this.vy * this.scale) % sz + sz) % sz;
    this._gridPatEl.setAttribute('x', ox);
    this._gridPatEl.setAttribute('y', oy);
    this._gridLineV.setAttribute('x1', 0); this._gridLineV.setAttribute('y1', 0);
    this._gridLineV.setAttribute('x2', 0); this._gridLineV.setAttribute('y2', sz);
    this._gridLineH.setAttribute('x1', 0); this._gridLineH.setAttribute('y1', 0);
    this._gridLineH.setAttribute('x2', sz); this._gridLineH.setAttribute('y2', 0);
    if (!this._layers.grid.contains(r)) {
      this._layers.grid.innerHTML = '';
      this._layers.grid.appendChild(r);
    }
    // パターン再登録
    if (!this._defs.contains(this._gridPatEl)) this._defs.appendChild(this._gridPatEl);
    // 再描画トリガー
    r.setAttribute('width', '100%');
  }

  // ダイアグラム全体を再描画
  render(diagram, selectedIds, mode, wirePreview, hoveredConnPoint) {
    this._renderWires(diagram.wires, selectedIds, wirePreview);
    this._renderComponents(diagram.components, selectedIds);
    this._renderTexts(diagram.texts, selectedIds);
    this._renderConnPoints(diagram.components, mode, hoveredConnPoint);
    this._renderJunctions(diagram.wires);
  }

  _renderWires(wires, selectedIds, wirePreview) {
    const layer = this._layers.wires;
    layer.innerHTML = '';
    for (const w of wires) {
      if (w.points.length < 2) continue;
      const d = w.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const el = this._svgEl('path', { d, class: 'wire-line', 'data-id': w.id });
      if (selectedIds.has(w.id)) el.classList.add('wire-selected');
      layer.appendChild(el);
      // ラベル
      if (w.label) {
        const mid = w.points[Math.floor(w.points.length / 2)];
        const t = this._svgEl('text', { x: mid.x, y: mid.y - 6, class: 'wire-label' });
        t.textContent = w.label;
        layer.appendChild(t);
      }
    }
    // 配線プレビュー
    if (wirePreview && wirePreview.length >= 2) {
      const d = wirePreview.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      layer.appendChild(this._svgEl('path', { d, class: 'wire-preview' }));
    }
  }

  _renderComponents(components, selectedIds) {
    const cl = this._layers.components;
    const ll = this._layers.labels;
    cl.innerHTML = ''; ll.innerHTML = '';
    for (const comp of components) {
      const def = getSymbolDef(comp.symbolId);
      if (!def) continue;
      const sym = renderSymbol(comp.symbolId);
      if (!sym) continue;

      const g = this._svgEl('g', {
        transform: `translate(${comp.x},${comp.y}) rotate(${comp.rotation || 0})`,
        'data-id': comp.id,
        class: 'component-g',
      });
      g.appendChild(sym);

      if (selectedIds.has(comp.id)) {
        const { minX, minY, maxX, maxY } = def.bbox;
        const sel = this._svgEl('rect', {
          x: minX - 3, y: minY - 3,
          width: maxX - minX + 6, height: maxY - minY + 6,
          class: 'selected-overlay',
        });
        g.appendChild(sel);
        // 回転ハンドル（bbox上辺中央の上 20px）
        const midX = (minX + maxX) / 2;
        const handleY = minY - 20;
        const stem = this._svgEl('line', {
          x1: midX, y1: minY - 3, x2: midX, y2: handleY + 7,
          stroke: '#1a73e8', 'stroke-width': 1, 'stroke-dasharray': '2,2',
        });
        g.appendChild(stem);
        const rh = this._svgEl('circle', {
          cx: midX, cy: handleY,
          r: 7, class: 'rotation-handle', 'data-id': comp.id,
        });
        g.appendChild(rh);
        // 回転アイコン（弧＋矢印）
        const iconArc = this._svgEl('path', {
          d: `M ${midX - 5} ${handleY - 2} A 5 5 0 1 1 ${midX + 5} ${handleY - 2}`,
          fill: 'none', stroke: '#fff', 'stroke-width': 1.5,
          'pointer-events': 'none',
        });
        const arrowTip = this._svgEl('polygon', {
          points: `${midX + 5},${handleY - 5} ${midX + 9},${handleY - 1} ${midX + 2},${handleY - 1}`,
          fill: '#fff', 'pointer-events': 'none',
        });
        g.appendChild(iconArc);
        g.appendChild(arrowTip);
      }
      cl.appendChild(g);

      // ラベル
      if (comp.label) {
        const { minY, maxX, maxY, minX } = def.bbox;
        const lx = comp.x + (minX + maxX) / 2;
        const ly = comp.y + maxY + 14;
        const t = this._svgEl('text', { x: lx, y: ly, class: 'component-label', 'data-id': comp.id });
        t.textContent = comp.label;
        ll.appendChild(t);
      }
    }
  }

  _renderTexts(texts, selectedIds) {
    // テキスト要素はラベルレイヤーに追加済みの後ろに追記
    const ll = this._layers.labels;
    for (const t of texts) {
      const el = this._svgEl('text', {
        x: t.x, y: t.y,
        class: 'text-label' + (selectedIds.has(t.id) ? ' text-selected' : ''),
        'font-size': t.fontSize || 12,
        'data-id': t.id,
      });
      el.textContent = t.text;
      ll.appendChild(el);
    }
  }

  _renderConnPoints(components, mode, hoveredId) {
    const layer = this._layers.connpoints;
    layer.innerHTML = '';
    if (mode !== 'wire') return;
    for (const comp of components) {
      const def = getSymbolDef(comp.symbolId);
      if (!def) continue;
      const pts = getConnectionPoints(def, comp.x, comp.y, comp.rotation);
      for (const pt of pts) {
        const key = `${comp.id}:${pt.dir}`;
        const isHovered = hoveredId === key;
        const r = isHovered ? CONN_HOVER_RADIUS : CONN_RADIUS;
        const el = this._svgEl('circle', {
          cx: pt.x, cy: pt.y, r,
          class: 'connection-point' + (isHovered ? ' active' : ''),
          'data-conn': key,
          'data-cx': pt.x, 'data-cy': pt.y,
        });
        layer.appendChild(el);
      }
    }
  }

  _renderJunctions(wires) {
    // T字・十字交差に黒点を描画
    const layer = this._layers.overlay;
    // junction要素のみ削除して再描画
    layer.querySelectorAll('.junction-dot').forEach(e => e.remove());
    const countMap = new Map();
    for (const w of wires) {
      for (const p of w.points) {
        const key = `${Math.round(p.x)},${Math.round(p.y)}`;
        countMap.set(key, (countMap.get(key) || 0) + 1);
      }
    }
    for (const [key, cnt] of countMap) {
      if (cnt < 3) continue;
      const [x, y] = key.split(',').map(Number);
      const dot = this._svgEl('circle', { cx: x, cy: y, r: 4, class: 'junction-dot' });
      layer.appendChild(dot);
    }
  }

  // 選択ラバーバンド
  setSelectionBox(x1, y1, x2, y2) {
    const layer = this._layers.overlay;
    let box = layer.querySelector('.selection-box');
    if (x1 === null) { if (box) box.remove(); return; }
    if (!box) { box = this._svgEl('rect', { class: 'selection-box' }); layer.appendChild(box); }
    const rx = Math.min(x1, x2); const ry = Math.min(y1, y2);
    box.setAttribute('x', rx); box.setAttribute('y', ry);
    box.setAttribute('width', Math.abs(x2 - x1));
    box.setAttribute('height', Math.abs(y2 - y1));
  }

  // SVG座標 ↔ ワールド座標
  svgToWorld(svgX, svgY) {
    const rect = this.svg.getBoundingClientRect();
    const x = (svgX - rect.left) / this.scale + this.vx;
    const y = (svgY - rect.top) / this.scale + this.vy;
    return { x, y };
  }

  clientToWorld(cx, cy) {
    return this.svgToWorld(cx, cy);
  }

  snap(val) {
    if (!this._snap) return val;
    return Math.round(val / this.gridSize) * this.gridSize;
  }

  setSnap(enabled) { this._snap = enabled; }
  setGridSize(sz) { this.gridSize = sz; this._updateGrid(); }
  setShowGrid(v) { this.showGrid = v; this._updateGrid(); }

  // フィットビュー
  fitToContent(diagram) {
    const all = [];
    for (const c of diagram.components) {
      const def = getSymbolDef(c.symbolId);
      if (def) {
        all.push(c.x + def.bbox.minX, c.x + def.bbox.maxX);
        all.push(c.y + def.bbox.minY, c.y + def.bbox.maxY);
      }
    }
    for (const w of diagram.wires) {
      for (const p of w.points) { all.push(p.x, p.y); }
    }
    if (all.length === 0) { this.setViewport(0, 0, 1); return; }
    const xs = all.filter((_, i) => i % 2 === 0);
    const ys = all.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs) - 40; const maxX = Math.max(...xs) + 40;
    const minY = Math.min(...ys) - 40; const maxY = Math.max(...ys) + 40;
    const svgW = this.svg.clientWidth || 800;
    const svgH = this.svg.clientHeight || 600;
    const sc = Math.min(svgW / (maxX - minX), svgH / (maxY - minY), 3);
    this.setViewport(minX + (maxX - minX) / 2 - svgW / sc / 2, minY + (maxY - minY) / 2 - svgH / sc / 2, sc);
  }

  _svgEl(tag, attrs) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    return e;
  }

  // ヒットテスト（ワールド座標で最前面の要素IDを返す）
  hitTest(diagram, wx, wy, margin = 8) {
    // テキスト
    for (const t of [...diagram.texts].reverse()) {
      if (Math.abs(t.x - wx) < 40 && Math.abs(t.y - wy) < 14) return t.id;
    }
    // 部品
    for (const comp of [...diagram.components].reverse()) {
      const def = getSymbolDef(comp.symbolId);
      if (!def) continue;
      const { minX, minY, maxX, maxY } = def.bbox;
      const lx = wx - comp.x; const ly = wy - comp.y;
      // 回転を逆適用
      const rad = -(comp.rotation || 0) * Math.PI / 180;
      const rx = lx * Math.cos(rad) - ly * Math.sin(rad);
      const ry = lx * Math.sin(rad) + ly * Math.cos(rad);
      if (rx >= minX - margin && rx <= maxX + margin && ry >= minY - margin && ry <= maxY + margin) return comp.id;
    }
    // ワイヤー
    for (const w of [...diagram.wires].reverse()) {
      if (this._pointNearPolyline(wx, wy, w.points, margin)) return w.id;
    }
    return null;
  }

  _pointNearPolyline(px, py, points, margin) {
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i]; const b = points[i + 1];
      if (this._distToSegment(px, py, a.x, a.y, b.x, b.y) <= margin) return true;
    }
    return false;
  }

  _distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax; const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  // 接続点ヒットテスト
  hitTestConnPoint(diagram, wx, wy) {
    for (const comp of diagram.components) {
      const def = getSymbolDef(comp.symbolId);
      if (!def) continue;
      const pts = getConnectionPoints(def, comp.x, comp.y, comp.rotation);
      for (const pt of pts) {
        if (Math.hypot(pt.x - wx, pt.y - wy) <= CONN_HOVER_RADIUS + 2) {
          return { key: `${comp.id}:${pt.dir}`, x: pt.x, y: pt.y };
        }
      }
    }
    return null;
  }

  // ラバーバンド内の要素IDを返す
  hitTestBox(diagram, x1, y1, x2, y2) {
    const minX = Math.min(x1, x2); const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2); const maxY = Math.max(y1, y2);
    const ids = [];
    for (const comp of diagram.components) {
      if (comp.x >= minX && comp.x <= maxX && comp.y >= minY && comp.y <= maxY) ids.push(comp.id);
    }
    for (const w of diagram.wires) {
      if (w.points.every(p => p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY)) ids.push(w.id);
    }
    for (const t of diagram.texts) {
      if (t.x >= minX && t.x <= maxX && t.y >= minY && t.y <= maxY) ids.push(t.id);
    }
    return ids;
  }
}
