// - properties -

var actionButton = document.getElementById('transcription');
var version = document.getElementById('version')
var languageSelectBox
var startTranscription = true
const localStorage = new LocalStorage(chrome)
const language = new Language("")

// - on load -

actionButton.onclick = sendStartStopTranscriptionMessageTab;
document.getElementById('history').onclick = sendHistoryMessageTab;

window.addEventListener("DOMContentLoaded", function() {
  version.textContent += chrome.runtime.getManifest().version
  languageSelectBox = document.getElementById('language-select')
  languageSelectBox.addEventListener("change", changeLanguage, false)
  loadButtonStatus()
  loadLanguageSelection()
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
  language.language = languageSelectBox.value
  saveLanguageStatus(language)
}

function saveLanguageStatus(language) {
  localStorage.save(language, function(){})
}

function saveClosedButtonStatus(status) {
  chrome.storage.local.set({"status": status}, function(){});
}

function loadLanguageSelection() {
  chrome.storage.local.get(["language"], function(language) {
    console.log(language)
      languageSelectBox.value = language.language
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