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
    
    const formData = {
      text: document.getElementById('selectedText').value,
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      source_url: document.getElementById('sourceUrl').value,
      note: document.getElementById('note').value,
      tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    // TODO: Send to Readwise API
    console.log('Sending to Readwise:', formData);
    
    // For now, just close the popup
    window.close();
  });
  
  // Handle cancel button
  document.getElementById('cancelBtn').addEventListener('click', function() {
    window.close();
  });
});