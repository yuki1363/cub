// 編集インタラクション（マウス・キーボード操作）
import { addComponent, addWire, addText, removeElements, moveComponents, moveWire, rotateComponent, getById } from './diagram.js';
import { getSymbolDef, getConnectionPoints } from './symbols.js';

export class Editor {
  constructor(svgEl, renderer, diagram, history, onUpdate) {
    this.svg = svgEl;
    this.renderer = renderer;
    this.diagram = diagram;
    this.history = history;
    this.onUpdate = onUpdate; // (diagram, reason) => void

    this.mode = 'select'; // 'select' | 'wire' | 'text'
    this.selectedIds = new Set();
    this.wirePoints = []; // 配線中の点列
    this.wirePreview = null; // プレビュー最終点
    this.hoveredConnPoint = null;

    this._dragState = null;
    this._lasso = null;
    this._draggingSymbolId = null; // パレットからのドラッグ

    // コピーバッファ
    this._clipboard = [];

    this._bindEvents();
  }

  setDiagram(diagram) {
    this.diagram = diagram;
    this.selectedIds.clear();
    this.wirePoints = [];
  }

  setMode(mode) {
    this.mode = mode;
    this.wirePoints = [];
    this.wirePreview = null;
    this.hoveredConnPoint = null;
    if (mode !== 'select') this.selectedIds.clear();
    this._redraw();
  }

  // --- イベントバインド ---
  _bindEvents() {
    const svg = this.svg;
    svg.addEventListener('mousedown', e => this._onMouseDown(e));
    svg.addEventListener('mousemove', e => this._onMouseMove(e));
    svg.addEventListener('mouseup', e => this._onMouseUp(e));
    svg.addEventListener('dblclick', e => this._onDblClick(e));
    svg.addEventListener('wheel', e => this._onWheel(e), { passive: false });

    // ドロップ（パレットから）
    svg.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    svg.addEventListener('drop', e => this._onDrop(e));

    // キーボード
    document.addEventListener('keydown', e => this._onKeyDown(e));
  }

  _clientToWorld(e) {
    return this.renderer.clientToWorld(e.clientX, e.clientY);
  }

  _snap(val) {
    return this.renderer.snap(val);
  }

  // --- マウスイベント ---
  _onMouseDown(e) {
    if (e.button !== 0) return;
    const w = this._clientToWorld(e);

    if (this.mode === 'select') {
      // 回転ハンドルのヒットテスト（最優先）
      const rotHit = this._hitTestRotationHandle(e.clientX, e.clientY);
      if (rotHit) {
        const comp = this.diagram.components.find(c => c.id === rotHit);
        if (comp) {
          this._dragState = {
            type: 'rotate',
            id: rotHit,
            cx: comp.x, cy: comp.y,
            startAngle: Math.atan2(w.y - comp.y, w.x - comp.x) * 180 / Math.PI,
            origRotation: comp.rotation || 0,
          };
          e.stopPropagation();
          this._redraw();
          return;
        }
      }

      // 部品ヒット
      const id = this.renderer.hitTest(this.diagram, w.x, w.y);
      if (id) {
        if (!e.shiftKey && !this.selectedIds.has(id)) this.selectedIds.clear();
        this.selectedIds.add(id);
        this._dragState = { type: 'move', startX: w.x, startY: w.y, lastX: w.x, lastY: w.y };
        this._saveHistory();
      } else {
        // ラッソ開始
        if (!e.shiftKey) this.selectedIds.clear();
        this._lasso = { x1: w.x, y1: w.y, x2: w.x, y2: w.y };
        this._dragState = { type: 'lasso' };
      }
      this._redraw();

    } else if (this.mode === 'wire') {
      const conn = this.renderer.hitTestConnPoint(this.diagram, w.x, w.y);
      const pt = conn ? { x: conn.x, y: conn.y } : { x: this._snap(w.x), y: this._snap(w.y) };

      if (this.wirePoints.length === 0) {
        this.wirePoints = [pt];
      } else {
        this.wirePoints.push(pt);
        // 接続点に到達 or 右クリックで確定（ここは左クリックなので接続点チェック）
        if (conn) {
          this._commitWire();
        }
      }
      this._redraw();
    }
  }

