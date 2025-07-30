// Popup script for Readwise Chrome Extension
// Handles the popup form interactions and API calls

document.addEventListener('DOMContentLoaded', function() {
  // Load page data from storage
  chrome.storage.local.get(['pageData'], function(result) {
    if (result.pageData) {
      const data = result.pageData;
      document.getElementById('selectedText').value = data.selectedText || '';
      document.getElementById('title').value = data.pageTitle || '';
      document.getElementById('author').value = data.author || '';
      document.getElementById('sourceUrl').value = data.pageUrl || '';
    }
  });
  
  // Handle form submission
  document.getElementById('readwiseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sendBtn = document.getElementById('sendBtn');
    const originalText = sendBtn.textContent;
    
    // Disable button and show loading state
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    // Get form data
    const tagsInput = document.getElementById('tags').value;
    const noteInput = document.getElementById('note').value;
    
    // Format tags and note according to Readwise format
    let finalNote = '';
    if (tagsInput.trim()) {
      const formattedTags = tagsInput.split(',')
        .map(tag => '.' + tag.trim().replace(/\s+/g, '-'))
        .filter(tag => tag.length > 1)
        .join(' ');
      finalNote = formattedTags;
      
      if (noteInput.trim()) {
        finalNote += '\n' + noteInput.trim();
      }
    } else if (noteInput.trim()) {
      finalNote = noteInput.trim();
    }
    
    const highlight = {
      text: document.getElementById('selectedText').value,
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      source_url: document.getElementById('sourceUrl').value,
      note: finalNote || undefined,
      category: 'articles'
    };
    
    // Get API key and send to Readwise
    chrome.storage.sync.get(['readwiseApiKey'], function(result) {
      if (!result.readwiseApiKey) {
        alert('Please set your Readwise API token in the extension options first.');
        sendBtn.disabled = false;
        sendBtn.textContent = originalText;
        return;
      }
      
      sendToReadwise(highlight, result.readwiseApiKey, sendBtn, originalText);
    });
  });
  
  function sendToReadwise(highlight, apiKey, sendBtn, originalText) {
    const payload = {
      highlights: [highlight]
    };
    
    fetch('https://readwise.io/api/v2/highlights/', {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save to Readwise: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Successfully sent to Readwise:', data);
      window.close();
    })
    .catch(error => {
      console.error('Error sending to Readwise:', error);
      alert('Error sending to Readwise: ' + error.message);
      sendBtn.disabled = false;
      sendBtn.textContent = originalText;
    });
  }
  
  // Handle cancel button
  document.getElementById('cancelBtn').addEventListener('click', function() {
    window.close();
  });
});