


document.addEventListener('DOMContentLoaded', function() {
  // Only proceed if we're on the dashboard page
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to current tab and content
      this.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
});

// Login form functionality
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
      usernameDisplay.textContent = username ? `👤 ${username}` : '👤 User';
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        logout();
      });
    }
  }
  
  // Login page form switching
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
      switchForm('forgotPassword');
    });
  }
  
  if (backToLoginLink) {
    backToLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('login');
    });
  }
  
  // Handle form submissions
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      login();
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      register();
    });
  }
  
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      verifyIdentity();
    });
  }
  
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      resetPassword();
    });
  }
});

// Switch between forms on login page
function switchForm(formType) {
// UI functionality
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Add click event to each tab
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and tab contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      // Add active class to the clicked tab
      this.classList.add('active');
      
      // Get the tab content id
      const tabContentId = this.getAttribute('data-tab');
      
      // Show the corresponding tab content
      const tabContent = document.getElementById(tabContentId);
      if (tabContent) {
        tabContent.classList.add('active');
      }
      
      // Save the active tab to localStorage
      localStorage.setItem('active_cipher_tab', tabContentId);
    });
  });
  
  // Check if there's a saved active tab
  const activeTab = localStorage.getItem('active_cipher_tab');
  if (activeTab) {
    const savedTab = document.querySelector(`.tab[data-tab="${activeTab}"]`);
    if (savedTab) {
      savedTab.click();
    }
  }
  
  // Handle logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Clear any user data
      sessionStorage.removeItem('loggedIn');
      
      // Redirect to login page
      window.location.href = 'index.html';
    });
  }
  
  // Handle form switching on login page
  initLoginForms();
  
  // Set username in header if logged in
  const usernameDisplay = document.getElementById('username-display');
  const loggedInUsername = sessionStorage.getItem('username');
  
  if (usernameDisplay && loggedInUsername) {
    usernameDisplay.textContent = `👤 ${loggedInUsername}`;
  }
  
  // Run session check
  checkSession();
});

