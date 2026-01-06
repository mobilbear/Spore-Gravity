/**
 * Simple keyboard tracker for movement (WASD / arrows) and menu toggle.
 */
export class Input {
  constructor() {
    this.keys = new Set();
    this.listeners = [];
    window.addEventListener('keydown', (e) => this.handleKey(e, true));
    window.addEventListener('keyup', (e) => this.handleKey(e, false));
  }

  handleKey(event, isDown) {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
      isDown ? this.keys.add(key) : this.keys.delete(key);
    }
    if (key === 'e' && isDown) {
      this.listeners.forEach((cb) => cb('toggle-menu'));
    }
  }

  on(command, callback) {
    this.listeners.push((evt) => {
      if (evt === command) callback();
    });
  }

  isDown(key) {
    return this.keys.has(key);
  }
}
