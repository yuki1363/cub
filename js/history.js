// Undo/Redo スタック（スナップショット方式）

export class History {
  constructor(maxSize = 100) {
    this._stack = [];
    this._index = -1;
    this._maxSize = maxSize;
  }

  push(snapshot) {
    // 現在位置より後を破棄
    this._stack = this._stack.slice(0, this._index + 1);
    this._stack.push(snapshot);
    if (this._stack.length > this._maxSize) this._stack.shift();
    this._index = this._stack.length - 1;
  }

  undo() {
    if (this._index <= 0) return null;
    this._index--;
    return this._stack[this._index];
  }

  redo() {
    if (this._index >= this._stack.length - 1) return null;
    this._index++;
    return this._stack[this._index];
  }

  canUndo() { return this._index > 0; }
  canRedo() { return this._index < this._stack.length - 1; }
}
