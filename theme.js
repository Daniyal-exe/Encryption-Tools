document.addEventListener('DOMContentLoaded', function() {
  // Get theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  const fixedThemeToggle = document.getElementById('fixedThemeToggle');
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('cipher_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('cipher_theme', 'dark');
  }
  
  // Add click event to toggle theme
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Set the new theme
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('cipher_theme', newTheme);
      
      // Add animation effect
      document.body.style.transition = 'background-color 0.3s, color 0.3s';
      
      // Show theme change notification
      showToast(`Switched to ${newTheme} mode`);
    });
  }
  
  // Make theme toggle fixed during scroll
  if (fixedThemeToggle) {
    fixedThemeToggle.classList.add('fixed-toggle');
  }
  
  // Ensure theme toggle is visible on scroll
  window.addEventListener('scroll', function() {
    if (fixedThemeToggle) {
      if (window.scrollY > 50) {
        fixedThemeToggle.classList.add('toggle-visible');
      } else {
        fixedThemeToggle.classList.remove('toggle-visible');
      }
    }
  });
  
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
