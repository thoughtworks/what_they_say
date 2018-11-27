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

var increaseButton = document.getElementById('wts-increase-line-img');
var decreaseButton = document.getElementById('wts-decrease-line-img');
var numberLabel = document.getElementById('wts-menu-input-number')
var numberHeight = 40

var version = document.getElementById('version')
var transcriptionButton = new TranscriptionButtonStatus()

// - on load -

document.getElementById('history').onclick = sendHistoryMessageTab;
playButton.onclick = didTapTranscriptionButton;
stopButton.onclick = didTapStopButton;
increaseButton.onclick = didTapIncreaseButton;
decreaseButton.onclick = didTapDecreaseButton;


window.addEventListener("DOMContentLoaded", function() {
  viewLoadSetup()
}, false);

// - functions -

function viewLoadSetup() {
  version.textContent += chrome.runtime.getManifest().version
  loadButtonStatus()
  loadLanguageSelection()
  loadHeightContainer()
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

function loadHeightContainer() {
  chrome.storage.local.get(["numberHeight"], function (response) {
    if (response.numberHeight) {
      console.log(response)
      numberHeight = response.numberHeight
      numberLabel.textContent = (numberHeight/20).toString() 
    }
  });
}

function saveNumberHeight() {
  localStorage.get("numberHeight", function(response) {
    numberHeight =  response.numberHeight == null ? 40 : response.numberHeight
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
  console.log("cliquei")
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

function saveNumberHeight() {
  localStorage.save({numberHeight : numberHeight}, function(){})
}

function didTapStopButton() {

  if (!transcriptionButton.action) {
    updateTranscriptionButton()
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, {});
  });
}

function didTapIncreaseButton() {
  
  if (numberHeight <= 200) {
    numberHeight += 20
  }

  saveNumberHeight()
  numberLabel.textContent = (numberHeight / 20).toString()

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "increase"}, {});
  });
}

function didTapDecreaseButton() {
  if (numberHeight >= 60) {
    numberHeight -= 20
  }

  saveNumberHeight()
  numberLabel.textContent = (numberHeight / 20).toString()

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "decrease"}, {});
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request)
  }
);

// analytics

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-129965429-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();