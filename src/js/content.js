//setup
const transcriptionClass = "transcription-container"

var recognition = new webkitSpeechRecognition();
var isStopRecognized = false

var div = document.createElement('div');


var youtubeDiv = document.createElement('div');
var isFullScreen = false
var youtuberContainer
var lastTranscription = ""
var fullTranscription = ""
var wtkRecognition

var recognizing = false;
var ignore_onend;
var final_transcript = '';
var final_span = document.createElement('span');
var interim_span = document.createElement('span');
interim_span.id = "interim_span"
interim_span.className = "interim"
interim_span.id = "final_span"
interim_span.className = "final"
var first_char = /\S/;
var two_line = /\n\n/g;
var one_line = /\n/g;
var t0
var t1
var t2
var t3
var silenceVerifyAverage
var silenceTimer
var silenceCount = 0

setup()

//listeners

document.addEventListener('webkitfullscreenchange', setFullScreenHandler, false);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.action == "start") {
      isStopRecognized = false
      startRecognition();
      silenceTimer = setInterval(verifySilenceTime, 5000);
    } else if (request.action == "history") {
      generatePDF();
    } else if (request.action == "stop") {
      isStopRecognized = true
      recognition.stop();
      clearInterval(silenceTimer);
    } else if (request.language) {
      recognition.lang = request.language;
    }
  });

//callback recognition

recognition.onstart = function() {
  console.log("onstart")
  recognizing = true;
};

recognition.onresult = function(event) {
  t0 = performance.now();

  var interim_transcript = '';
  final_transcript = '';

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  final_transcript = capitalize(final_transcript);
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);

  t1 = performance.now();
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

  if (div.scrollHeight > div.offsetHeight) {
    div.scrollTop += 20 
  }

}

function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

recognition.onend = function() {
  

  if (!isStopRecognized) {
    recognition.start()
  } else {
    recognition.stop()
  }

  console.log("onend")
  recognizing = false;
  if (ignore_onend) {
    return;
  }

  if (!final_transcript) {
    return;
  }
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(document.getElementById('final_span'));
    window.getSelection().addRange(range);
  }
};

recognition.onerror = function(event) {
  isStopRecognized = true

  console.log("onerror")
  if (event.error == 'no-speech') {
    console.log("no-speech")

    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    console.log("audio-capture");
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    console.log("not-allowed")
    recognition.stop()
    ignore_onend = true;
    
  }
};

//functions

function setup() {
  addJsModule()
  recognition.continuous = true;
  recognition.interimResults = true;
  addClass(div, transcriptionClass)
  setYoutubeDivStyle()
  setLanguague()
  silenceTimer = setInterval(verifySilenceTime, 5000);
}

function startRecognition() {
  setLanguague()
  div.appendChild(final_span)
  div.appendChild(interim_span)
  document.body.appendChild(div)
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


function getLanguageSelection() {
  chrome.storage.local.get(["language"], function (languageName) {
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
  chrome.storage.local.get(["language"], function (languageName) {
    recognition.lang = convertLanguageNameToCode(getCurrentLanguague(languageName.language))
    console.log(recognition.lang)
  });
}

function addJsModule() {
  const script = document.createElement('script');
  const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL('src/js/model/wtkRecognition.js'));
  head.insertBefore(script, head.lastChild);
}

function convertLanguageNameToCode(language) {
  var code = ""
    switch (language) {
      case "English (US)": code = "en-US"; break
      case  "German":  code = "de-DE"; break
      case  "Portuguese (Brasil)" : code = "pt-BR"; break
      case  "Spanish (Chile)": code = "es-CL"; break
    }

    return code
}

function verifySilenceTime() {

  if (!recognizing) {
    return
  }

  console.log("timer")


  if (silenceCount >= 1) {
    console.log("reniciando")
    recognition.stop()
  }

  if (t0 == t2 && t1 == t3) {
    console.log("adicionando count")
    silenceCount++
    clearInterval(silenceTimer);
    silenceTimer = setInterval(verifySilenceTime, 5000);
  } else {
    console.log(t0)
    console.log(t1)
    silenceCount = 0
  }

  t2 = t0
  t3 = t1
}