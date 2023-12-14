// popup.js
document.addEventListener("DOMContentLoaded", function() {
    const startAutomationButton = document.getElementById("startAutomation");
  
    startAutomationButton.addEventListener("click", function() {
      const numTickets = document.getElementById("numTickets").value;
      const timeToReload = document.getElementById("timeToReload").value;
      const zone = document.getElementById("zone").value;
  
      chrome.runtime.sendMessage({
        action: "startAutomation",
        numTickets: numTickets,
        timeToReload: timeToReload,
        zone: zone,

      });
    });
  });
  