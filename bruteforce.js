// Brute Force Analysis Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Only proceed if we're on the dashboard page
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  const bfText = document.getElementById('bf-text');
  const bfMethod = document.getElementById('bf-method');
  const bfAnalyzeBtn = document.getElementById('bf-analyze');
  const bfClearBtn = document.getElementById('bf-clear');
  const bfCopyBtn = document.getElementById('bf-copy');
  const bfResults = document.getElementById('bf-results');
  const bfFrequencyChart = document.getElementById('bf-frequency-chart');
  const bfShowFrequency = document.getElementById('bf-show-frequency');
  const bfShowPatterns = document.getElementById('bf-show-patterns');
  const bfSecurityAnalysis = document.getElementById('bf-security-analysis');
  const bfIncludeEmoji = document.getElementById('bf-include-emoji');
  
  if (!bfAnalyzeBtn) return; // Exit if elements don't exist
  
  // Handle brute force analysis
  bfAnalyzeBtn.addEventListener('click', function() {
    // Validate input
    if (!validateBruteForceInput()) {
      return;
    }
    
    const text = bfText.value.toUpperCase();
    const method = bfMethod.value;
    const includeEmoji = bfIncludeEmoji && bfIncludeEmoji.checked;
    
    // Clear previous results
    bfResults.innerHTML = '';
    bfFrequencyChart.innerHTML = '';
    bfSecurityAnalysis.innerHTML = '';
    
    // Show frequency analysis if enabled
    if (bfShowFrequency.checked) {
      const frequencyData = analyzeFrequency(text);
      drawFrequencyChart(frequencyData);
    }
    
    // Add security analysis
    generateSecurityAnalysis(method);
    
    // Run appropriate brute force method
    if (method === 'caesar') {
      runCaesarBruteForce(text, includeEmoji);
      showToast('Caesar cipher brute force analysis completed!');
    } else if (method === 'frequency') {
      runAdvancedFrequencyAnalysis(text, includeEmoji);
      showToast('Advanced frequency analysis completed!');
    } else if (method === 'custom') {
      runCustomAnalysis(text, includeEmoji);
      showToast('Custom analysis completed!');
    }
  });
  
  // Clear all fields
  bfClearBtn.addEventListener('click', function() {
    bfText.value = '';
    bfResults.innerHTML = '';
    bfFrequencyChart.innerHTML = '';
    bfSecurityAnalysis.innerHTML = '';
    document.getElementById('bf-text-error').style.display = 'none';
    if (bfIncludeEmoji) bfIncludeEmoji.checked = false;
    
    // Show clear message
    showToast('Fields cleared!');
  });
  
  // Copy results
  bfCopyBtn.addEventListener('click', function() {
    // Get all results as text
    let resultText = '';
    const resultItems = document.querySelectorAll('.brute-force-item');
    resultItems.forEach(item => {
      resultText += item.querySelector('h4').textContent + '\n';
      resultText += item.querySelector('p').textContent + '\n\n';
    });
    
    if (resultText) {
      copyToClipboard(resultText);
      showToast('Results copied to clipboard!');
    }
  });
  
  // Generate security analysis based on cipher method
  function generateSecurityAnalysis(method) {
    bfSecurityAnalysis.innerHTML = '';
    
    // Create section title
    const title = document.createElement('h4');
    title.textContent = 'Security Analysis';
    bfSecurityAnalysis.appendChild(title);
    
    // Add security level info
    const securityLevel = document.createElement('div');
    securityLevel.className = 'security-level';
    
    let securityIcon, securityText, securityClass, description;
    
    if (method === 'caesar') {
      securityIcon = '⚠️';
      securityText = 'Low Security';
      securityClass = 'low';
      description = 'Caesar cipher is extremely vulnerable to brute force attacks as there are only 25 possible keys. It can be broken in seconds, even by hand.';
    } else if (method === 'frequency') {
      securityIcon = '🔍';
      securityText = 'Advanced Analysis';
      securityClass = 'medium';
      description = 'Frequency analysis is a powerful technique that can break most simple substitution ciphers by analyzing letter patterns.';
    } else {
      // Custom analysis or other methods
      securityIcon = '🔍';
      securityText = 'Analysis';
      securityClass = 'medium';
      description = 'Custom analysis can help identify patterns and potential weaknesses in encrypted text.';
    }
    
    securityLevel.innerHTML = `
      <span class="security-level-icon">${securityIcon}</span>
      <span class="security-level-text security-level-${securityClass}">${securityText}</span>
    `;
    
    bfSecurityAnalysis.appendChild(securityLevel);
    
    // Add description
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    descriptionElement.style.margin = '10px 0';
    bfSecurityAnalysis.appendChild(descriptionElement);
    
    // Add comparison section
    const comparisonSection = document.createElement('div');
    comparisonSection.className = 'security-comparison';
    
    const comparisonTitle = document.createElement('h4');
    comparisonTitle.textContent = 'Cipher Security Comparison';
    comparisonTitle.style.fontSize = '14px';
    comparisonSection.appendChild(comparisonTitle);
    
    const comparisonDesc = document.createElement('p');
    comparisonDesc.textContent = 'Relative security strength of different cipher methods:';
    comparisonDesc.style.fontSize = '12px';
    comparisonDesc.style.margin = '5px 0';
    comparisonSection.appendChild(comparisonDesc);
    
    const comparisonChart = document.createElement('div');
    comparisonChart.className = 'comparison-chart';
    comparisonChart.innerHTML = `
      <div class="comparison-bar caesar-bar">
        <span class="comparison-bar-label">Caesar</span>
      </div>
      <div class="comparison-bar playfair-bar">
        <span class="comparison-bar-label">Playfair</span>
      </div>
      <div class="comparison-bar rsa-bar">
        <span class="comparison-bar-label">RSA</span>
      </div>
    `;
    comparisonSection.appendChild(comparisonChart);
    
    bfSecurityAnalysis.appendChild(comparisonSection);
  }
  
  // Analyze frequency of letters in text
  function analyzeFrequency(text) {
    const frequency = {};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Initialize frequency count for each letter
    for (const letter of alphabet) {
      frequency[letter] = 0;
    }
    
    // Count frequency of each letter
    for (const char of text) {
      if (alphabet.includes(char)) {
        frequency[char]++;
      }
    }
    
    return frequency;
  }
  
  // Draw frequency chart
  function drawFrequencyChart(frequencyData) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'frequency-chart';
    
    // Get maximum frequency for scaling
    const maxFrequency = Math.max(...Object.values(frequencyData));
    
    // Create bars for each letter
    for (const letter of alphabet) {
      const frequency = frequencyData[letter] || 0;
      const percentage = maxFrequency ? (frequency / maxFrequency) * 100 : 0;
      
      // Create bar container
      const barContainer = document.createElement('div');
      barContainer.className = 'chart-bar-container';
      
      // Create bar
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = `${percentage}%`;
      
      // Highlight common English letters if they have high frequency
      if ((letter === 'E' || letter === 'T' || letter === 'A' || letter === 'O' || letter === 'I' || letter === 'N') && percentage > 60) {
        bar.className += ' chart-bar-highlight';
      }
      
      // Create label
      const label = document.createElement('div');
      label.className = 'chart-label';
      label.textContent = letter;
      
      // Create frequency value
      const value = document.createElement('div');
      value.className = 'chart-value';
      value.textContent = frequency;
      
      // Assemble chart
      barContainer.appendChild(bar);
      barContainer.appendChild(label);
      barContainer.appendChild(value);
      chartContainer.appendChild(barContainer);
    }
    
    // Add chart title
    const chartTitle = document.createElement('h4');
    chartTitle.textContent = 'Letter Frequency Analysis';
    
    // Add chart to the frequency chart container
    bfFrequencyChart.appendChild(chartTitle);
    bfFrequencyChart.appendChild(chartContainer);
    
    // Add English frequency comparison note
    const infoNote = document.createElement('div');
    infoNote.className = 'info-text';
    infoNote.innerHTML = '<p>In English text, the most common letters are E, T, A, O, I, N, S, H, R, D, L, U (in order).</p>';
    bfFrequencyChart.appendChild(infoNote);
  }
  
  // Run Caesar cipher brute force
  function runCaesarBruteForce(text, includeEmoji = false) {
    const results = [];
    
    // Try all possible shifts (1-25)
    for (let shift = 1; shift <= 25; shift++) {
      const decrypted = caesarDecrypt(text, shift);
      
      // Check how likely this result is by checking for common English words
      const score = scoreEnglishText(decrypted);
      
      results.push({
        shift: shift,
        text: decrypted,
        score: score
      });
    }
    
    // Sort results by score (most likely first)
    results.sort((a, b) => b.score - a.score);
    
    // Display the results
    const resultsTitle = document.createElement('h4');
    resultsTitle.textContent = 'Caesar Cipher Brute Force Results';
    resultsTitle.className = 'analysis-title';
    bfResults.appendChild(resultsTitle);
    
    // Create results container
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'bf-results-grid';
    
    // Add each result
    results.forEach((result, index) => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'brute-force-item';
      
      // Apply different styles based on likelihood
      if (index === 0) {
        // Most likely result
        resultDiv.classList.add('most-likely');
        resultDiv.style.border = '2px solid var(--success)';
        resultDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      } else if (index < 3) {
        // Possible results
        resultDiv.style.borderLeft = '4px solid var(--warning)';
      }
      
      const heading = document.createElement('h4');
      heading.textContent = `Shift: ${result.shift}${index === 0 ? ' (Most Likely)' : ''}`;
      
      const content = document.createElement('p');
      content.textContent = result.text;
      
      const scoreElement = document.createElement('div');
      scoreElement.className = 'score-badge';
      scoreElement.textContent = `Score: ${result.score}`;
      
      resultDiv.appendChild(heading);
      resultDiv.appendChild(content);
      resultDiv.appendChild(scoreElement);
      resultsGrid.appendChild(resultDiv);
      
      // If emoji mode is enabled, also show the emoji version
      if (includeEmoji && index < 5) { // Only show emoji for top 5 results
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'brute-force-item emoji-result';
        emojiDiv.style.borderLeft = '4px solid var(--primary)';
        
        const emojiHeading = document.createElement('h4');
        emojiHeading.textContent = `Shift: ${result.shift} (Emoji View)`;
        
        const emojiContent = document.createElement('p');
        emojiContent.textContent = textToEmoji(result.text);
        
        emojiDiv.appendChild(emojiHeading);
        emojiDiv.appendChild(emojiContent);
        resultsGrid.appendChild(emojiDiv);
      }
    });
    
    bfResults.appendChild(resultsGrid);
  }
  
  // Convert text to emoji representation
  function textToEmoji(text) {
    const emojis = [
      '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
      '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', 
      '🤩', '🤔', '🤨', '😐', '😑', '😶'
    ];
    
    return text.split('').map(char => {
      if (char >= 'A' && char <= 'Z') {
        return emojis[char.charCodeAt(0) - 65];
      }
      return char;
    }).join('');
  }
  
  // Score text based on how likely it is to be English
  function scoreEnglishText(text) {
    // Common English words for basic frequency analysis
    const commonWords = ['THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I', 
                         'IT', 'FOR', 'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT',
                         'THIS', 'BUT', 'HIS', 'BY', 'FROM', 'THEY', 'WE', 'SAY', 'HER', 'SHE',
                         'OR', 'AN', 'WILL', 'MY', 'ONE', 'ALL', 'WOULD', 'THERE', 'THEIR', 'WHAT'];
    
    // Count how many common words appear in the text
    let score = 0;
    for (const word of commonWords) {
      // Match word boundaries
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length * 2; // Give more weight to word matches
      }
    }
    
    // Add additional score based on frequency of common letters in English
    const frequency = analyzeFrequency(text);
    const englishFrequency = { 'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3 };
    
    for (const [letter, weight] of Object.entries(englishFrequency)) {
      // Scale the frequency to text length to get percentage
      const letterFrequency = (frequency[letter] / text.length) * 100;
      // Add score based on how close the letter frequency is to English average
      score += 10 - Math.abs(letterFrequency - weight);
    }
    
    return Math.round(score);
  }
  
  // Run advanced frequency analysis
  function runAdvancedFrequencyAnalysis(text, includeEmoji = false) {
    const frequency = analyzeFrequency(text);
    const englishFrequency = {
      'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3,
      'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'U': 2.8, 'C': 2.8, 'M': 2.4,
      'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.5, 'V': 0.98,
      'K': 0.77, 'J': 0.15, 'X': 0.15, 'Q': 0.10, 'Z': 0.07
    };
    
    // Sort by frequency
    const sortedFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    const sortedEnglish = Object.entries(englishFrequency).sort((a, b) => b[1] - a[1]);
    
    // Create potential substitution map
    const substitutionMap = {};
    for (let i = 0; i < sortedFrequency.length; i++) {
      if (i < sortedEnglish.length && sortedFrequency[i][1] > 0) {
        substitutionMap[sortedFrequency[i][0]] = sortedEnglish[i][0];
      }
    }
    
    // Display results
    const resultsTitle = document.createElement('h4');
    resultsTitle.textContent = 'Advanced Frequency Analysis Results';
    resultsTitle.className = 'analysis-title';
    bfResults.appendChild(resultsTitle);
    
    // Create frequency mapping table
    const mappingTable = document.createElement('table');
    mappingTable.className = 'frequency-mapping';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Encrypted Letter</th>
      <th>Frequency</th>
      <th>Possible Plain Text</th>
      <th>English Frequency</th>
    `;
    mappingTable.appendChild(headerRow);
    
    // Add rows for each letter
    for (let i = 0; i < sortedFrequency.length; i++) {
      if (sortedFrequency[i][1] > 0) {
        const row = document.createElement('tr');
        const [encryptedLetter, freq] = sortedFrequency[i];
        const possibleLetter = i < sortedEnglish.length ? sortedEnglish[i][0] : '-';
        const englishFreq = i < sortedEnglish.length ? sortedEnglish[i][1] + '%' : '-';
        
        row.innerHTML = `
          <td>${encryptedLetter}</td>
          <td>${freq}</td>
          <td>${possibleLetter}</td>
          <td>${englishFreq}</td>
        `;
        mappingTable.appendChild(row);
      }
    }
    
    // Wrap table in container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tableContainer.appendChild(mappingTable);
    bfResults.appendChild(tableContainer);
    
    // Create possible decryption
    const decryptionSection = document.createElement('div');
    decryptionSection.className = 'decryption-section';
    
    const decryptionTitle = document.createElement('h4');
    decryptionTitle.textContent = 'Possible Decryption';
    decryptionSection.appendChild(decryptionTitle);
    
    // Decrypt using substitution map
    let decrypted = '';
    for (const char of text) {
      if (substitutionMap[char]) {
        decrypted += substitutionMap[char];
      } else {
        decrypted += char;
      }
    }
    
    const decryptedText = document.createElement('div');
    decryptedText.className = 'most-likely';
    decryptedText.innerHTML = `<p>${decrypted}</p>`;
    decryptionSection.appendChild(decryptedText);
    
    // Note about frequency analysis
    const note = document.createElement('div');
    note.className = 'info-text';
    note.innerHTML = `
      <p>This is an automated attempt based on letter frequency. Manual adjustments may be needed for accurate decryption.</p>
      <p>Common English digraphs: TH, HE, IN, ER, AN, RE, ES, ON, ST, NT, EN, AT, ED, ND, TO, OR, EA, TI, AR, TE</p>
    `;
    decryptionSection.appendChild(note);
    
    bfResults.appendChild(decryptionSection);
  }
  
  // Run custom pattern analysis
  function runCustomAnalysis(text, includeEmoji = false) {
    // Display pattern analysis if enabled
    if (bfShowPatterns.checked) {
      analyzePatterns(text);
    }
    
    // Add helpful insights section
    const insightsSection = document.createElement('div');
    insightsSection.className = 'analysis-section';
    
    const insightsTitle = document.createElement('h4');
    insightsTitle.textContent = 'Analysis Insights';
    insightsSection.appendChild(insightsTitle);
    
    // Add some insights about the text
    const insights = document.createElement('ul');
    
    // Count uppercase letters
    const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
    const uppercaseItem = document.createElement('li');
    uppercaseItem.textContent = `Uppercase letters: ${uppercaseCount}`;
    insights.appendChild(uppercaseItem);
    
    // Count total characters
    const totalChars = text.length;
    const totalItem = document.createElement('li');
    totalItem.textContent = `Total characters: ${totalChars}`;
    insights.appendChild(totalItem);
    
    // Calculate letter to total ratio
    const letterToTotalRatio = uppercaseCount / totalChars;
    const ratioItem = document.createElement('li');
    ratioItem.textContent = `Letter to total ratio: ${(letterToTotalRatio * 100).toFixed(2)}%`;
    insights.appendChild(ratioItem);
    
    // Most common letter
    const frequency = analyzeFrequency(text);
    const mostCommonLetter = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
    if (mostCommonLetter && mostCommonLetter[1] > 0) {
      const commonLetterItem = document.createElement('li');
      commonLetterItem.textContent = `Most common letter: ${mostCommonLetter[0]} (appears ${mostCommonLetter[1]} times)`;
      insights.appendChild(commonLetterItem);
      
      // In English, 'E' is the most common letter, so if the most common is 'X', 
      // suggest a shift of (X-E) in the Caesar cipher
      const possibleShift = (mostCommonLetter[0].charCodeAt(0) - 'E'.charCodeAt(0) + 26) % 26;
      if (possibleShift > 0) {
        const shiftItem = document.createElement('li');
        shiftItem.innerHTML = `<strong>Possible Caesar shift: ${possibleShift} (if the text is English)</strong>`;
        insights.appendChild(shiftItem);
        
        // Show potential decryption based on this shift
        const decryptItem = document.createElement('li');
        decryptItem.innerHTML = `<strong>Potential decryption:</strong> ${caesarDecrypt(text, possibleShift)}`;
        insights.appendChild(decryptItem);
      }
    }
    
    insightsSection.appendChild(insights);
    bfResults.appendChild(insightsSection);
    
    // If emoji analysis is enabled
    if (includeEmoji) {
      const emojiSection = document.createElement('div');
      emojiSection.className = 'emoji-analysis';
      
      const emojiTitle = document.createElement('h4');
      emojiTitle.textContent = '🎭 Emoji Analysis';
      emojiSection.appendChild(emojiTitle);
      
      const emojiDescription = document.createElement('p');
      emojiDescription.textContent = 'Here\'s what your text might look like if it uses emoji substitution:';
      emojiSection.appendChild(emojiDescription);
      
      const emojiText = document.createElement('div');
      emojiText.className = 'emoji-text';
      emojiText.textContent = textToEmoji(text);
      emojiSection.appendChild(emojiText);
      
      bfResults.appendChild(emojiSection);
    }
  }
  
  // Analyze common patterns in text
  function analyzePatterns(text) {
    const patternsSection = document.createElement('div');
    patternsSection.className = 'analysis-section';
    
    const patternsTitle = document.createElement('h4');
    patternsTitle.textContent = 'Common Patterns';
    patternsSection.appendChild(patternsTitle);
    
    // Find repeating patterns (2-3 letters)
    const patterns = {};
    
    // Check for 2-letter patterns
    for (let i = 0; i < text.length - 1; i++) {
      const pattern = text.substring(i, i + 2);
      if (/^[A-Z]{2}$/.test(pattern)) {
        patterns[pattern] = (patterns[pattern] || 0) + 1;
      }
    }
    
    // Check for 3-letter patterns
    for (let i = 0; i < text.length - 2; i++) {
      const pattern = text.substring(i, i + 3);
      if (/^[A-Z]{3}$/.test(pattern)) {
        patterns[pattern] = (patterns[pattern] || 0) + 1;
      }
    }
    
    // Filter patterns that appear more than once
    const commonPatterns = Object.entries(patterns)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Take top 10
    
    if (commonPatterns.length > 0) {
      const patternsList = document.createElement('ul');
      patternsList.className = 'patterns-list';
      
      commonPatterns.forEach(([pattern, count]) => {
        const patternItem = document.createElement('li');
        patternItem.innerHTML = `"<strong>${pattern}</strong>" appears ${count} times`;
        
        // Highlight common English digraphs/trigraphs
        const commonEnglishPatterns = ['TH', 'HE', 'IN', 'ER', 'AN', 'RE', 'THE', 'AND', 'ING', 'ENT'];
        if (commonEnglishPatterns.includes(pattern)) {
          patternItem.className = 'common-english-pattern';
          patternItem.innerHTML += ' <span class="badge">Common in English</span>';
        }
        
        patternsList.appendChild(patternItem);
      });
      
      patternsSection.appendChild(patternsList);
      
      // Add note about patterns
      const patternNote = document.createElement('p');
      patternNote.className = 'info-text';
      patternNote.textContent = 'Common patterns can help identify substitution ciphers. In English, "TH", "HE", "IN", "ER" are frequent digraphs.';
      patternsSection.appendChild(patternNote);
    } else {
      const noPatterns = document.createElement('p');
      noPatterns.textContent = 'No common patterns found.';
      patternsSection.appendChild(noPatterns);
    }
    
    bfResults.appendChild(patternsSection);
  }
  
  // Validate brute force input
  function validateBruteForceInput() {
    let isValid = true;
    
    // Validate text input
    if (!bfText.value.trim()) {
      document.getElementById('bf-text-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('bf-text-error').style.display = 'none';
    }
    
    return isValid;
  }
  
  // Helper function - Caesar cipher decrypt for brute force
  function caesarDecrypt(text, shift) {
    // Ensure shift is in range 1-25
    shift = ((shift % 26) + 26) % 26;
    
    return text.replace(/[A-Z]/g, function(char) {
      // Get the ASCII code
      const code = char.charCodeAt(0);
      
      // Decrypt the uppercase letter
      return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
    });
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
