// Playfair cipher functionality
document.addEventListener('DOMContentLoaded', function() {
  // Only proceed if we're on the dashboard page
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  const playfairText = document.getElementById('playfair-text');
  const playfairKeyword = document.getElementById('playfair-keyword');
  const playfairEncryptBtn = document.getElementById('playfair-encrypt');
  const playfairDecryptBtn = document.getElementById('playfair-decrypt');
  const playfairClearBtn = document.getElementById('playfair-clear');
  const playfairShowGridBtn = document.getElementById('playfair-show-grid');
  const playfairCopyBtn = document.getElementById('playfair-copy');
  const playfairResult = document.getElementById('playfair-result');
  const playfairGridContainer = document.getElementById('playfair-grid-container');
  const playfairGrid = document.getElementById('playfair-grid');
  const playfairEmojiToggle = document.getElementById('playfair-emoji-toggle');
  
  if (!playfairEncryptBtn) return; // Exit if elements don't exist
  
  // Playfair encryption
  playfairEncryptBtn.addEventListener('click', function() {
    // Validate input
    if (!validatePlayfairInput()) {
      return;
    }
    
    const text = playfairText.value;
    const keyword = playfairKeyword.value;
    const useEmoji = playfairEmojiToggle && playfairEmojiToggle.checked;
    
    // Encrypt the text
    const encrypted = useEmoji ? emojiPlayfairEncrypt(text, keyword) : playfairEncrypt(text, keyword);
    
    // Display the result
    playfairResult.textContent = encrypted;
    
    // Show the grid
    showPlayfairGrid();
    
    // Show success message
    showToast('Text encrypted successfully!');
  });
  
  // Playfair decryption
  playfairDecryptBtn.addEventListener('click', function() {
    // Validate input
    if (!validatePlayfairInput()) {
      return;
    }
    
    const text = playfairText.value;
    const keyword = playfairKeyword.value;
    const useEmoji = playfairEmojiToggle && playfairEmojiToggle.checked;
    
    // Decrypt the text
    const decrypted = useEmoji ? emojiPlayfairDecrypt(text, keyword) : playfairDecrypt(text, keyword);
    
    // Display the result
    playfairResult.textContent = decrypted;
    
    // Show the grid
    showPlayfairGrid();
    
    // Show success message
    showToast('Text decrypted successfully!');
  });
  
  // Show Playfair grid
  playfairShowGridBtn.addEventListener('click', function() {
    // Validate keyword input
    if (!validateKeyword(playfairKeyword.value)) {
      document.getElementById('playfair-keyword-error').style.display = 'block';
      return;
    } else {
      document.getElementById('playfair-keyword-error').style.display = 'none';
    }
    
    // Show the grid
    showPlayfairGrid();
    
    // Show success message
    showToast('Playfair grid generated!');
  });
  
  // Clear all fields
  playfairClearBtn.addEventListener('click', function() {
    playfairText.value = '';
    playfairKeyword.value = 'CIPHER';
    playfairResult.textContent = '';
    if (playfairEmojiToggle) playfairEmojiToggle.checked = false;
    playfairGridContainer.style.display = 'none';
    document.getElementById('playfair-text-error').style.display = 'none';
    document.getElementById('playfair-keyword-error').style.display = 'none';
    
    // Show clear message
    showToast('Fields cleared!');
  });
  
  // Copy result
  playfairCopyBtn.addEventListener('click', function() {
    const result = playfairResult.textContent;
    if (result) {
      copyToClipboard(result);
      showToast('Result copied to clipboard!');
    }
  });
  
  // Show Playfair grid
  function showPlayfairGrid() {
    const keyword = playfairKeyword.value;
    const useEmoji = playfairEmojiToggle && playfairEmojiToggle.checked;
    
    // Generate the grid
    const grid = generatePlayfairGrid(keyword, useEmoji);
    
    // Render the grid
    playfairGrid.innerHTML = '';
    playfairGrid.appendChild(renderPlayfairGrid(grid, useEmoji));
    
    // Show the grid container
    playfairGridContainer.style.display = 'block';
  }
  
  // Validate Playfair cipher input
  function validatePlayfairInput() {
    let isValid = true;
    
    // Validate text input
    if (!playfairText.value.trim()) {
      document.getElementById('playfair-text-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('playfair-text-error').style.display = 'none';
    }
    
    // Validate keyword input
    if (!validateKeyword(playfairKeyword.value)) {
      document.getElementById('playfair-keyword-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('playfair-keyword-error').style.display = 'none';
    }
    
    return isValid;
  }
  
  // Validate keyword (must contain letters only)
  function validateKeyword(keyword) {
    return keyword.trim() !== '' && /^[a-zA-Z]+$/.test(keyword);
  }
});

// Generate Playfair cipher key grid
function generatePlayfairGrid(keyword, useEmoji = false) {
  // Convert keyword to uppercase and remove non-letter characters
  keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Replace J with I throughout
  keyword = keyword.replace(/J/g, 'I');
  
  // Create alphabet string (I/J are merged)
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
  
  // Start with the keyword, removing duplicates
  let keyString = '';
  for (const char of keyword) {
    if (!keyString.includes(char)) {
      keyString += char;
    }
  }
  
  // Add remaining alphabet letters (excluding duplicates)
  for (const char of alphabet) {
    if (!keyString.includes(char)) {
      keyString += char;
    }
  }
  
  // Create 5x5 grid
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid[i] = [];
    for (let j = 0; j < 5; j++) {
      grid[i][j] = keyString.charAt(i * 5 + j);
    }
  }
  
  return grid;
}

// Find position of a character in the grid
function findPosition(grid, char) {
  // Replace J with I
  if (char === 'J') char = 'I';
  
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (grid[row][col] === char) {
        return { row, col };
      }
    }
  }
  
  return null; // Should not happen if input is properly filtered
}

