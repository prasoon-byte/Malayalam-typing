// script.js

const keys = document.querySelectorAll('.key');
const lockLights = {
  CapsLock: document.getElementById('capsLock'),
  NumLock: document.getElementById('numLock'),
  ScrollLock: document.getElementById('scrollLock')
};

const revealedKeys = new Set();

// Prevent default actions like F1, Tab, etc.
window.addEventListener('keydown', (e) => {
  e.preventDefault();

  const code = e.code;
  const keyElement = document.querySelector(`.key[data-key="${code}"]`);

  if (keyElement) {
    if (!revealedKeys.has(code)) {
      keyElement.classList.add('revealed');
      revealedKeys.add(code);
    }
  }

  // Update lock lights
  if (code === 'CapsLock') toggleLockLight('CapsLock', e.getModifierState('CapsLock'));
  if (code === 'NumLock') toggleLockLight('NumLock', e.getModifierState('NumLock'));
  if (code === 'ScrollLock') toggleLockLight('ScrollLock', e.getModifierState('ScrollLock'));
});

// Handle lock state on load (helpful if caps lock already on)
window.addEventListener('load', () => {
  toggleLockLight('CapsLock', getLockState('CapsLock'));
  toggleLockLight('NumLock', getLockState('NumLock'));
  toggleLockLight('ScrollLock', getLockState('ScrollLock'));
});

function toggleLockLight(lock, isOn) {
  const el = lockLights[lock];
  if (el) {
    if (isOn) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }
}

// Attempt to check lock state using modifierState
function getLockState(lock) {
  const testEvent = new KeyboardEvent('keydown');
  return testEvent.getModifierState && testEvent.getModifierState(lock);
}