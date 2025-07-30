// Background script for Readwise Chrome Extension
// Sets up context menu and handles right-click events

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToReadwise",
    title: "Send to Readwise",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToReadwise") {
    // Get page info from content script
    chrome.tabs.sendMessage(tab.id, {action: 'getPageInfo'}, (response) => {
      if (response) {
        // Store the data for the popup to access
        chrome.storage.local.set({
          pageData: {
            selectedText: response.selectedText,
            pageTitle: response.pageTitle,
            pageUrl: response.pageUrl,
            author: response.author
          }
        });
        
        // Open popup window
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: 400,
          height: 650
        });
      }
    });
  }
});