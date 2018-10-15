var actionButton = document.getElementById('transcription');
actionButton.onclick = sendMessageTab;

var startTranscription = true
document.getElementById('history').onclick = sendHistoryMessageTab;
//document.getElementById('stop').onclick = sendStopMessageTab;


function sendMessageTab() {

  var iclass, text;
  if (startTranscription == false) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, {});
    });
    
    actionButton.textContent = ""
    actionButton.className = "start"
    
    iclass = 'fa fa-closed-captioning'

    text = document.createTextNode("Transcription"); 
  
  } else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "transcription"}, {});
    });

    actionButton.textContent = ""
    actionButton.className = "stop"
    
    iclass = 'fa fa-stop';
    
    text = document.createTextNode("Stop"); 
      
  }

  var i = document.createElement('I');
  i.className = iclass;
  actionButton.appendChild(i);
  actionButton.appendChild(text);


  startTranscription = !startTranscription
  
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