// Playfair encryption
function playfairEncrypt(text, keyword) {
  // Handle empty input
  if (text.length === 0) return '';
  
  // Generate the grid
  const grid = generatePlayfairGrid(keyword);
  
  // Prepare the text: remove non-alphabetic characters, convert to uppercase
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Replace J with I
  text = text.replace(/J/g, 'I');
  
  // Split text into digraphs (pairs of letters)
  const digraphs = [];
  let i = 0;
  
  while (i < text.length) {
    if (i + 1 >= text.length) {
      // Add an X if at the last character
      digraphs.push(text[i] + 'X');
      break;
    } else if (text[i] === text[i + 1]) {
      // Insert X between duplicates
      digraphs.push(text[i] + 'X');
      i++;
    } else {
      // Add the pair
      digraphs.push(text[i] + text[i + 1]);
      i += 2;
    }
  }
  
  // Encrypt each digraph
  const encryptedDigraphs = digraphs.map(digraph => {
    const char1 = digraph[0];
    const char2 = digraph[1];
    
    // Find positions
    const pos1 = findPosition(grid, char1);
    const pos2 = findPosition(grid, char2);
    
    let newChar1, newChar2;
    
    // Same row
    if (pos1.row === pos2.row) {
      newChar1 = grid[pos1.row][(pos1.col + 1) % 5];
      newChar2 = grid[pos2.row][(pos2.col + 1) % 5];
    }
    // Same column
    else if (pos1.col === pos2.col) {
      newChar1 = grid[(pos1.row + 1) % 5][pos1.col];
      newChar2 = grid[(pos2.row + 1) % 5][pos2.col];
    }
    // Rectangle
    else {
      newChar1 = grid[pos1.row][pos2.col];
      newChar2 = grid[pos2.row][pos1.col];
    }
    
    return newChar1 + newChar2;
  });
  
  return encryptedDigraphs.join('');
}

