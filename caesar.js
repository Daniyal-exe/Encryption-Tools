// Caesar cipher functionality
document.addEventListener('DOMContentLoaded', function() {
  // Only proceed if we're on the dashboard page
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  const caesarText = document.getElementById('caesar-text');
  const caesarShift = document.getElementById('caesar-shift');
  const caesarEncryptBtn = document.getElementById('caesar-encrypt');
  const caesarDecryptBtn = document.getElementById('caesar-decrypt');
  const caesarClearBtn = document.getElementById('caesar-clear');
  const caesarCopyBtn = document.getElementById('caesar-copy');
  const caesarResult = document.getElementById('caesar-result');
  const caesarEmojiToggle = document.getElementById('caesar-emoji-toggle');
  
  if (!caesarEncryptBtn) return; // Exit if elements don't exist
  
  // Caesar encryption
  caesarEncryptBtn.addEventListener('click', function() {
    // Validate input
    if (!validateCaesarInput()) {
      return;
    }
    
    const text = caesarText.value;
    const shift = parseInt(caesarShift.value);
    const useEmoji = caesarEmojiToggle && caesarEmojiToggle.checked;
    
    // Encrypt the text
    const encrypted = caesarCipher(text, shift, useEmoji);
    
    // Display the result
    caesarResult.textContent = encrypted;
    
    // Show success message
    showToast('Text encrypted successfully!');
  });
  
  // Caesar decryption
  caesarDecryptBtn.addEventListener('click', function() {
    // Validate input
    if (!validateCaesarInput()) {
      return;
    }
    
    const text = caesarText.value;
    const shift = parseInt(caesarShift.value);
    const useEmoji = caesarEmojiToggle && caesarEmojiToggle.checked;
    
    // Decrypt the text (use 26-shift for decryption)
    const decrypted = caesarCipher(text, 26 - shift, useEmoji);
    
    // Display the result
    caesarResult.textContent = decrypted;
    
    // Show success message
    showToast('Text decrypted successfully!');
  });
  
  // Clear all fields
  caesarClearBtn.addEventListener('click', function() {
    caesarText.value = '';
    caesarShift.value = '3';
    caesarResult.textContent = '';
    if (caesarEmojiToggle) caesarEmojiToggle.checked = false;
    document.getElementById('caesar-text-error').style.display = 'none';
    document.getElementById('caesar-shift-error').style.display = 'none';
    
    // Show clear message
    showToast('Fields cleared!');
  });
  
  // Copy result
  caesarCopyBtn.addEventListener('click', function() {
    const result = caesarResult.textContent;
    if (result) {
      copyToClipboard(result);
      showToast('Result copied to clipboard!');
    }
  });
  
  // Validate Caesar cipher input
  function validateCaesarInput() {
    let isValid = true;
    
    // Validate text input
    if (!caesarText.value.trim()) {
      document.getElementById('caesar-text-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('caesar-text-error').style.display = 'none';
    }
    
    // Validate shift input
    const shift = parseInt(caesarShift.value);
    if (isNaN(shift) || shift < 1 || shift > 25) {
      document.getElementById('caesar-shift-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('caesar-shift-error').style.display = 'none';
    }
    
    return isValid;
  }
});

// Caesar cipher implementation (supports letters and emoji)
function caesarCipher(text, shift, useEmoji = false) {
  if (text.length === 0) return '';
  
  // Ensure shift is in range 1-25
  shift = ((shift % 26) + 26) % 26;
  
  // If emoji mode is enabled, use emoji cipher instead
  if (useEmoji) {
    return emojiCaesarCipher(text, shift);
  }
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Handle emojis and other Unicode characters
    if (code > 127) {
      return char; // Keep emojis unchanged
    }
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      return String.fromCharCode((code - 65 + shift) % 26 + 65);
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      return String.fromCharCode((code - 97 + shift) % 26 + 97);
    }
    
    // Non-alphabetic characters remain unchanged
    return char;
  }).join('');
}

// Emoji Caesar cipher implementation
function emojiCaesarCipher(text, shift) {
  // Basic emoji set to use for substitution (26 emojis for 26 letters)
  const emojiSet = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
    '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', 
    '🤩', '🤔', '🤨', '😐', '😑', '😶'
  ];
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Handle uppercase letters (ASCII 65-90)
    if (code >= 65 && code <= 90) {
      const index = (code - 65 + shift) % 26;
      return emojiSet[index];
    }
    
    // Handle lowercase letters (ASCII 97-122)
    if (code >= 97 && code <= 122) {
      const index = (code - 97 + shift) % 26;
      return emojiSet[index];
    }
    
    // Non-alphabetic characters remain unchanged
    return char;
  }).join('');
}

// Copy to clipboard helper function
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
