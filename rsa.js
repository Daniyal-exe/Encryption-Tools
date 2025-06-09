// RSA Encryption Implementation for Web Browser
document.addEventListener('DOMContentLoaded', function() {
  // Only proceed if we're on the dashboard page
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  const rsaText = document.getElementById('rsa-text');
  const rsaGenerateKeysBtn = document.getElementById('rsa-generate-keys');
  const rsaEncryptBtn = document.getElementById('rsa-encrypt');
  const rsaDecryptBtn = document.getElementById('rsa-decrypt');
  const rsaClearBtn = document.getElementById('rsa-clear');
  const rsaCopyBtn = document.getElementById('rsa-copy');
  const rsaPublicKey = document.getElementById('rsa-public-key');
  const rsaPrivateKey = document.getElementById('rsa-private-key');
  const rsaResult = document.getElementById('rsa-result');
  const rsaAdvancedMode = document.getElementById('rsa-advanced-mode');
  const rsaAdvancedSettings = document.getElementById('rsa-advanced-settings');
  const rsaKeySize = document.getElementById('rsa-key-size');
  
  if (!rsaEncryptBtn) return; // Exit if elements don't exist
  
  // Toggle advanced settings
  if (rsaAdvancedMode) {
    rsaAdvancedMode.addEventListener('change', function() {
      if (rsaAdvancedSettings) {
        rsaAdvancedSettings.style.display = this.checked ? 'block' : 'none';
      }
    });
  }
  
  // Load saved keys if they exist
  const savedPublicKey = localStorage.getItem('rsa_public_key');
  const savedPrivateKey = localStorage.getItem('rsa_private_key');
  
  if (savedPublicKey && savedPrivateKey) {
    rsaPublicKey.value = savedPublicKey;
    rsaPrivateKey.value = savedPrivateKey;
  } else {
    // Generate default keys on first load
    generateRSAKeys();
  }
  
  // Generate RSA keys
  rsaGenerateKeysBtn.addEventListener('click', function() {
    generateRSAKeys();
    showToast('New RSA keys generated!');
  });
  
  // RSA encryption
  rsaEncryptBtn.addEventListener('click', function() {
    // Validate input
    if (!validateRSAInput()) {
      return;
    }
    
    try {
      const text = rsaText.value;
      const publicKey = JSON.parse(rsaPublicKey.value);
      
      // Encrypt the text
      const encrypted = rsaEncrypt(text, publicKey);
      
      // Display the result
      rsaResult.textContent = encrypted;
      
      // Show success message
      showToast('Text encrypted successfully!');
    } catch (error) {
      rsaResult.textContent = "Error: " + error.message;
    }
  });
  
  // RSA decryption
  rsaDecryptBtn.addEventListener('click', function() {
    // Validate input
    if (!validateRSAInput()) {
      return;
    }
    
    try {
      const text = rsaText.value;
      const privateKey = JSON.parse(rsaPrivateKey.value);
      
      // Check if the input is in proper comma-separated format
      if (!text.includes(',') && !/^\d+(,\d+)*$/.test(text)) {
        throw new Error("Invalid ciphertext format. Please enter a valid RSA encrypted text (comma-separated numbers).");
      }
      
      // Decrypt the text
      const decrypted = rsaDecrypt(text, privateKey);
      
      // Display the result
      rsaResult.textContent = decrypted;
      
      // Show success message
      showToast('Text decrypted successfully!');
    } catch (error) {
      rsaResult.textContent = "Error: " + error.message;
      showToast('Decryption failed: ' + error.message);
    }
  });
  
  // Clear all fields
  rsaClearBtn.addEventListener('click', function() {
    rsaText.value = '';
    rsaResult.textContent = '';
    document.getElementById('rsa-text-error').style.display = 'none';
    
    // Show clear message
    showToast('Fields cleared!');
  });
  
  // Copy result
  rsaCopyBtn.addEventListener('click', function() {
    const result = rsaResult.textContent;
    if (result) {
      copyToClipboard(result);
      showToast('Result copied to clipboard!');
    }
  });
  
  // Generate RSA key pair
  function generateRSAKeys() {
    let primes = [];
    let keySize = rsaKeySize ? rsaKeySize.value : 'small';
    
    // Choose appropriate primes based on selected key size
    switch (keySize) {
      case 'large':
        primes = [
          3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319,
          3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389
        ];
        break;
      case 'medium':
        primes = [
          541, 547, 557, 563, 569, 571, 577, 587, 593, 599,
          601, 607, 613, 617, 619, 631, 641, 643, 647, 653
        ];
        break;
      case 'small':
      default:
        primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
        break;
    }
    
    // Select two random primes
    const p = primes[Math.floor(Math.random() * primes.length)];
    let q;
    do {
      q = primes[Math.floor(Math.random() * primes.length)];
    } while (p === q); // Ensure p and q are different
    
    // Calculate n and phi
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Choose e (public exponent)
    // e must be coprime to phi and 1 < e < phi
    let e = 65537; // Common choice for e
    if (e >= phi) {
      // Find a smaller e for our small numbers
      e = 3;
      while (gcd(e, phi) !== 1) {
        e += 2;
      }
    }
    
    // Calculate d (private exponent) using extended Euclidean algorithm
    const d = modInverse(e, phi);
    
    // Create and display the keys
    const publicKey = { e, n };
    const privateKey = { d, n };
    
    rsaPublicKey.value = JSON.stringify(publicKey);
    rsaPrivateKey.value = JSON.stringify(privateKey);
    
    // Save keys to localStorage
    localStorage.setItem('rsa_public_key', JSON.stringify(publicKey));
    localStorage.setItem('rsa_private_key', JSON.stringify(privateKey));
  }
  
  // RSA encryption function
  function rsaEncrypt(text, publicKey) {
    const { e, n } = publicKey;
    
    // Convert text to numbers and encrypt
    const encrypted = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const encryptedChar = modPow(charCode, e, n);
      encrypted.push(encryptedChar);
    }
    
    return encrypted.join(',');
  }
  
  // RSA decryption function
  function rsaDecrypt(encryptedText, privateKey) {
    const { d, n } = privateKey;
    
    try {
      // Split the encrypted text into numbers
      const encryptedChars = encryptedText.split(',').map(Number);
      
      // Check if any conversion failed (NaN values)
      if (encryptedChars.some(isNaN)) {
        throw new Error("Invalid encrypted data format");
      }
      
      // Decrypt each number and convert back to text
      let decrypted = '';
      for (let i = 0; i < encryptedChars.length; i++) {
        const charCode = modPow(encryptedChars[i], d, n);
        decrypted += String.fromCharCode(charCode);
      }
      
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Invalid ciphertext format. Please enter a valid RSA encrypted text.");
    }
  }
  
  // Validate RSA input
  function validateRSAInput() {
    let isValid = true;
    
    // Validate text input
    if (!rsaText.value.trim()) {
      document.getElementById('rsa-text-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('rsa-text-error').style.display = 'none';
    }
    
    return isValid;
  }
  
  // Helper functions for RSA
  
  // Greatest Common Divisor
  function gcd(a, b) {
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  // Modular exponentiation (a^b mod n)
  function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    
    let result = 1;
    base = base % modulus;
    
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }
    
    return result;
  }
  
  // Modular multiplicative inverse using Extended Euclidean Algorithm
  function modInverse(a, m) {
    let m0 = m;
    let y = 0;
    let x = 1;
    
    if (m === 1) return 0;
    
    while (a > 1) {
      const q = Math.floor(a / m);
      let t = m;
      
      m = a % m;
      a = t;
      t = y;
      
      y = x - q * y;
      x = t;
    }
    
    if (x < 0) {
      x += m0;
    }
    
    return x;
  }
  
  // Helper function for clipboard operations
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
});