  _onMouseMove(e) {
    const w = this._clientToWorld(e);

    // ステータスバー座標更新
    document.getElementById('status-pos').textContent =
      `X: ${Math.round(w.x)}  Y: ${Math.round(w.y)}`;

    if (this.mode === 'wire') {
      const conn = this.renderer.hitTestConnPoint(this.diagram, w.x, w.y);
      this.hoveredConnPoint = conn ? conn.key : null;
      const pt = conn ? { x: conn.x, y: conn.y } : { x: this._snap(w.x), y: this._snap(w.y) };
      if (this.wirePoints.length > 0) {
        // 直角配線: 前点→水平→垂直
        const last = this.wirePoints[this.wirePoints.length - 1];
        this.wirePreview = [last, { x: pt.x, y: last.y }, pt];
      } else {
        this.wirePreview = null;
      }
      this._redraw();
      return;
    }

    if (!this._dragState) return;

    if (this._dragState.type === 'move') {
      const dx = w.x - this._dragState.lastX;
      const dy = w.y - this._dragState.lastY;
      this._dragState.lastX = w.x; this._dragState.lastY = w.y;

      for (const id of this.selectedIds) {
        const comp = this.diagram.components.find(c => c.id === id);
        if (comp) {
          const def = getSymbolDef(comp.symbolId);
          const oldConns = def ? getConnectionPoints(def, comp.x, comp.y, comp.rotation) : [];
          const newX = this._snap(comp.x + dx);
          const newY = this._snap(comp.y + dy);
          const actualDx = newX - comp.x;
          const actualDy = newY - comp.y;
          comp.x = newX;
          comp.y = newY;
          if ((actualDx !== 0 || actualDy !== 0) && oldConns.length) {
            this._dragConnectedWireEndpoints(oldConns, actualDx, actualDy);
          }
          continue;
        }
        moveWire(this.diagram, id, dx, dy);
        const t = this.diagram.texts.find(x => x.id === id);
        if (t) { t.x += dx; t.y += dy; }
      }
      this._redraw();

    } else if (this._dragState.type === 'rotate') {
      const ds = this._dragState;
      const angle = Math.atan2(w.y - ds.cy, w.x - ds.cx) * 180 / Math.PI;
      const delta = angle - ds.startAngle;
      const comp = this.diagram.components.find(c => c.id === ds.id);
      if (comp) {
        // Shiftキーで15°スナップ
        let rot = (ds.origRotation + delta + 360) % 360;
        if (e.shiftKey) rot = Math.round(rot / 15) * 15;
        comp.rotation = rot;
        document.body.classList.add('rotating');
        this._redraw();
      }

    } else if (this._dragState.type === 'lasso') {
      this._lasso.x2 = w.x; this._lasso.y2 = w.y;
      const ids = this.renderer.hitTestBox(this.diagram, this._lasso.x1, this._lasso.y1, this._lasso.x2, this._lasso.y2);
      this.selectedIds = new Set(ids);
      this.renderer.setSelectionBox(this._lasso.x1, this._lasso.y1, this._lasso.x2, this._lasso.y2);
      this._redraw();
    }
  }

  _onMouseUp(e) {
    if (this._dragState) {
      if (this._dragState.type === 'lasso') {
        this.renderer.setSelectionBox(null);
      }
      if (this._dragState.type === 'rotate' || this._dragState.type === 'move') {
        this._saveHistory();
        this.onUpdate(this.diagram, 'transform');
      }
      document.body.classList.remove('rotating');
      this._dragState = null;
    }
  }

  _onDblClick(e) {
    if (this.mode === 'wire' && this.wirePoints.length >= 2) {
      this._commitWire();
      return;
    }
    if (this.mode === 'text') {
      const w = this._clientToWorld(e);
      this._showTextDialog(this._snap(w.x), this._snap(w.y));
    }
  }

