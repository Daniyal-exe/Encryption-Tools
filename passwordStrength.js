
document.addEventListener('DOMContentLoaded', function() {
  const newPasswordInput = document.getElementById('newPassword');
  const passwordStrength = document.getElementById('passwordStrength');
  const strengthMeter = document.getElementById('strengthMeter');
  const strengthText = document.getElementById('strengthText');
  const strengthFeedback = document.getElementById('strengthFeedback');
  
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function() {
      const password = newPasswordInput.value;
      
      if (password.length > 0) {
        passwordStrength.classList.remove('hidden');
        const { strength, strengthText: text, feedback } = checkPasswordStrength(password);
        
        // Update strength meter
        strengthMeter.style.width = `${strength * 20}%`;
        
        // Set color based on strength
        if (strength <= 2) {
          strengthMeter.style.backgroundColor = '#EF4444'; // Red
        } else if (strength <= 4) {
          strengthMeter.style.backgroundColor = '#F59E0B'; // Orange
        } else {
          strengthMeter.style.backgroundColor = '#10B981'; // Green
        }
        
        // Update text
        strengthText.textContent = text;
        
        // Update feedback list
        strengthFeedback.innerHTML = '';
        feedback.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          strengthFeedback.appendChild(li);
        });
      } else {
        passwordStrength.classList.add('hidden');
      }
    });
  }
});

function checkPasswordStrength(password) {
  // Check password strength
  let strength = 0;
  const feedback = [];
  
  if (password.length >= 8) {
    strength += 1;
  } else {
    feedback.push("Password should be at least 8 characters long");
  }
      
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Password should contain uppercase letters");
  }
      
  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Password should contain lowercase letters");
  }
      
  if (/[0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Password should contain numbers");
  }
      
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Password should contain special characters");
  }
  
  let strengthText = "";
  if (strength <= 2) {
    strengthText = "Weak";
  } else if (strength <= 4) {
    strengthText = "Medium";
  } else {
    strengthText = "Strong";
  }
  
  return {
    strength,
    strengthText,
    feedback
  };
}
