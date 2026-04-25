// ローカルストレージ保存・ファイル入出力
import { serialize, deserialize } from './diagram.js';

const LS_KEY = 'cub-diagram';
const LS_META_KEY = 'cub-meta';

export function saveToLocalStorage(diagram, filename) {
  localStorage.setItem(LS_KEY, serialize(diagram));
  localStorage.setItem(LS_META_KEY, JSON.stringify({ filename, savedAt: Date.now() }));
}

export function loadFromLocalStorage() {
  const data = localStorage.getItem(LS_KEY);
  if (!data) return null;
  try { return deserialize(data); } catch { return null; }
}

export function getLocalStorageMeta() {
  const m = localStorage.getItem(LS_META_KEY);
  if (!m) return null;
  try { return JSON.parse(m); } catch { return null; }
}

export function clearLocalStorage() {
  localStorage.removeItem(LS_KEY);
  localStorage.removeItem(LS_META_KEY);
}

export function saveToFile(diagram, filename = '図面.cub') {
  const blob = new Blob([serialize(diagram)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function loadFromFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cub,.json';
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return resolve(null);
      try {
        const text = await file.text();
        resolve({ diagram: deserialize(text), filename: file.name });
      } catch (e) {
        reject(new Error('ファイルの読み込みに失敗しました: ' + e.message));
      }
    };
    input.click();
  });
}
