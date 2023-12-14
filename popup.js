// popup.js
document.addEventListener("DOMContentLoaded", function() {
    const startAutomationButton = document.getElementById("startAutomation");
  
    startAutomationButton.addEventListener("click", function() {
      const numTickets = document.getElementById("numTickets").value;
      const refreshInterval = document.getElementById("refreshInterval").value;
  
      chrome.runtime.sendMessage({
        action: "startAutomation",
        numTickets: numTickets,
        refreshInterval: refreshInterval
      });
    });
  });
  