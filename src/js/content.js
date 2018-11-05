//setup

var recognition = new webkitSpeechRecognition();
var isStopRecognized = false
var languague = getLanguageSelection()
var div = document.createElement('div');
var youtubeDiv = document.createElement('div');
var isFullScreen = false
var youtuberContainer
var lastTranscription = ""
var fullTranscription = ""
var wtkRecognition

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

  if (!wtkRecognition ) {
    wtkRecognition = new WTKRecognition()
  }

  makeClosedCaption(wtkRecognition.makeASentenceAndPutOnHistory(event))
} 

recognition.onspeechend = function() {
  console.log('Speech has stopped being detected');
}

recognition.onend = function(event) {
  if (!isStopRecognized) {
    startRecognition()
  } else {
    recognition.stop()
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
  addJsModule()
  setupRecognition(recognition)
  addClass(div,transcriptionClass)
  setYoutubeDivStyle()
  setLanguague()
}

function startRecognition() {
  setLanguague()
  recognition.start();
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
        .splitTextToSize(wtkRecognition.history, 7.5)

      doc.text(0.5, verticalOffset + size / 72, lines)

      verticalOffset += (lines.length + 0.5) * size / 72
    }
  }
  doc.save('a4.pdf')
}

function makeClosedCaption(text) {
  if (document.body.contains(div)) {
    console.log(lastTranscription)
    console.log(text)
    var newTranscription = groupInterimTranscription(lastTranscription, text)
    lastTranscription = text
    div.textContent += newTranscription;

    if (div.scrollHeight > div.offsetHeight) {
      div.scrollTop += 20 
    }


  } else {
    div.textContent = text
    document.body.appendChild(div)
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

function addJsModule() {
  const script = document.createElement('script');
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL('src/js/model/wtkRecognition.js'));
  const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  head.insertBefore(script, head.lastChild);
}