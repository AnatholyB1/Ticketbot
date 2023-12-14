// service-worker.js

chrome.runtime.onInstalled.addListener(function() {
    console.log("TicketBot extension installed.");
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "startAutomation") {
        chrome.windows.getCurrent(function(currentWindow) {
            chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(tabs) {
                if (tabs.length == 0) {
                    return;
                }
                if(!tabs[0].url.includes("www.allticket.com")) {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icon.png', // Replace with your extension's icon
                        title: 'TicketBot',
                        message: 'Please navigate to https://www.allticket.com/ before clicking the extension button.'
                    });
                    return;
                }
                chrome.storage.local.set({"zoneId" : request.zone})
                chrome.storage.local.set({"ticket": request.numTickets})
                startAutomation(tabs[0].id, request.timeToReload);
            });
        });
    }
});

var reloaded = false

function startAutomation(tabId, timeToReload) {
    // Split the input time into hours and minutes
    var timeParts = timeToReload.split(":");
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    // Create a Date object for the current date
    var now = new Date();
    var targetTime = new Date();

    // Set the hours, minutes, seconds, and milliseconds of the target time
    targetTime.setHours(hours);
    targetTime.setMinutes(minutes);
    targetTime.setSeconds(0,0)

    // If the target time is in the past, add 24 hours to it
    if (targetTime < now) {
        targetTime.setTime(targetTime.getTime() + 24 * 60 * 60 * 1000);
    }
    // Start an interval that checks every 10 milliseconds if the current time is past the target time
    var intervalId = setInterval(function() {
        console.log(new Date().getTime(), targetTime.getTime())
        if (new Date().getTime() >= targetTime.getTime()) { 
            // If the current time is past the target time, reload the page and clear the interval
            reloaded = true
            chrome.tabs.reload(tabId);
            clearInterval(intervalId);
        }
    }, 200);
}

function clickBuyNowButton() {
    // Start an interval that checks every 100 milliseconds if the "BUY NOW" button is available
    var intervalId = setInterval(function() {
        // Find the "BUY NOW" button
        var buttons = document.getElementsByClassName("btn-atk-primary");
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].innerHTML == "BUY NOW") {
                // If the "BUY NOW" button is available, click it and clear the interval
                buttons[i].click();
                var acceptConsent = document.getElementById("acceptConsent");
                if (acceptConsent) {
                    acceptConsent.checked = true;
                }
                var acceptbutton = document.getElementsByClassName("btn-accept")
                if(acceptbutton)
                {
                    acceptbutton[0].click()
                }
                var interval2 = setInterval(function() {
                    var checkSeat = document.getElementsByClassName("btn-outline-info")
                    if(checkSeat[0])
                    {
                        
                        checkSeat[0].click()
                        var interval3 = setInterval(function() {
                            var zones = document.getElementsByClassName("badge-light")
                            if(zones[0])
                            {
                                var zonesArray = Array.from(zones);
        
                                chrome.storage.local.get("zoneId", function(result){
                                    var rightZone = zonesArray.find(function(z) {
                                        if(z.innerHTML.toLowerCase() ==  result.zoneId.toLowerCase())
                                        {
                                            return z
                                        }
                                    });
                                    if(rightZone)
                                    {
                                        rightZone.click()
                                        var interval4 = setInterval(function() {
                                            chrome.storage.local.get("ticket", function(result){
                                                var seats = document.getElementsByClassName("available")
                                                if(seats[0])
                                                {
                                                    for (var i=0; i<result.ticket;i++)
                                                    {
                                                        seats[i].parentElement.click()
                                                    }
                                                    
                                                }
                                                var booking = document.getElementsByClassName("btn-book")
                                                if(booking[0])
                                                {
                                                    booking[0].click()
                                                    clearInterval(interval4)
                                                }
                                                
                                            })
                                        })
                                        
                                    }
                                    clearInterval(interval3)
                                })
                                
                            }
                        },100)
                        clearInterval(interval2)
                    }
                },100)

                reloaded = false
                clearInterval(intervalId);
                break;
            }
        }
    }, 100);
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
    
    if (changeInfo.status == 'complete'  && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && reloaded) {
        // After the page is reloaded, click the "BUY NOW" button
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: clickBuyNowButton
        });
    }
});

