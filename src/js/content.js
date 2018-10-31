//setup

var historyTranscription = ""
var recognition = new webkitSpeechRecognition();
var isStopRecognized = false
var languague = getLanguageSelection()
var div = document.createElement('div');
var youtubeDiv = document.createElement('div');
var isFullScreen = false
var youtuberContainer

const transcriptionClass = "transcription-container"

setup()

//listeners

document.addEventListener('webkitfullscreenchange', setFullScreenHandler, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action == "start") {
      isStopRecognized = false
      startRecognition();
    } else if (request.action == "history") {
      generatePDF();
    } else if (request.action == "stop") {
      isStopRecognized = true
      recognition.stop();
    } else if (request.language) {
      recognition.lang = request.language;
    }
});

//callback recognition

recognition.onresult = function(event) {
  console.log("speech start")
  var sentence = makeASentence(event);
  addTranscriptionToHistory(event)
  makeClosedCaption(sentence)
} 

recognition.onspeechend = function() {
  console.log('Speech has stopped being detected');
}

recognition.onend = function(event) {
  if (!isStopRecognized) {
    startRecognition()
  } else {
    recognition.stop()
    removeTranscriptionContainer()
  }
}

recognition.onerror = function(event) {
  isStopRecognized = true
  recognition.stop();
  console.log("error happens click to transcription again")
  console.log(event.error);
}

//functions

function setup() {
  setupRecognition(recognition)
  addClass(div,transcriptionClass)
  setYoutubeDivStyle()
  setLanguague()
}

function startRecognition() {
  setLanguague()
  recognition.start();
}

function addTranscriptionToHistory(event) {
  var totalSentence = ""
  var results = event.results

  for (i=0; i<results.length; i++) {
    if (results[i][0].confidence > 0.8 && results[i].isFinal ) {
      totalSentence += results[i][0].transcript
      totalSentence += " "
    }
  }

  historyTranscription += totalSentence
}

function makeASentence(event) {
  var partialSentence = ""
  var results = event.results

  for (i=0; i<results.length; i++) {
    if (results[i][0].confidence > 0.8) {
      partialSentence += results[i][0].transcript
    }
  }

  return partialSentence
}

  function setYoutubeDivStyle() {
    var height = window.innerHeight * 0.9
    youtubeDiv.classList.add("transcription-container");
    youtubeDiv.classList.add("transcription-container-fullscreen");
    youtubeDiv.style.top = height.toString() + "px"
  }

function generatePDF() {
  var doc = new jsPDF('p', 'in', 'letter'),
    sizes = [12, 16, 20],
    fonts = [['Helvetica', '']],
    font, size, lines,
    margin = 0.5, 
    verticalOffset = margin


  for (var i in fonts) {
    if (fonts.hasOwnProperty(i)) {
      font = fonts[i]
      size = sizes[i]

      lines = doc.setFont(font[0], font[1])
        .setFontSize(size)
        .splitTextToSize(historyTranscription, 7.5)

      doc.text(0.5, verticalOffset + size / 72, lines)

      verticalOffset += (lines.length + 0.5) * size / 72
    }
  }
  doc.save('a4.pdf')
}

function makeClosedCaption(text) {
  div.textContent = text;
  youtubeDiv.textContent = text
  if (isFullScreen) {
    setYoutubeFullScreenCaptions()
  } else {
    document.body.appendChild(div);
  }
}

function getLanguageSelection() {
  chrome.storage.local.get(["language"], function(languageName) {
      return languageName.language
  });
}

function setFullScreenHandler() {
    if (document.webkitIsFullScreen === true) {
      isFullScreen = true
    } else if (document.webkitIsFullScreen === false) {
      isFullScreen = false
    }
}

function setYoutubeFullScreenCaptions() {
    youtuberContainer = document.getElementsByClassName("html5-video-container")

    if (youtuberContainer) {
      youtuberContainer[0].appendChild(youtubeDiv);
    }
}

function setLanguague() {
  chrome.storage.local.get(["language"], function(languageName) {
    recognition.lang = getCurrentLanguague(languageName.language);
  });
}

function removeTranscriptionContainer() {
  if(document.body.contains(div)) {
    document.body.removeChild(div)
  }
  if (youtuberContainer && youtuberContainer.contains(youtubeDiv)) {
    youtuberContainer.removeChild(youtubeDiv)
  }
}