// アプリケーションエントリポイント
import { createEmptyDiagram, deserialize, serialize } from './diagram.js';
import { Renderer } from './renderer.js';
import { Editor } from './editor.js';
import { Palette } from './palette.js';
import { PropertiesPanel } from './properties.js';
import { History } from './history.js';
import { saveToLocalStorage, loadFromLocalStorage, getLocalStorageMeta, saveToFile, loadFromFile } from './storage.js';
import { exportSVG, exportPNG } from './export.js';

// --- 状態 ---
let diagram = loadFromLocalStorage() || createEmptyDiagram();
const history = new History();
let filename = getLocalStorageMeta()?.filename || '無題';
let dirty = false;

// --- DOM ---
const svgEl = document.getElementById('diagram-svg');
const paletteGroupsEl = document.getElementById('palette-groups');
const propsContentEl = document.getElementById('properties-content');
const statusFilenameEl = document.getElementById('status-filename');
const statusModeEl = document.getElementById('status-mode');
const zoomLabel = document.getElementById('zoom-label');

// --- モジュール初期化 ---
const renderer = new Renderer(svgEl);
renderer.setSnap(true);

const editor = new Editor(svgEl, renderer, diagram, history, (diag, reason) => {
  dirty = true;
  autoSave();
  updateStatusFilename();
});

const palette = new Palette(paletteGroupsEl, id => {});

const props = new PropertiesPanel(propsContentEl, (element) => {
  dirty = true;
  autoSave();
  fullRedraw();
});

// 初期ヒストリー
history.push(serialize(diagram));

// 初期描画
renderer.setViewport(0, 0, 1);
fullRedraw();
updateStatusFilename();

// --- 自動保存 ---
let autoSaveTimer = null;
function autoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveToLocalStorage(diagram, filename);
  }, 1000);
}

// --- 描画更新 ---
function fullRedraw() {
  renderer.render(diagram, editor.selectedIds, editor.mode, editor.wirePreview, editor.hoveredConnPoint);
  updatePropertiesPanel();
}

// --- プロパティパネル更新 ---
function updatePropertiesPanel() {
  if (editor.selectedIds.size === 1) {
    const id = [...editor.selectedIds][0];
    const comp = diagram.components.find(c => c.id === id);
    const wire = diagram.wires.find(w => w.id === id);
    const text = diagram.texts.find(t => t.id === id);
    if (comp) props.show(comp, 'component');
    else if (wire) props.show(wire, 'wire');
    else if (text) props.show(text, 'text');
    else props.clear();
  } else {
    props.clear();
  }
}

// --- ステータスバー更新 ---
function updateStatusFilename() {
  statusFilenameEl.textContent = (dirty ? '* ' : '') + filename;
}

// --- モード変更 ---
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    editor.setMode(mode);
    const modeLabel = { select: '選択', wire: '配線', text: 'テキスト' };
    statusModeEl.textContent = 'モード: ' + (modeLabel[mode] || mode);
  });
});

// 配線確定：右クリックでもキャンセル
svgEl.addEventListener('contextmenu', e => {
  e.preventDefault();
  if (editor.mode === 'wire') editor.cancelWire();
});

// 選択変更でプロパティ更新
const origOnUpdate = editor.onUpdate;
editor.onUpdate = (diag, reason) => {
  origOnUpdate(diag, reason);
  updatePropertiesPanel();
  fullRedraw();
};

// --- グリッド設定 ---
document.getElementById('grid-size').addEventListener('change', e => {
  renderer.setGridSize(Number(e.target.value));
  fullRedraw();
});
document.getElementById('grid-snap').addEventListener('change', e => {
  renderer.setSnap(e.target.checked);
});

// --- ズーム ---
document.getElementById('btn-zoom-in').onclick = () => zoom(1.2);
document.getElementById('btn-zoom-out').onclick = () => zoom(0.8);
document.getElementById('btn-zoom-fit').onclick = () => { renderer.fitToContent(diagram); updateZoomLabel(); fullRedraw(); };

