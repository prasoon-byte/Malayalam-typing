// ======= Layout with Caps and Small Variations for Row 1 and Row 2, Single Characters for Others =======
const layoutRows = [
  [ // Row 1: Vowels - Part 1 (Uppercase & Lowercase Variations)
    ['D', 'അ', '്'], ['E', 'ആ', 'ാ'], ['F', 'ഇ', 'ി'], ['R', 'ഈ', 'ീ'],
    ['G', 'ഉ', 'ു'], ['T', 'ഊ', 'ൂ'], ['+  =', 'ഋ', 'ൃ']  // Modified to map '+' to 'ഋ' and '=' to '+'
  ],
  [ // Row 2: Vowels - Part 2 (Uppercase & Lowercase Variations)
    ['Z', 'എ', 'െ'], ['S', 'ഏ', 'േ'], ['W', 'ഐ', 'ൈ'], ['` ~', 'ഒ', 'ൊ'],
    ['A', 'ഓ', 'ോ'], ['Q', 'ഔ', 'ൌ'], ['Dx', 'അം', 'ം'], ['D_', 'അഃ', 'ഃ']
  ],
  [ // k,K,i,I,U = ക, ഖ, ഗ, ഘ, ങ
    ['k', 'ക'], ['K', 'ഖ'], ['i', 'ഗ'], ['I', 'ഘ'], ['U', 'ങ']
  ],
  [ // ;:pP} = ച, ഛ, ജ, ഝ, ഞ
    [';', 'ച'], [':', 'ഛ'], ['p', 'ജ'], ['P', 'ഝ'], ['}', 'ഞ']
  ],
[ // Row 5: Consonants - Part 3
  ["'", 'ട'], ['"', 'ഠ'], ['[', 'ഡ'], ['{', 'ഢ'], ['C', 'ണ']
],

  [ // Row 6: Consonants - Part 4 (One Malayalam Character per Key)
    ['l', 'ത'], ['L', 'ഥ'], ['o', 'ദ'], ['O', 'ധ'], ['V', 'ന']
  ],
  [ // Row 7: Consonants - Part 5 (One Malayalam Character per Key)
    ['h', 'പ'], ['H', 'ഫ'], ['y', 'ബ'], ['Y', 'ഭ'], ['c', 'മ']
  ],
  [ // Row 8: Others (One Malayalam Character per Key)
    ['/', 'യ'], ['j', 'ര'], ['n', 'ല'], ['b', 'വ'],
    ['M', 'ശ'], ['<', 'ഷ'], ['m', 'സ'], ['u', 'ഹ'],
    ['N', 'ള'], ['B', 'ഴ'], ['J', 'റ']
  ]
];

// ======= Create Key Map for Typing (Handling Both Caps and Small for Row 1 and Row 2) =======
const keyMap = {};

// For Row 1 and Row 2, map both uppercase and lowercase letters to their Malayalam equivalents
layoutRows.slice(0, 2).flat().forEach(([latin, independent, dependent]) => {
  // Still create key display based on full key (e.g., Sx), but typing maps to just 'x' or '_'
  keyMap[latin] = independent;
  keyMap[latin.toLowerCase()] = dependent;

  // Custom overrides for specific characters
  if (latin === 'Dx') keyMap['x'] = 'ം';
  if (latin === 'D_') keyMap['_'] = 'ഃ';
});

// Special handling for the '+' and '=' keys to map them correctly
keyMap['+'] = 'ഋ';   // '+' should input 'ഋ'
keyMap['='] = 'ൃ';   // '=' should input '+'
keyMap['`'] = 'ൊ';   // '+' should input 'ഋ'
keyMap['~'] = 'ഒ';   // '=' should input '+'


// For Row 3 onward, map only one Malayalam character to each Latin key (no uppercase/lowercase)
layoutRows.slice(2).flat().forEach(([latin, malayalam]) => {
  keyMap[latin] = malayalam;
});

// ======= Build Virtual Keyboard UI =======
const keyboardContainer = document.getElementById('virtual-keyboard');
layoutRows.forEach((row) => {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';

  row.forEach(([latin, independent, dependent]) => {
    const keyDiv = document.createElement('div');
    keyDiv.className = 'key';
    keyDiv.id = `key-${latin}`;
    if (independent && dependent) {
      keyDiv.innerHTML = `
        <strong>${independent}<br>${dependent}</strong>
        <br><small>${latin}</small>
      `;
    } else {
      keyDiv.innerHTML = `
        <strong>${independent || malayalam}</strong>
        <br><small>${latin}</small>
      `;
    }
    rowDiv.appendChild(keyDiv);
  });

  keyboardContainer.appendChild(rowDiv);
});

// ======= Typing Functionality =======
const typingBox = document.getElementById('typing-box');

// Define the Malayalam font family
const malayalamFont = "'Noto Sans Malayalam', sans-serif";
const defaultFont = "'Poppins', sans-serif";

// Function to check if the input contains Malayalam characters
function containsMalayalam(text) {
  // Unicode range for Malayalam characters
  const malayalamRegex = /[\u0D00-\u0D7F]/;
  return malayalamRegex.test(text);
}

// Add event listener for typing
document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Handle backspace
  if (key === 'Backspace') {
    e.preventDefault();
    typingBox.value = typingBox.value.slice(0, -1);
    return;
  }

  // Check mapped Malayalam character or the original Latin character
  const char = keyMap[key];
  if (char) {
    e.preventDefault();
    typingBox.value += char;

    // Change font to Malayalam if the typed text contains Malayalam characters
    if (containsMalayalam(typingBox.value)) {
      typingBox.style.fontFamily = malayalamFont;
    } else {
      typingBox.style.fontFamily = defaultFont;
    }

    const keyElem = document.getElementById(`key-${key.toUpperCase()}`);
    if (keyElem) {
      keyElem.classList.add('highlight');
      setTimeout(() => keyElem.classList.remove('highlight'), 200);
    }
  }
});
