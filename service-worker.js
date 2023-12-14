// service-worker.js
chrome.runtime.onInstalled.addListener(function() {
    console.log("TicketBot extension installed.");
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "startAutomation") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log(tabs)
        if (tabs.length == 0) {
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "startAutomation",
          numTickets: request.numTickets,
          refreshInterval: request.refreshInterval
        });
      });
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "startAutomation") {
        console.log("Automation started")
      // Your ticket purchasing automation logic here
      // Use Puppeteer or similar libraries to interact with the webpage
    }
  });


  