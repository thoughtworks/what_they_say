// - properties -

var actionButton = document.getElementById('transcription');
var language
var startTranscription = true

// - on load -

actionButton.onclick = sendStartStopTranscriptionMessageTab;
document.getElementById('history').onclick = sendHistoryMessageTab;

window.addEventListener("DOMContentLoaded", function() {
  language = document.getElementById('language-select')
  language.addEventListener("change", changeLanguage, false)
  loadButtonStatus()
  getLanguageSelection()
}, false);

// - functions -

function sendStartStopTranscriptionMessageTab() {

  if (startTranscription == false) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, {});
    });
  
  } else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "transcription"}, {});
    });
  }

  startTranscription = !startTranscription
  setTranscriptionButton()
  saveClosedButtonStatus(startTranscription)
  
  if (!startTranscription) {
    window.close();
  }
}

function sendHistoryMessageTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "history"}, {});
    });
}

function changeLanguage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"language": language.value}, {});
    saveLanguageStatus(language)
  });
}

function saveLanguageStatus(language) {
  chrome.storage.local.set({ "language": language.value }, function(){});
}

function saveClosedButtonStatus(status) {
  chrome.storage.local.set({"status": status}, function(){});
}

function getLanguageSelection() {
  chrome.storage.local.get(["language"], function(languageName){
      language.value = languageName.language
  });
}

function loadButtonStatus() {
  chrome.storage.local.get(["status"], function(status) {
    var tempStatus = false

    if (status) {
      tempStatus = status.status
    }
    startTranscription = tempStatus
    setTranscriptionButton()
  });
}

function setTranscriptionButton() {
  var i,text,iclass

  if (!startTranscription) {
    actionButton.textContent = ""
    actionButton.className = "stop"
    
    iclass = 'fa fa-stop';
    i = document.createElement('I');
    text = document.createTextNode("Stop"); 
    i.className = iclass;
  } else {
    actionButton.textContent = ""
    actionButton.className = "start"
    
    iclass = 'fa fa-closed-captioning'
    i = document.createElement('I');
    text = document.createTextNode("Transcription"); 
    i.className = iclass;
  }

  actionButton.appendChild(i);
  actionButton.appendChild(text);
}