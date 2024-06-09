// options.js
document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("saveButton");
  const speedInput = document.getElementById("speedInput");
  const toggleButton = document.getElementById("toggleButton");

  // Load saved speed preference
  chrome.storage.sync.get(["speed"], function (result) {
    speedInput.value = result.speed || "1.5";
  });

  // Load saved toggle state
  chrome.storage.sync.get(["toggleState"], function (result) {
    if (result.toggleState) {
      toggleButton.textContent = "Disable";
    } else {
      toggleButton.textContent = "Enable";
    }
  });

  // Save speed preference when save button is clicked
  saveButton.addEventListener("click", function () {
    const speed = speedInput.value;
    chrome.storage.sync.set({ speed: speed }, function () {
      console.log("Speed preference saved: " + speed);
      chrome.runtime.sendMessage({ type: "successMessage" });
    });
  });

  // Toggle pause/resume feature
  // TODO: Not working
  toggleButton.addEventListener("change", function () {
    chrome.storage.sync.set({ pauseResumeEnabled: toggleButton.checked });
  });
});