// Initialize login page forms
function initLoginForms() {
  // Get form elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const formTitle = document.getElementById('form-title');
   
  // Form switching buttons
  const showRegisterBtn = document.getElementById('showRegister');
  const showLoginBtn = document.getElementById('showLogin');
  const forgotPasswordBtn = document.getElementById('forgotPassword');
  const backToLoginBtn = document.getElementById('backToLogin');
  
  if (!loginForm) return; // Not on login page
  
  // Show register form
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm(loginForm, registerForm);
      if (formTitle) formTitle.textContent = 'Create a new account';
    });
  }
  
  // Show login form
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm(registerForm, loginForm);
      if (formTitle) formTitle.textContent = 'Sign in to access the encryption dashboard';
    });
  }
  
  // Show forgot password form
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm(loginForm, forgotPasswordForm);
      if (formTitle) formTitle.textContent = 'Recover your password';
    });
  }
  
  // Back to login from forgot password
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm(forgotPasswordForm, loginForm);
      if (formTitle) formTitle.textContent = 'Sign in to access the encryption dashboard';
    });
  }
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      
      // Validate inputs
      let isValid = true;
      
      if (!username) {
        document.getElementById('usernameError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('usernameError').style.display = 'none';
      }
      
      if (!password) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('passwordError').style.display = 'none';
      }
      
      if (isValid) {
        // For demo purposes, accept any username with password "password"
        // In a real app, this would validate against a backend
        if (password === 'password') {
          // Set login session
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('username', username);
          
          // Redirect to dashboard
          window.location.href = 'dashboard.html';
        } else {
          document.getElementById('loginError').style.display = 'block';
          loginForm.classList.add('shake');
          
          // Remove shake animation after it completes
          setTimeout(() => {
            loginForm.classList.remove('shake');
          }, 500);
        }
      }
    });
  }
  
  // Handle register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('newUsername').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const dob = document.getElementById('dob').value;
      const password = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const termsAgree = document.getElementById('termsAgree').checked;
      
      // Validate inputs
      let isValid = true;
      
      if (!username) {
        document.getElementById('newUsernameError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('newUsernameError').style.display = 'none';
      }
      
      if (!email || !isValidEmail(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('emailError').style.display = 'none';
      }
      
      if (!phone) {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('phoneError').style.display = 'none';
      }
      
      if (!dob) {
        document.getElementById('dobError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('dobError').style.display = 'none';
      }
      
      if (!password || password.length < 4) {
        document.getElementById('newPasswordError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('newPasswordError').style.display = 'none';
      }
      
      if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
      }
      
      if (!termsAgree) {
        document.getElementById('termsError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('termsError').style.display = 'none';
      }
      
      if (isValid) {
        // For demo purposes, simulate successful registration
        // In a real app, this would send data to a backend
        
        // Show success message
        registerForm.innerHTML = `
          <div class="success-message">
            <div class="success-icon">✅</div>
            <h3>Registration Successful!</h3>
            <p>Your account has been created. You can now login.</p>
            <button class="btn btn-primary btn-block" id="postRegisterLogin">Go to Login</button>
          </div>
        `;
        
        // Add event listener to the new button
        document.getElementById('postRegisterLogin').addEventListener('click', function() {
          // Reset the form
          registerForm.classList.remove('active-form');
          registerForm.classList.add('hidden-form');
          loginForm.classList.remove('hidden-form');
          loginForm.classList.add('active-form');
          if (formTitle) formTitle.textContent = 'Sign in to access the encryption dashboard';
          
          // Reload the page to reset forms
          window.location.reload();
        });
      }
    });
  }
  
  // Handle forgot password form submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('forgotUsername').value.trim();
      const email = document.getElementById('forgotEmail').value.trim();
      const phone = document.getElementById('forgotPhone').value.trim();
      const dob = document.getElementById('forgotDob').value;
      
      // Validate inputs
      let isValid = true;
      
      if (!username) {
        document.getElementById('forgotUsernameError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('forgotUsernameError').style.display = 'none';
      }
      
      if (!email || !isValidEmail(email)) {
        document.getElementById('forgotEmailError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('forgotEmailError').style.display = 'none';
      }
      
      if (!phone) {
        document.getElementById('forgotPhoneError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('forgotPhoneError').style.display = 'none';
      }
      
      if (!dob) {
        document.getElementById('forgotDobError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('forgotDobError').style.display = 'none';
      }
      
      if (isValid) {
        // For demo purposes, switch to reset password form
        // In a real app, this would verify with a backend first
        switchForm(forgotPasswordForm, resetPasswordForm);
        if (formTitle) formTitle.textContent = 'Reset your password';
      }
    });
  }
  
  // Handle reset password form submission
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const password = document.getElementById('resetPassword').value;
      const confirmPassword = document.getElementById('resetConfirmPassword').value;
      
      // Validate inputs
      let isValid = true;
      
      if (!password || password.length < 4) {
        document.getElementById('resetPasswordError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('resetPasswordError').style.display = 'none';
      }
      
      if (password !== confirmPassword) {
        document.getElementById('resetConfirmError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('resetConfirmError').style.display = 'none';
      }
      
      if (isValid) {
        // For demo purposes, show success and go to login
        // In a real app, this would send to a backend
        
        // Show success message
        resetPasswordForm.innerHTML = `
          <div class="success-message">
            <div class="success-icon">✅</div>
            <h3>Password Reset Successful!</h3>
            <p>Your password has been reset. You can now login with your new password.</p>
            <button class="btn btn-primary btn-block" id="postResetLogin">Go to Login</button>
          </div>
        `;
        
        // Add event listener to the new button
        document.getElementById('postResetLogin').addEventListener('click', function() {
          // Reset the form
          resetPasswordForm.classList.remove('active-form');
          resetPasswordForm.classList.add('hidden-form');
          loginForm.classList.remove('hidden-form');
          loginForm.classList.add('active-form');
          if (formTitle) formTitle.textContent = 'Sign in to access the encryption dashboard';
          
          // Reload the page to reset forms
          window.location.reload();
        });
      }
    });
  }
}

// Helper function to switch between forms
function switchForm(hideForm, showForm) {
  hideForm.classList.remove('active-form');
  hideForm.classList.add('hidden-form');
  showForm.classList.remove('hidden-form');
  showForm.classList.add('active-form');
}

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if user is logged in
function checkSession() {
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  const onDashboard = window.location.pathname.includes('dashboard.html');
  const onLoginPage = !onDashboard && (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/'));
  
  if (onDashboard && !isLoggedIn) {
    // User is not logged in but trying to access dashboard
    window.location.href = 'index.html';
  } else if (onLoginPage && isLoggedIn) {
    // User is already logged in and on login page
    window.location.href = 'dashboard.html';
  }
}
}