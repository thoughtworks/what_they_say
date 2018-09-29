document.getElementById('generate').onclick = sendMessageTab;
document.getElementById('history').onclick = sendHistoryMessageTab;

function sendMessageTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "generate"}, {});
  });
}

function sendHistoryMessageTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "history"}, {});
    });
}

