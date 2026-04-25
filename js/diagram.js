// 図面データモデルと操作
import { getSymbolDef } from './symbols.js';

let _nextId = 1;
function nextId() { return _nextId++; }

/**
 * 空の図面データを生成
 */
export function createEmptyDiagram() {
  return {
    version: 1,
    components: [],  // { id, symbolId, x, y, rotation, label, properties }
    wires: [],       // { id, points: [{x,y},...], label }
    texts: [],       // { id, x, y, text, fontSize }
    viewport: { x: 0, y: 0, scale: 1 },
  };
}

export function addComponent(diagram, symbolId, x, y) {
  const def = getSymbolDef(symbolId);
  if (!def) return null;
  const comp = {
    id: nextId(),
    symbolId,
    x, y,
    rotation: 0,
    label: def.label,
    properties: {},
  };
  diagram.components.push(comp);
  return comp;
}

export function addWire(diagram, points) {
  const wire = { id: nextId(), points: points.map(p => ({ ...p })), label: '' };
  diagram.wires.push(wire);
  return wire;
}

export function addText(diagram, x, y, text, fontSize = 12) {
  const t = { id: nextId(), x, y, text, fontSize };
  diagram.texts.push(t);
  return t;
}

export function removeElements(diagram, ids) {
  const set = new Set(ids);
  diagram.components = diagram.components.filter(c => !set.has(c.id));
  diagram.wires = diagram.wires.filter(w => !set.has(w.id));
  diagram.texts = diagram.texts.filter(t => !set.has(t.id));
}

export function getById(diagram, id) {
  return (
    diagram.components.find(c => c.id === id) ||
    diagram.wires.find(w => w.id === id) ||
    diagram.texts.find(t => t.id === id) ||
    null
  );
}

export function moveComponents(diagram, ids, dx, dy) {
  for (const id of ids) {
    const c = diagram.components.find(x => x.id === id);
    if (c) { c.x += dx; c.y += dy; continue; }
    const t = diagram.texts.find(x => x.id === id);
    if (t) { t.x += dx; t.y += dy; }
  }
}

export function moveWire(diagram, id, dx, dy) {
  const w = diagram.wires.find(x => x.id === id);
  if (w) w.points.forEach(p => { p.x += dx; p.y += dy; });
}

export function rotateComponent(diagram, id, delta = 90) {
  const c = diagram.components.find(x => x.id === id);
  if (c) c.rotation = (c.rotation + delta + 360) % 360;
}

// シリアライズ/デシリアライズ
export function serialize(diagram) {
  return JSON.stringify(diagram, null, 2);
}

export function deserialize(json) {
  const data = JSON.parse(json);
  // _nextId を更新
  const allIds = [
    ...data.components.map(c => c.id),
    ...data.wires.map(w => w.id),
    ...data.texts.map(t => t.id),
  ];
  if (allIds.length) _nextId = Math.max(...allIds) + 1;
  return data;
}
