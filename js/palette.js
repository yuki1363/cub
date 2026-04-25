// 部品パレットUI
import { SYMBOL_GROUPS, renderSymbol } from './symbols.js';

export class Palette {
  constructor(containerEl, onDragStart) {
    this.container = containerEl;
    this.onDragStart = onDragStart;
    this._items = [];
    this._build();
  }

  _build() {
    this.container.innerHTML = '';
    this._items = [];
    for (const group of SYMBOL_GROUPS) {
      const header = document.createElement('div');
      header.className = 'palette-group-header';
      header.innerHTML = `<span class="arrow">▼</span> ${group.label}`;

      const body = document.createElement('div');
      body.className = 'palette-group-items';

      header.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        body.classList.toggle('hidden');
      });

      for (const item of group.items) {
        const row = document.createElement('div');
        row.className = 'palette-item';
        row.draggable = true;
        row.dataset.symbolId = item.id;

        // プレビューSVG
        const previewSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        previewSvg.setAttribute('viewBox', `${item.bbox.minX - 4} ${item.bbox.minY - 4} ${item.bbox.maxX - item.bbox.minX + 8} ${item.bbox.maxY - item.bbox.minY + 8}`);
        const sym = renderSymbol(item.id);
        if (sym) previewSvg.appendChild(sym);

        const label = document.createElement('span');
        label.textContent = item.label;

        row.appendChild(previewSvg);
        row.appendChild(label);

        row.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', item.id);
          e.dataTransfer.effectAllowed = 'copy';
          this.onDragStart(item.id);
        });

        body.appendChild(row);
        this._items.push({ el: row, label: item.label.toLowerCase(), id: item.id });
      }

      this.container.appendChild(header);
      this.container.appendChild(body);
    }
  }

  filter(query) {
    const q = query.toLowerCase().trim();
    for (const item of this._items) {
      const match = !q || item.label.includes(q) || item.id.includes(q);
      item.el.style.display = match ? '' : 'none';
    }
  }
}
