// contentScript.js
chrome.storage.sync.get(["speed"], function (result) {
  const video = document.querySelector("video");
  const title = document.title.toLowerCase();

  // Function to check if the page is playing content that should be watched at normal speed
  function shouldWatchAtNormalSpeed(title) {
    const normalSpeedKeywords = [
      "song",
      "music",
      "album",
      "movie",
      "film",
      "trailer",
      "comedy",
      "show",
    ];
    return normalSpeedKeywords.some((keyword) => title.includes(keyword));
  }

  if (video) {
    if (!shouldWatchAtNormalSpeed(title)) {
      video.playbackRate = parseFloat(result.speed) || 1.5;
      showSnackbar(
        "Video speed set to " + (parseFloat(result.speed) || 1.5) + "x"
      );
    }
  }
});

// Function to show snackbar
function showSnackbar(message) {
  const snackbar = document.createElement("div");
  snackbar.textContent = message;
  snackbar.style.backgroundColor = "#4CAF50";
  snackbar.style.color = "white";
  snackbar.style.position = "fixed";
  snackbar.style.top = "60px"; // Adjusted top position
  snackbar.style.right = "20px";
  snackbar.style.padding = "20px";
  snackbar.style.borderRadius = "10px";
  snackbar.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  snackbar.style.zIndex = "1000";
  snackbar.style.opacity = "0";
  snackbar.style.transition = "opacity 0.5s ease";
  snackbar.style.fontSize = "16px"; // Increased font size

  document.body.appendChild(snackbar);

  setTimeout(() => {
    snackbar.style.opacity = "1";
    setTimeout(() => {
      snackbar.style.opacity = "0";
      setTimeout(() => {
        snackbar.remove();
      }, 500);
    }, 3000);
  }, 100);
}

// Listen for messages from options page
chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === "successMessage") {
    showSnackbar("Preference saved successfully!");
  }
});

// contentScript.js
let video = document.querySelector("video");
let videoWasPlaying = false;

// Function to check if the current tab is visible
function isTabVisible() {
  return !document.hidden;
}

// Function to pause video if tab is not visible
function pauseVideoIfNotVisible() {
  if (video && !isTabVisible()) {
    video.pause();
    videoWasPlaying = !video.paused;
  }
}

// Function to resume video if tab becomes visible again
function resumeVideoIfVisible() {
  if (video && video.paused) {
    video.play();
    videoWasPlaying = false; // Reset the flag
  }
}

// Listen for visibility change events
document.addEventListener("visibilitychange", () => {
  if (!isTabVisible()) {
    pauseVideoIfNotVisible();
  } else {
    resumeVideoIfVisible();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === "pauseVideo") {
    pauseVideoIfNotVisible();
  } else if (message.type === "resumeVideo") {
    resumeVideoIfVisible();
  }
});

// Listen for messages from options page to toggle pause/resume feature
chrome.storage.sync.get("pauseResumeEnabled", function (result) {
  if (result.pauseResumeEnabled !== false) {
    chrome.runtime.sendMessage({ type: "resumeVideo" });
  }
});

// Listen for video element creation in case it was not present initially
const observer = new MutationObserver(() => {
  video = document.querySelector("video");
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