// Playfair decryption
function playfairDecrypt(text, keyword) {
  // Handle empty input
  if (text.length === 0) return '';
  
  // Generate the grid
  const grid = generatePlayfairGrid(keyword);
  
  // Prepare the text: remove non-alphabetic chars, ensure uppercase
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Split into digraphs
  const digraphs = [];
  for (let i = 0; i < text.length; i += 2) {
    if (i + 1 < text.length) {
      digraphs.push(text[i] + text[i + 1]);
    } else {
      // If there's a single letter at the end (shouldn't happen in valid Playfair text)
      digraphs.push(text[i] + 'X');
    }
  }
  
  // Decrypt each digraph
  const decryptedDigraphs = digraphs.map(digraph => {
    const char1 = digraph[0];
    const char2 = digraph[1];
    
    // Find positions
    const pos1 = findPosition(grid, char1);
    const pos2 = findPosition(grid, char2);
    
    let newChar1, newChar2;
    
    // Same row
    if (pos1.row === pos2.row) {
      newChar1 = grid[pos1.row][(pos1.col + 4) % 5]; // (col - 1 + 5) % 5
      newChar2 = grid[pos2.row][(pos2.col + 4) % 5];
    }
    // Same column
    else if (pos1.col === pos2.col) {
      newChar1 = grid[(pos1.row + 4) % 5][pos1.col]; // (row - 1 + 5) % 5
      newChar2 = grid[(pos2.row + 4) % 5][pos2.col];
    }
    // Rectangle
    else {
      newChar1 = grid[pos1.row][pos2.col];
      newChar2 = grid[pos2.row][pos1.col];
    }
    
    return newChar1 + newChar2;
  });
  
  return decryptedDigraphs.join('');
}

// Emoji Playfair implementation
function emojiPlayfairEncrypt(text, keyword) {
  // First encrypt with regular Playfair
  const encrypted = playfairEncrypt(text, keyword);
  
  // Convert to emojis (simple mapping A->😀, B->😁, etc.)
  return encrypted.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      const emojiIndex = char.charCodeAt(0) - 65;
      const emojis = [
        '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
        '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', 
        '🤩', '🤔', '🤨', '😐', '😑', '😶'
      ];
      return emojis[emojiIndex];
    }
    return char;
  }).join('');
}

function emojiPlayfairDecrypt(text, keyword) {
  // First convert from emojis back to letters
  const emojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', 
    '🤩', '🤔', '🤨', '😐', '😑', '😶'
  ];
  
  let lettersText = '';
  for (let i = 0; i < text.length; i++) {
    const emoji = text.substring(i, i + 2); // Emojis can be 2 chars in JS strings
    const index = emojis.indexOf(emoji);
    
    if (index !== -1) {
      lettersText += String.fromCharCode(65 + index);
      // Skip the second char of the emoji in the next iteration
      if (emoji.length === 2) i++;
    } else {
      // Not an emoji from our set, keep as is
      lettersText += text[i];
    }
  }
  
  // Then decrypt with regular Playfair
  return playfairDecrypt(lettersText, keyword);
}

// Render the Playfair grid for display
function renderPlayfairGrid(grid, useEmoji = false) {
  const table = document.createElement('table');
  
  // Basic emoji set for grid display
  const emojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', 
    '🤩', '🤔', '🤨', '😐', '😑', '😶'
  ];
  
  for (let i = 0; i < 5; i++) {
    const row = document.createElement('tr');
    
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement('td');
      
      // If emoji mode is on, display emoji equivalent
      if (useEmoji) {
        const charCode = grid[i][j].charCodeAt(0) - 65;
        cell.textContent = emojis[charCode];
      } else {
        cell.textContent = grid[i][j];
      }
      
      row.appendChild(cell);
    }
    
    table.appendChild(row);
  }
  
  return table;
}

// Helper function for clipboard operations (used by multiple cipher modules)
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message) {
  // Create toast if it doesn't exist
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set message and show toast
  toast.textContent = message;
  toast.classList.add('show');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
