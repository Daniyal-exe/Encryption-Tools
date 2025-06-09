// Additional Cipher Tools Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Only proceed if we're on the dashboard page
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  // Text transformer elements
  const textInput = document.getElementById('text-transform-input');
  const textUppercaseBtn = document.getElementById('text-uppercase');
  const textLowercaseBtn = document.getElementById('text-lowercase');
  const textReverseBtn = document.getElementById('text-reverse');
  const textClearBtn = document.getElementById('text-clear');
  const textCopyBtn = document.getElementById('text-transform-copy');
  const textResult = document.getElementById('text-transform-result');
  
  // Hash generator elements
  const hashInput = document.getElementById('hash-input');
  const hashAlgorithmSelect = document.getElementById('hash-algorithm');
  const hashGenerateBtn = document.getElementById('hash-generate');
  const hashClearBtn = document.getElementById('hash-clear');
  const hashCopyBtn = document.getElementById('hash-copy');
  const hashResult = document.getElementById('hash-result');
  
  // Password strength elements
  const passwordInput = document.getElementById('password-input');
  const strengthMeter = document.getElementById('strength-meter');
  const strengthText = document.getElementById('strength-text');
  const passwordFeedback = document.getElementById('password-feedback');
  
  // Initialize tools if they exist
  initTextTransformer();
  initHashGenerator();
  initPasswordStrengthChecker();
  
  // Text Transformer Tool
  function initTextTransformer() {
    if (!textInput || !textUppercaseBtn) return;
    
    // Convert to uppercase
    textUppercaseBtn.addEventListener('click', function() {
      if (!textInput.value.trim()) {
        showToast('Please enter some text first');
        return;
      }
      
      textResult.textContent = textInput.value.toUpperCase();
      showToast('Text converted to uppercase!');
    });
    
    // Convert to lowercase
    textLowercaseBtn.addEventListener('click', function() {
      if (!textInput.value.trim()) {
        showToast('Please enter some text first');
        return;
      }
      
      textResult.textContent = textInput.value.toLowerCase();
      showToast('Text converted to lowercase!');
    });
    
    // Reverse text
    textReverseBtn.addEventListener('click', function() {
      if (!textInput.value.trim()) {
        showToast('Please enter some text first');
        return;
      }
      
      textResult.textContent = textInput.value.split('').reverse().join('');
      showToast('Text reversed!');
    });
    
    // Clear text
    textClearBtn.addEventListener('click', function() {
      textInput.value = '';
      textResult.textContent = '';
      showToast('Text cleared!');
    });
    
    // Copy result
    textCopyBtn.addEventListener('click', function() {
      if (!textResult.textContent) {
        showToast('Nothing to copy');
        return;
      }
      
      copyToClipboard(textResult.textContent);
      showToast('Result copied to clipboard!');
    });
  }
  
  // Hash Generator Tool
  function initHashGenerator() {
    if (!hashInput || !hashGenerateBtn) return;
    
    // Generate hash
    hashGenerateBtn.addEventListener('click', function() {
      if (!hashInput.value.trim()) {
        showToast('Please enter some text to hash');
        return;
      }
      
      const algorithm = hashAlgorithmSelect.value;
      let hash = '';
      
      // Simple hash implementations (for demo purposes)
      switch (algorithm) {
        case 'md5':
          hash = generateMD5Hash(hashInput.value);
          break;
        case 'sha1':
          hash = generateSHA1Hash(hashInput.value);
          break;
        case 'sha256':
          hash = generateSHA256Hash(hashInput.value);
          break;
      }
      
      hashResult.textContent = hash;
      showToast(`${algorithm.toUpperCase()} hash generated!`);
    });
    
    // Clear hash
    hashClearBtn.addEventListener('click', function() {
      hashInput.value = '';
      hashResult.textContent = '';
      showToast('Hash cleared!');
    });
    
    // Copy hash
    hashCopyBtn.addEventListener('click', function() {
      if (!hashResult.textContent) {
        showToast('Nothing to copy');
        return;
      }
      
      copyToClipboard(hashResult.textContent);
      showToast('Hash copied to clipboard!');
    });
  }
  
  // Password Strength Checker Tool
  function initPasswordStrengthChecker() {
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      
      if (!password) {
        strengthMeter.style.width = '0%';
        strengthText.textContent = 'Enter a password';
        passwordFeedback.innerHTML = '';
        return;
      }
      
      // Check password strength
      const { score, feedback } = checkPasswordStrength(password);
      
      // Update meter
      strengthMeter.style.width = `${score * 20}%`;
      
      // Update text
      if (score <= 2) {
        strengthMeter.style.backgroundColor = '#EF4444'; // Red
        strengthText.textContent = 'Weak';
      } else if (score <= 4) {
        strengthMeter.style.backgroundColor = '#F59E0B'; // Orange
        strengthText.textContent = 'Medium';
      } else {
        strengthMeter.style.backgroundColor = '#10B981'; // Green
        strengthText.textContent = 'Strong';
      }
      
      // Update feedback
      passwordFeedback.innerHTML = '';
      feedback.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        passwordFeedback.appendChild(li);
      });
    });
  }
  
  // Password strength checker
  function checkPasswordStrength(password) {
    let score = 0;
    const feedback = [];
    
    // Check length
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }
    
    // Check for numbers
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }
    
    return { score, feedback };
  }
  
  // Simple hash functions (for demonstration only - not cryptographically secure)
  function generateMD5Hash(text) {
    // This is a simplified version for demonstration
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  }
  
  function generateSHA1Hash(text) {
    // This is a simplified version for demonstration
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(40, '0');
  }
  
  function generateSHA256Hash(text) {
    // This is a simplified version for demonstration
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
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
