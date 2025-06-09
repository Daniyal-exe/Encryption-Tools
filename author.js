
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated when accessing dashboard
  if (window.location.pathname.includes('dashboard.html')) {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
    
    // Set the username in the dashboard
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
      const username = localStorage.getItem('cipher_username');
      usernameDisplay.textContent = username || 'User';
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        logout();
      });
    }
  }
  
  // Handle form switching on login page
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  const forgotPasswordLink = document.getElementById('forgotPassword');
  const backToLoginLink = document.getElementById('backToLogin');
  
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('register');
    });
  }
  
  if (showLoginLink) {
    showLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('login');
    });
  }
  
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('forgot');
    });
  }
  
  if (backToLoginLink) {
    backToLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('login');
    });
  }
  
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      login();
    });
  }
  
  // Handle registration form submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      register();
    });
  }
  
  // Handle forgot password form submission
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      verifyIdentity();
    });
  }
  
  // Handle reset password form submission
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      resetPassword();
    });
  }
});

// Switch between different forms
function switchForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const formTitle = document.getElementById('form-title');
  
  // Hide all forms first
  loginForm.classList.remove('active-form');
  loginForm.classList.add('hidden-form');
  registerForm.classList.remove('active-form');
  registerForm.classList.add('hidden-form');
  forgotPasswordForm.classList.remove('active-form');
  forgotPasswordForm.classList.add('hidden-form');
  resetPasswordForm.classList.remove('active-form');
  resetPasswordForm.classList.add('hidden-form');
  
  hideErrors();
  
  // Show selected form
  if (formType === 'register') {
    registerForm.classList.remove('hidden-form');
    registerForm.classList.add('active-form');
    formTitle.textContent = 'Create a new account';
    
    // Reset login form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
  } else if (formType === 'forgot') {
    forgotPasswordForm.classList.remove('hidden-form');
    forgotPasswordForm.classList.add('active-form');
    formTitle.textContent = 'Recover your password';
    
    // Reset login form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
  } else if (formType === 'reset') {
    resetPasswordForm.classList.remove('hidden-form');
    resetPasswordForm.classList.add('active-form');
    formTitle.textContent = 'Set a new password';
    
  } else {
    loginForm.classList.remove('hidden-form');
    loginForm.classList.add('active-form');
    formTitle.textContent = 'Sign in to access the encryption dashboard';
    
    // Reset register form
    if (registerForm.querySelector('#newUsername')) {
      document.getElementById('newUsername').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
      document.getElementById('termsAgree').checked = false;
    }
    
    // Hide password strength if visible
    const passwordStrength = document.getElementById('passwordStrength');
    if (passwordStrength) {
      passwordStrength.classList.add('hidden');
    }
  }
}

