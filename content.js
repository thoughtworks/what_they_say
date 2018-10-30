//setup

var showMaxSpeeches = 10
var wholeText = ""
var recognition = new webkitSpeechRecognition();
var isStopRecognized = false
var languague = getLanguageSelection()
var div = document.createElement('div');
var youtubeDiv = document.createElement('div');
var isFullScreenYoutube = false
var youtuberContainer


recognition.continuous = false;
recognition.interimResults = true;

setDivStyle();
setYoutubeDivStyle()
setLanguague()

//listeners

document.addEventListener('webkitfullscreenchange', enterFullScreenHandler, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action == "transcription") {
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
  makeClosedCaption(sentence)
} 

recognition.onspeechend = function() {
  console.log('Speech has stopped being detected');
}

recognition.onend = function(event) {
  if (!isStopRecognized) {
    recognition.start();
  } else {
    recognition.stop()
    if(document.body.contains(div)){
      document.body.removeChild(div);
    }
    if (youtuberContainer.contains(youtubeDiv)) {
      youtuberContainer.removeChild(youtubeDiv)
    }
  }
}

recognition.onerror = function(event) {
  isStopRecognized = true
  recognition.stop();
  console.log("error happens click to transcription again")
  console.log(event.error);
}

//functions

function startRecognition() {
  recognition.start();
}

function makeASentence(event) {
  var partialSentence = ""
  var totalSentence = ""
  var results = event.results

  for (i=0; i<results.length; i++) {
    if (results[i][0].confidence > 0.8 && results[i].isFinal ) {
      totalSentence += results[i][0].transcript
      totalSentence += " "
    }
  }

  for (i=0; i<results.length; i++) {
    if (results[i][0].confidence > 0.8) {
      partialSentence += results[i][0].transcript
    }
  }

  wholeText += totalSentence
  
  return partialSentence
}

  function setDivStyle() {
    div.style.bottom = '5%';
    div.style.left = 0;
    div.style.textAlign = 'center';
    div.style.backgroundColor = 'rgba(0,0,0,0.8)';
    div.style.position = 'absolute';
    div.style.color = 'rgba(255, 255, 255, 0.97)';
    div.style.padding = '10px';
    div.style.fontSize = '20px';
    div.style.width = '50%';
    div.style.transform = 'translate(50%)';
    div.style.border = '2px solid white';
    div.style.borderRadius = "5px";
    div.style.zIndex= "10000";
    div.style.fontFamily = "Arial";
  }

  function setYoutubeDivStyle() {
    var height = window.innerHeight * 0.9
    youtubeDiv.style.top = height.toString() + "px"
    youtubeDiv.style.left = "5%";
    youtubeDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    youtubeDiv.style.position = 'absolute';
    youtubeDiv.style.color = 'rgba(255, 255, 255, 0.97)';
    youtubeDiv.style.fontSize = '20px';
    youtubeDiv.style.width = '50%';
    youtubeDiv.style.transform = 'translate(50%)';
    youtubeDiv.style.border = '2px solid white';
    youtubeDiv.style.borderRadius = "5px";
    youtubeDiv.style.zIndex= "10000";
    youtubeDiv.style.fontFamily = "Arial";
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
        .splitTextToSize(wholeText, 7.5)

      doc.text(0.5, verticalOffset + size / 72, lines)

      verticalOffset += (lines.length + 0.5) * size / 72
    }
  }
  doc.save('a4.pdf')
}

function makeClosedCaption(text) {
  div.textContent = text;
  youtubeDiv.textContent = text
  if (isFullScreenYoutube) {
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

function enterFullScreenHandler() {
    if (document.webkitIsFullScreen === true) {
      isFullScreenYoutube = true
    }
    if (document.webkitIsFullScreen === false) {
      isFullScreenYoutube = false
    }
}

function setYoutubeFullScreenCaptions() {
    youtuberContainer = document.getElementsByClassName("html5-video-container")

    if (youtuberContainer) {
      youtuberContainer[0].appendChild(youtubeDiv);
    }
}

function setLanguague() {
  if (languague) {
    languague = "pt-BR"
  }
  recognition.lang = languague;
}