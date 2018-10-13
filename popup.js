document.getElementById('transcription').onclick = sendMessageTab;
document.getElementById('history').onclick = sendHistoryMessageTab;
document.getElementById('stop').onclick = sendStopMessageTab;

function sendMessageTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "transcription"}, {});
  });
}

function sendHistoryMessageTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "history"}, {});
    });
}

function sendStopMessageTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, {});
  });
}