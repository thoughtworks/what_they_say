const localStorage = new ChromeProvider(chrome)
const language = new Language("")

var bkg = chrome.extension.getBackgroundPage();

// - properties -

var playButton = document.getElementById('play-circle-transcription');
var playTitle = document.getElementById('play-title-transcription');

var stopButton = document.getElementById('stop-circle-transcription');
var stopTitle = document.getElementById('stop-title-transcription');

var recordButton = document.getElementById('record-circle-transcription');
var recordTitle = document.getElementById('record-title-transcription');

var version = document.getElementById('version')
var transcriptionButton = new TranscriptionButtonStatus()

// - on load -

document.getElementById('history').onclick = sendHistoryMessageTab;
playButton.onclick = didTapTranscriptionButton;
stopButton.onclick = didTapStopButton;

window.addEventListener("DOMContentLoaded", function() {
  viewLoadSetup()
}, false);

// - functions -

function viewLoadSetup() {
  version.textContent += chrome.runtime.getManifest().version
  loadButtonStatus()
  loadLanguageSelection()
}

function loadLanguageSelection() {
  localStorage.get("language", function(language) {
    buildCustomSelectLanguage(language)
  })
}

function loadButtonStatus() {
  localStorage.get("action", function(response) {
    transcriptionButton.action =  response.action == null ? true : response.action
    setTranscriptionButtonSkin()
  })
}

function setTranscriptionButtonSkin() {
  if (!transcriptionButton.action) {
    playButton.classList.remove("play-circle-start");
    playButton.classList.add("play-circle-pause")
    playTitle.textContent = "Pause"
    bkg.setTimer(true)
  } else {
    bkg.setTimer(false)
    recordTitle.textContent = "00:00"
    playButton.classList.remove("play-circle-pause");
    playButton.classList.add("play-circle-start")
    playTitle.textContent = "Start"
  }
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
  return transcriptionButton.action ? "start" : "pause"
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

function saveLanguageStatus(language) {
  localStorage.save(language, function(){})
}

function saveTranscriptionButtonAction() {
  localStorage.save(transcriptionButton, function(){})
}

function didTapStopButton() {

  if (!transcriptionButton.action) {
    updateTranscriptionButton()
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, {});
  });
}

// timer

var responsetimer = setInterval(function(){
  time = bkg.time
  var displaySeconds = time.s
  var displayMinutes = time.m

  if (time.s < 10) {
    displaySeconds = "0" + time.s.toString()
  }

  if (time.m < 10) {
    displayMinutes = "0" + time.m.toString()
  }

  var newTime =  displayMinutes + ":" + displaySeconds;
  recordTitle.textContent = newTime
}, 1000);

