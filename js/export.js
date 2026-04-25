// SVG / PNG エクスポート

export function exportSVG(svgEl, filename = '結線図.svg') {
  const clone = svgEl.cloneNode(true);
  // オーバーレイ（選択枠など）を除去
  clone.querySelectorAll('.selected-overlay, .handle, .connection-point, .selection-box').forEach(e => e.remove());
  // スタイルをインライン化（基本色のみ）
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    .component-symbol { stroke: #1a1a2e; stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .component-symbol .filled { fill: #1a1a2e; }
    .component-label { font-size: 11px; fill: #1a1a2e; font-family: sans-serif; }
    .wire-line { stroke: #1a1a2e; stroke-width: 1.5; fill: none; stroke-linecap: round; }
    .junction-dot { fill: #1a1a2e; }
    .text-label { font-size: 12px; fill: #1a1a2e; font-family: sans-serif; }
    .wire-label { font-size: 10px; fill: #444; font-family: sans-serif; }
  `;
  clone.insertBefore(style, clone.firstChild);
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  _download(URL.createObjectURL(blob), filename);
}

export function exportPNG(svgEl, filename = '結線図.png', scale = 2) {
  const clone = svgEl.cloneNode(true);
  clone.querySelectorAll('.selected-overlay, .handle, .connection-point, .selection-box').forEach(e => e.remove());
  const w = svgEl.clientWidth;
  const h = svgEl.clientHeight;
  clone.setAttribute('width', w); clone.setAttribute('height', h);
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    .component-symbol { stroke: #1a1a2e; stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .component-symbol .filled { fill: #1a1a2e; }
    .component-label { font-size: 11px; fill: #1a1a2e; font-family: sans-serif; }
    .wire-line { stroke: #1a1a2e; stroke-width: 1.5; fill: none; stroke-linecap: round; }
    .junction-dot { fill: #1a1a2e; }
    .text-label { font-size: 12px; fill: #1a1a2e; font-family: sans-serif; }
    .wire-label { font-size: 10px; fill: #444; font-family: sans-serif; }
    body, svg { background: white; }
  `;
  clone.insertBefore(style, clone.firstChild);
  // 白背景
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%'); bg.setAttribute('fill', 'white');
  clone.insertBefore(bg, clone.firstChild.nextSibling);

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = w * scale; canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(blob => _download(URL.createObjectURL(blob), filename), 'image/png');
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
}

function _download(url, filename) {
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
