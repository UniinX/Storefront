import '@testing-library/jest-dom';

// Mock IntersectionObserver — not available in jsdom
global.IntersectionObserver = class {
  constructor(cb) { this._cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock localStorage — not available in some jsdom/node setups
const _store = {};
global.localStorage = {
  getItem: (k) => _store[k] ?? null,
  setItem: (k, v) => { _store[k] = String(v); },
  removeItem: (k) => { delete _store[k]; },
  clear: () => { Object.keys(_store).forEach((k) => delete _store[k]); },
};