// Login function
function login() {
  // Reset error messages
  hideErrors();
  
  // Get form values
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  
  // Validate inputs
  let hasErrors = false;
  
  if (!username) {
    document.getElementById('usernameError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!password) {
    document.getElementById('passwordError').style.display = 'block';
    hasErrors = true;
  }
  
  if (hasErrors) {
    return;
  }
  
  // First check stored users
  const users = JSON.parse(localStorage.getItem('cipher_users') || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  
  // If user found in registered users or using demo credentials
  if (user || (username === 'admin' && password === '1234')) {
    // Store authentication status
    localStorage.setItem('cipher_authenticated', 'true');
    localStorage.setItem('cipher_username', username);
    
    // Add success animation
    const loginCard = document.querySelector('.login-card');
    loginCard.style.transform = 'perspective(1000px) rotateY(90deg)';
    
    // Redirect to dashboard after animation
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  } else {
    document.getElementById('loginError').style.display = 'block';
    
    // Shake animation for error
    const loginForm = document.getElementById('loginForm');
    loginForm.classList.add('shake');
    setTimeout(() => {
      loginForm.classList.remove('shake');
    }, 500);
  }
}

// Register function
function register() {
  // Reset error messages
  hideErrors();
  
  // Get form values
  const username = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const dob = document.getElementById('dob').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const termsAgreed = document.getElementById('termsAgree').checked;
  
  // Validate inputs
  let hasErrors = false;
  
  if (!username) {
    document.getElementById('newUsernameError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!email || !isValidEmail(email)) {
    document.getElementById('emailError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!phone || phone.length < 10) {
    document.getElementById('phoneError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!dob) {
    document.getElementById('dobError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!password || password.length < 4) {
    document.getElementById('newPasswordError').style.display = 'block';
    hasErrors = true;
  }
  
  if (password !== confirmPassword) {
    document.getElementById('confirmPasswordError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!termsAgreed) {
    document.getElementById('termsError').style.display = 'block';
    hasErrors = true;
  }
  
  if (hasErrors) {
    return;
  }
  
  // Check if username already exists
  const users = JSON.parse(localStorage.getItem('cipher_users') || '[]');
  const existingUser = users.find(u => u.username === username);
  
  if (existingUser) {
    document.getElementById('newUsernameError').textContent = 'Username already exists';
    document.getElementById('newUsernameError').style.display = 'block';
    return;
  }
  
  // Add new user
  users.push({ username, email, phone, dob, password });
  localStorage.setItem('cipher_users', JSON.stringify(users));
  
  // Show success message and switch to login
  const registerForm = document.getElementById('registerForm');
  registerForm.innerHTML = `
    <div class="success-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h2>Registration Successful!</h2>
      <p>Your account has been created. You can now sign in.</p>
      <button type="button" class="btn btn-primary btn-block" id="goToLogin">Sign In Now</button>
    </div>
  `;
  
  // Add event listener for sign in button
  document.getElementById('goToLogin').addEventListener('click', function() {
    switchForm('login');
  });
}

// Verify identity for password reset
function verifyIdentity() {
  // Reset error messages
  hideErrors();
  
  // Get form values
  const username = document.getElementById('forgotUsername').value.trim();
  const email = document.getElementById('forgotEmail').value.trim();
  const phone = document.getElementById('forgotPhone').value.trim();
  const dob = document.getElementById('forgotDob').value;
  
  // Validate inputs
  let hasErrors = false;
  
  if (!username) {
    document.getElementById('forgotUsernameError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!email || !isValidEmail(email)) {
    document.getElementById('forgotEmailError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!phone) {
    document.getElementById('forgotPhoneError').style.display = 'block';
    hasErrors = true;
  }
  
  if (!dob) {
    document.getElementById('forgotDobError').style.display = 'block';
    hasErrors = true;
  }
  
  if (hasErrors) {
    return;
  }
  
  // Check if user exists and credentials match
  const users = JSON.parse(localStorage.getItem('cipher_users') || '[]');
  const user = users.find(u => 
    u.username === username && 
    u.email === email && 
    u.phone === phone && 
    u.dob === dob
  );
  
  if (user) {
    // Store the username for password reset
    localStorage.setItem('reset_username', username);
    
    // Show reset password form
    switchForm('reset');
  } else {
    document.getElementById('forgotError').style.display = 'block';
    
    // Shake animation for error
    const forgotForm = document.getElementById('forgotPasswordForm');
    forgotForm.classList.add('shake');
    setTimeout(() => {
      forgotForm.classList.remove('shake');
    }, 500);
  }
}

// Reset password function
function resetPassword() {
  // Reset error messages
  hideErrors();
  
  // Get form values
  const password = document.getElementById('resetPassword').value;
  const confirmPassword = document.getElementById('resetConfirmPassword').value;
  
  // Validate inputs
  let hasErrors = false;
  
  if (!password || password.length < 4) {
    document.getElementById('resetPasswordError').style.display = 'block';
    hasErrors = true;
  }
  
  if (password !== confirmPassword) {
    document.getElementById('resetConfirmError').style.display = 'block';
    hasErrors = true;
  }
  
  if (hasErrors) {
    return;
  }
  
  // Get the username for reset
  const username = localStorage.getItem('reset_username');
  if (!username) {
    document.getElementById('resetError').textContent = 'Session expired. Please try again.';
    document.getElementById('resetError').style.display = 'block';
    return;
  }
  
  // Update the user's password
  const users = JSON.parse(localStorage.getItem('cipher_users') || '[]');
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex !== -1) {
    users[userIndex].password = password;
    localStorage.setItem('cipher_users', JSON.stringify(users));
    
    // Clear the reset username
    localStorage.removeItem('reset_username');
    
    // Show success message and switch to login
    const resetForm = document.getElementById('resetPasswordForm');
    resetForm.innerHTML = `
      <div class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2>Password Reset Successful!</h2>
        <p>Your password has been updated. You can now sign in with your new password.</p>
        <button type="button" class="btn btn-primary btn-block" id="goToLoginAfterReset">Sign In Now</button>
      </div>
    `;
    
    // Add event listener for sign in button
    document.getElementById('goToLoginAfterReset').addEventListener('click', function() {
      switchForm('login');
    });
  } else {
    document.getElementById('resetError').textContent = 'User not found. Please try again.';
    document.getElementById('resetError').style.display = 'block';
  }
}

// Email validation helper
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Hide all error messages
function hideErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.style.display = 'none';
  });
}

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem('cipher_authenticated') === 'true';
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = 'index.html';
}

// Logout function
function logout() {
  // Clear authentication status
  localStorage.removeItem('cipher_authenticated');
  localStorage.removeItem('cipher_username');
  
  // Redirect to login page
  redirectToLogin();
}

    // Password visibility toggle function
    function togglePasswordVisibility(inputId) {
      const passwordInput = document.getElementById(inputId);
      const toggleIcon = passwordInput.nextElementSibling;
      
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "🔒";
      } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "👁️";
      }
    }


    document.addEventListener('DOMContentLoaded', function() {

  // 👇 Add this block at the top of your existing DOMContentLoaded function

  // Force white background if dark mode is active
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Check if it's the login page (e.g., index.html)
  if (!window.location.pathname.includes('dashboard.html') && isDarkMode) {
    document.body.style.backgroundColor = 'white';

    // Optional: Force form card to remain styled properly in light mode
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
      loginCard.style.backgroundColor = 'white';
      loginCard.style.color = 'black'; // Ensure text is readable
    }
  }

  // 👆 Place this before your existing login/register form handling code.
  // ... your remaining code
});
