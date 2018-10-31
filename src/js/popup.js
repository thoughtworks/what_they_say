// - properties -

var actionButton = document.getElementById('transcription');
var version = document.getElementById('version')
var languageSelectBox
const localStorage = new LocalStorage(chrome)
const language = new Language("")
var transcriptionButton = new TranscriptionButtonStatus()

// - on load -

actionButton.onclick = didTapTranscriptionButton;
document.getElementById('history').onclick = sendHistoryMessageTab;

window.addEventListener("DOMContentLoaded", function() {
  viewLoadSetup()
}, false);

// - functions -

function viewLoadSetup() {
  version.textContent += chrome.runtime.getManifest().version
  languageSelectBox = document.getElementById('language-select')
  languageSelectBox.addEventListener("change", changeLanguage, false)
  loadButtonStatus()
  loadLanguageSelection()
}

function loadLanguageSelection() {
  localStorage.get("language", function(language) {
    languageSelectBox.value = language.language
  })
}

function loadButtonStatus() {
  localStorage.get("action", function(response) {
    transcriptionButton.action =  response.action == null ? true : response.action
    setTranscriptionButtonSkin()
  })
}

function setTranscriptionButtonSkin() {
  var i,text,iclass

  if (!transcriptionButton.action) {
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

function didTapTranscriptionButton() {
  sendStartStopTranscriptionMessageContent()
  updateTranscriptionButton()
  closePopUpIfTranscriptionClicked()
}

function sendStartStopTranscriptionMessageContent() {
  var action =  getMessageActionButton()
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {"action" : action}, {});
    });
}

function getMessageActionButton() {
  return transcriptionButton.action ? "start" : "stop"
}

function updateTranscriptionButton() {
  transcriptionButton.action = !transcriptionButton.action
  setTranscriptionButtonSkin()
  saveTranscriptionButtonAction()
}

function closePopUpIfTranscriptionClicked() {
  if (!transcriptionButton.action) {
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

function saveTranscriptionButtonAction() {
  localStorage.save(transcriptionButton, function(){})
}