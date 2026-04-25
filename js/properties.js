// プロパティパネル
// カスタムプロパティ（型番・仕様など）の追加・削除に対応

export class PropertiesPanel {
  constructor(containerEl, onChange) {
    this.container = containerEl;
    this.onChange = onChange;
    this._current = null; // { type: 'component'|'wire'|'text', element }
  }

  show(element, type) {
    this._current = { element, type };
    this._render();
  }

  clear() {
    this._current = null;
    this.container.innerHTML = '<p class="no-selection">部品を選択してください</p>';
  }

  _render() {
    const { element, type } = this._current;
    this.container.innerHTML = '';

    if (type === 'component') {
      this._addRow('ラベル', 'label', element.label || '');

      // 回転（数値入力＋プリセットボタン）
      const rotRow = document.createElement('div');
      rotRow.className = 'prop-row';
      const rotLabel = document.createElement('label');
      rotLabel.textContent = '回転 (°)';

      const rotWrap = document.createElement('div');
      rotWrap.style.cssText = 'display:flex;gap:4px;align-items:center;';

      const rotInput = document.createElement('input');
      rotInput.type = 'number'; rotInput.min = 0; rotInput.max = 359; rotInput.step = 1;
      rotInput.value = Math.round(element.rotation || 0);
      rotInput.style.cssText = 'width:60px;border:1px solid #d0d5dd;border-radius:4px;padding:3px 5px;font-size:12px;';
      rotInput.oninput = () => {
        element.rotation = ((Number(rotInput.value) % 360) + 360) % 360;
        this.onChange(element);
      };

      const presets = [0, 90, 180, 270];
      const presetWrap = document.createElement('div');
      presetWrap.style.cssText = 'display:flex;gap:2px;';
      for (const deg of presets) {
        const btn = document.createElement('button');
        btn.textContent = deg + '°';
        btn.style.cssText = 'font-size:10px;padding:2px 5px;border:1px solid #d0d5dd;border-radius:3px;cursor:pointer;background:#fff;';
        btn.onclick = () => {
          element.rotation = deg;
          rotInput.value = deg;
          this.onChange(element);
        };
        presetWrap.appendChild(btn);
      }

      rotWrap.appendChild(rotInput);
      rotWrap.appendChild(presetWrap);
      rotRow.appendChild(rotLabel);
      rotRow.appendChild(rotWrap);
      this.container.appendChild(rotRow);

      // カスタムプロパティ
      const customSection = document.createElement('div');
      customSection.style.marginTop = '10px';
      const customTitle = document.createElement('div');
      customTitle.style.cssText = 'font-weight:600;font-size:11px;color:#6b7280;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;';
      customTitle.innerHTML = '<span>カスタムプロパティ</span>';
      const addBtn = document.createElement('button');
      addBtn.textContent = '＋追加';
      addBtn.style.cssText = 'font-size:11px;padding:1px 6px;border:1px solid #d0d5dd;border-radius:3px;cursor:pointer;background:#fff;';
      addBtn.onclick = () => {
        if (!element.properties) element.properties = {};
        const key = '項目' + (Object.keys(element.properties).length + 1);
        element.properties[key] = '';
        this._render();
        this.onChange(element);
      };
      customTitle.appendChild(addBtn);
      customSection.appendChild(customTitle);

      const props = element.properties || {};
      for (const [key, value] of Object.entries(props)) {
        const row = document.createElement('div');
        row.className = 'prop-row';
        row.style.display = 'flex'; row.style.gap = '4px'; row.style.alignItems = 'center';

        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.value = key;
        keyInput.style.cssText = 'flex:0 0 80px;min-width:0;border:1px solid #d0d5dd;border-radius:4px;padding:3px 5px;font-size:11px;';
        keyInput.placeholder = '項目名';

        const valInput = document.createElement('input');
        valInput.type = 'text';
        valInput.value = value;
        valInput.style.cssText = 'flex:1;min-width:0;border:1px solid #d0d5dd;border-radius:4px;padding:3px 5px;font-size:11px;';
        valInput.placeholder = '値';

        const delBtn = document.createElement('button');
        delBtn.textContent = '✕';
        delBtn.title = '削除';
        delBtn.style.cssText = 'flex-shrink:0;font-size:11px;padding:2px 5px;border:1px solid #fca5a5;border-radius:3px;cursor:pointer;background:#fff;color:#ef4444;';
        delBtn.onclick = () => {
          delete element.properties[key];
          this._render();
          this.onChange(element);
        };

        keyInput.onblur = () => {
          const newKey = keyInput.value.trim();
          if (newKey && newKey !== key) {
            const val = element.properties[key];
            delete element.properties[key];
            element.properties[newKey] = val;
            this._render();
            this.onChange(element);
          }
        };
        valInput.oninput = () => {
          element.properties[key] = valInput.value;
          this.onChange(element);
        };

        row.appendChild(keyInput); row.appendChild(valInput); row.appendChild(delBtn);
        customSection.appendChild(row);
      }
      this.container.appendChild(customSection);

    } else if (type === 'wire') {
      this._addRow('ラベル', 'label', element.label || '');

    } else if (type === 'text') {
      this._addRow('テキスト', 'text', element.text || '');
      this._addRow('フォントサイズ', 'fontSize', element.fontSize || 12, 'number');
    }
  }

  _addRow(label, key, value, inputType = 'text') {
    const { element } = this._current;
    const row = document.createElement('div');
    row.className = 'prop-row';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    const input = document.createElement('input');
    input.type = inputType;
    input.value = value;
    input.oninput = () => {
      element[key] = inputType === 'number' ? Number(input.value) : input.value;
      this.onChange(element);
    };
    row.appendChild(lbl); row.appendChild(input);
    this.container.appendChild(row);
  }
}
