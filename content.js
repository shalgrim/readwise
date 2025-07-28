// Content script for Readwise Chrome Extension
// Handles text selection and communicates with background script

let selectedText = '';

// Listen for text selection
document.addEventListener('mouseup', function() {
  selectedText = window.getSelection().toString().trim();
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    sendResponse({
      selectedText: selectedText,
      pageTitle: document.title,
      pageUrl: window.location.href,
      author: window.location.hostname
    });
  }
});