function zoom(factor) {
  const s = Math.min(Math.max(renderer.scale * factor, 0.1), 10);
  renderer.setViewport(renderer.vx, renderer.vy, s);
  updateZoomLabel();
  fullRedraw();
}
function updateZoomLabel() {
  zoomLabel.textContent = Math.round(renderer.scale * 100) + '%';
}

// パン（中ボタンまたはスペース+ドラッグ）
let panState = null;
let spaceHeld = false;
document.addEventListener('keydown', e => { if (e.code === 'Space') spaceHeld = true; });
document.addEventListener('keyup', e => { if (e.code === 'Space') spaceHeld = false; });
svgEl.addEventListener('mousedown', e => {
  if (e.button === 1 || (spaceHeld && e.button === 0)) {
    e.preventDefault();
    panState = { sx: e.clientX, sy: e.clientY, vx: renderer.vx, vy: renderer.vy };
  }
});
document.addEventListener('mousemove', e => {
  if (!panState) return;
  const dx = (e.clientX - panState.sx) / renderer.scale;
  const dy = (e.clientY - panState.sy) / renderer.scale;
  renderer.setViewport(panState.vx - dx, panState.vy - dy, renderer.scale);
  fullRedraw();
});
document.addEventListener('mouseup', e => { if (e.button === 1 || spaceHeld) panState = null; });

// --- ツールバーボタン ---
document.getElementById('btn-new').onclick = async () => {
  if (dirty && !await confirm('変更を破棄して新規作成しますか？')) return;
  diagram = createEmptyDiagram();
  editor.setDiagram(diagram);
  filename = '無題';
  dirty = false;
  history.push(serialize(diagram));
  updateStatusFilename();
  fullRedraw();
};

document.getElementById('btn-open').onclick = async () => {
  try {
    const result = await loadFromFile();
    if (!result) return;
    diagram = result.diagram;
    filename = result.filename;
    editor.setDiagram(diagram);
    dirty = false;
    history.push(serialize(diagram));
    updateStatusFilename();
    fullRedraw();
  } catch (e) {
    alert(e.message);
  }
};

document.getElementById('btn-save').onclick = () => {
  saveToLocalStorage(diagram, filename);
  dirty = false;
  updateStatusFilename();
};

document.getElementById('btn-saveas').onclick = () => {
  const name = prompt('ファイル名を入力してください', filename.replace(/\.(cub|json)$/, '') + '.cub');
  if (!name) return;
  filename = name;
  saveToFile(diagram, filename);
  dirty = false;
  updateStatusFilename();
};

document.getElementById('btn-export-svg').onclick = () => {
  exportSVG(svgEl, filename.replace(/\.(cub|json)$/, '') + '.svg');
};

document.getElementById('btn-export-png').onclick = () => {
  exportPNG(svgEl, filename.replace(/\.(cub|json)$/, '') + '.png');
};

document.getElementById('btn-undo').onclick = () => editor.undo();
document.getElementById('btn-redo').onclick = () => editor.redo();
document.getElementById('btn-delete').onclick = () => editor.deleteSelected();
document.getElementById('btn-select-all').onclick = () => editor.selectAll();

// PDF印刷ボタン（ツールバーに動的追加）
const printBtn = document.createElement('button');
printBtn.id = 'btn-print';
printBtn.title = 'PDF印刷';
printBtn.textContent = '印刷/PDF';
document.getElementById('toolbar').appendChild(printBtn);
printBtn.onclick = () => window.print();

// シンボルカタログボタン
const catalogBtn = document.createElement('button');
catalogBtn.textContent = '記号一覧';
catalogBtn.title = 'JIS C 0617 記号カタログを開く';
catalogBtn.onclick = () => window.open('symbols-catalog.html', '_blank');
document.getElementById('toolbar').appendChild(catalogBtn);

// --- 検索 ---
document.getElementById('palette-search-input').addEventListener('input', e => {
  palette.filter(e.target.value);
});

// --- ウィンドウリサイズ ---
window.addEventListener('resize', () => { renderer._updateGrid(); });

// --- beforeunload ---
window.addEventListener('beforeunload', e => {
  if (dirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});
