document.getElementById('transcription').onclick = sendMessageTab;
document.getElementById('history').onclick = sendHistoryMessageTab;
document.getElementById('stop').onclick = sendStopMessageTab;
var lines = document.getElementById('lines-display-input-field')

function sendMessageTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var displayLines = lines.value

    chrome.tabs.sendMessage(tabs[0].id, {action: "transcription", lines: displayLines}, {});
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

