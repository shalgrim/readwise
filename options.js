// Options script for Readwise Chrome Extension
// Handles API key storage and retrieval

document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  
  // Check if API key exists and show status
  chrome.storage.sync.get(['readwiseApiKey'], function(result) {
    if (result.readwiseApiKey) {
      document.getElementById('apiKeyStatus').style.display = 'block';
    }
  });
  
  // Save API key
  saveBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter your API token', 'error');
      return;
    }
    
    // Basic validation - Readwise tokens are typically 40 characters
    if (apiKey.length < 20) {
      showStatus('API token appears to be too short. Please check your token.', 'error');
      return;
    }
    
    // Save to Chrome storage
    chrome.storage.sync.set({
      readwiseApiKey: apiKey
    }, function() {
      if (chrome.runtime.lastError) {
        showStatus('Error saving API token: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('API token saved successfully!', 'success');
      }
    });
  });
  
  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
    
    // Hide status after 3 seconds
    setTimeout(function() {
      status.style.display = 'none';
    }, 3000);
  }
});