  _onWheel(e) {
    e.preventDefault();
    const { scale, vx, vy } = this.renderer;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(scale * factor, 0.1), 10);
    const w = this._clientToWorld(e);
    const nx = w.x - (w.x - vx) * (newScale / scale);
    const ny = w.y - (w.y - vy) * (newScale / scale);
    this.renderer.setViewport(nx, ny, newScale);
    this._updateZoomLabel();
    this._redraw();
  }

  _onDrop(e) {
    e.preventDefault();
    const symbolId = e.dataTransfer.getData('text/plain');
    if (!symbolId) return;
    const w = this.renderer.clientToWorld(e.clientX, e.clientY);
    const comp = addComponent(this.diagram, symbolId, this._snap(w.x), this._snap(w.y));
    if (comp) {
      this.selectedIds.clear();
      this.selectedIds.add(comp.id);
      this._saveHistory();
      this.onUpdate(this.diagram, 'add-component');
      this._redraw();
    }
  }

  _onKeyDown(e) {
    // フォームにフォーカスがある場合は無視
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'z': e.preventDefault(); this.undo(); break;
        case 'y': e.preventDefault(); this.redo(); break;
        case 'a': e.preventDefault(); this.selectAll(); break;
        case 'c': e.preventDefault(); this.copy(); break;
        case 'v': e.preventDefault(); this.paste(); break;
        case 'd': e.preventDefault(); this.duplicate(); break;
      }
    } else {
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault(); this.deleteSelected(); break;
        case 'Escape':
          if (this.mode === 'wire') { this.wirePoints = []; this.wirePreview = null; this._redraw(); }
          else { this.selectedIds.clear(); this._redraw(); }
          break;
        case 'r':
        case 'R':
          this.rotateSelected(); break;
      }
    }
  }

  // --- 配線確定 ---
  _commitWire() {
    if (this.wirePoints.length < 2) { this.wirePoints = []; return; }
    // 直角配線に変換
    const pts = this._makeOrthogonal(this.wirePoints);
    addWire(this.diagram, pts);
    this.wirePoints = [];
    this.wirePreview = null;
    this._saveHistory();
    this.onUpdate(this.diagram, 'add-wire');
    this._redraw();
  }

  _makeOrthogonal(pts) {
    if (pts.length < 2) return pts;
    const result = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const prev = result[result.length - 1];
      const cur = pts[i];
      // 水平→垂直の折れ線
      if (Math.abs(cur.x - prev.x) > 0.5) {
        result.push({ x: cur.x, y: prev.y });
      }
      result.push(cur);
    }
    return result;
  }

  // --- 右クリックで配線キャンセル ---
  cancelWire() {
    this.wirePoints = [];
    this.wirePreview = null;
    this._redraw();
  }

  // --- 操作 ---
  deleteSelected() {
    if (this.selectedIds.size === 0) return;
    removeElements(this.diagram, [...this.selectedIds]);
    this.selectedIds.clear();
    this._saveHistory();
    this.onUpdate(this.diagram, 'delete');
    this._redraw();
  }

  selectAll() {
    this.selectedIds = new Set([
      ...this.diagram.components.map(c => c.id),
      ...this.diagram.wires.map(w => w.id),
      ...this.diagram.texts.map(t => t.id),
    ]);
    this._redraw();
  }

  rotateSelected() {
    if (this.mode !== 'select') return;
    for (const id of this.selectedIds) {
      rotateComponent(this.diagram, id);
    }
    this._saveHistory();
    this.onUpdate(this.diagram, 'rotate');
    this._redraw();
  }

  copy() {
    this._clipboard = [];
    for (const id of this.selectedIds) {
      const el = getById(this.diagram, id);
      if (el) this._clipboard.push(JSON.parse(JSON.stringify(el)));
    }
  }

  paste() {
    if (this._clipboard.length === 0) return;
    this.selectedIds.clear();
    const OFFSET = 20;
    const newItems = [];
    for (const item of this._clipboard) {
      // 部品
      const comp = this.diagram.components.find(c => c === item);
      const isComp = item.symbolId !== undefined;
      const isText = item.text !== undefined && item.symbolId === undefined;
      const isWire = item.points !== undefined;

      let { id: _id, ...rest } = item;
      const newId = Date.now() + Math.random();

      if (isComp) {
        const newComp = { ...JSON.parse(JSON.stringify(rest)), id: newId, x: rest.x + OFFSET, y: rest.y + OFFSET };
        this.diagram.components.push(newComp);
        this.selectedIds.add(newId);
        newItems.push(newComp);
      } else if (isWire) {
        const newWire = { ...JSON.parse(JSON.stringify(rest)), id: newId, points: rest.points.map(p => ({ x: p.x + OFFSET, y: p.y + OFFSET })) };
        this.diagram.wires.push(newWire);
        this.selectedIds.add(newId);
        newItems.push(newWire);
      } else if (isText) {
        const newText = { ...JSON.parse(JSON.stringify(rest)), id: newId, x: rest.x + OFFSET, y: rest.y + OFFSET };
        this.diagram.texts.push(newText);
        this.selectedIds.add(newId);
        newItems.push(newText);
      }
    }
    if (newItems.length) {
      this._saveHistory();
      this.onUpdate(this.diagram, 'paste');
      this._redraw();
    }
  }

  duplicate() {
    this.copy();
    this.paste();
  }

  undo() {
    const snap = this.history.undo();
    if (snap) { Object.assign(this.diagram, JSON.parse(snap)); this.selectedIds.clear(); this.onUpdate(this.diagram, 'undo'); this._redraw(); }
  }

  redo() {
    const snap = this.history.redo();
    if (snap) { Object.assign(this.diagram, JSON.parse(snap)); this.selectedIds.clear(); this.onUpdate(this.diagram, 'redo'); this._redraw(); }
  }

  _saveHistory() {
    this.history.push(JSON.stringify(this.diagram));
  }

  // 接続点座標と一致するワイヤー端点を移動
  _dragConnectedWireEndpoints(oldConns, dx, dy) {
    const TOL = 3;
    for (const wire of this.diagram.wires) {
      if (this.selectedIds.has(wire.id)) continue;
      for (const pt of wire.points) {
        for (const cp of oldConns) {
          if (Math.abs(pt.x - cp.x) <= TOL && Math.abs(pt.y - cp.y) <= TOL) {
            pt.x += dx;
            pt.y += dy;
            break;
          }
        }
      }
    }
  }

  // 回転ハンドルのヒットテスト（DOM要素から直接検索）
  _hitTestRotationHandle(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (el && el.classList.contains('rotation-handle')) {
      const id = Number(el.getAttribute('data-id'));
      return isNaN(id) ? null : id;
    }
    return null;
  }

  // --- テキスト追加 ---
  _showTextDialog(x, y) {
    const dialog = document.getElementById('text-dialog');
    const input = document.getElementById('text-input');
    input.value = '';
    dialog.showModal();
    input.focus();
    const handler = () => {
      const txt = input.value.trim();
      if (txt) {
        const t = addText(this.diagram, x, y, txt);
        this.selectedIds.clear();
        this.selectedIds.add(t.id);
        this._saveHistory();
        this.onUpdate(this.diagram, 'add-text');
        this._redraw();
      }
      dialog.removeEventListener('close', handler);
    };
    dialog.addEventListener('close', handler, { once: true });
    document.getElementById('text-cancel').onclick = () => dialog.close();
  }

  // --- 描画 ---
  _redraw() {
    this.renderer.render(
      this.diagram,
      this.selectedIds,
      this.mode,
      this.wirePreview,
      this.hoveredConnPoint
    );
    this._updateStatusSelection();
  }

  _updateStatusSelection() {
    const count = this.selectedIds.size;
    document.getElementById('status-selection').textContent =
      count ? `選択: ${count}個` : '選択: なし';
  }

  _updateZoomLabel() {
    document.getElementById('zoom-label').textContent =
      Math.round(this.renderer.scale * 100) + '%';
  }
}
