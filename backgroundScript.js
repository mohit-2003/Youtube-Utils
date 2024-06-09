// backgroundScript.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "speedChange") {
    chrome.storage.sync.set({ speed: message.speed });
  }
});

// Function to send message to content script to pause video
function pauseVideoIfNotVisible() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.url && tab.url.includes("youtube.com")) {
      chrome.tabs.sendMessage(tab.id, { type: "pauseVideo" });
    }
  });
}

// Listen for tab activation events
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.url && tab.url.includes("youtube.com")) {
      chrome.tabs.sendMessage(tab.id, { type: "resumeVideo" });
    } else {
      pauseVideoIfNotVisible();
    }
  });
});
