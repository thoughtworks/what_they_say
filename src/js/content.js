//setup
var container

var recognition = new webkitSpeechRecognition();
var isStopRecognized = false
var isPauseRecognized = false
var isDeleteTranscriptionHistory = false

var isFullScreen = false
var wholeHistory = ""

//err0rs
var recognizing = false;
var ignore_onend;
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
var silenceAlert = document.createElement('div')
//err0rs

var numberHeight = 40
var manager = new TranscriptionManager()

setup()
setupInstance()

//listeners

document.addEventListener('webkitfullscreenchange', setFullScreenHandler, false);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.action == "start") {
      isStopRecognized = false
      isPauseRecognized = false
      isDeleteTranscriptionHistory = false
      startRecognition();
      silenceTimer = setInterval(verifySilenceTime, 3000);
    } else if (request.action == "history") {
      generatePDF();
    } else if (request.action == "pause") {
      console.log("pause")
      isPauseRecognized = true
      recognition.stop();
      clearInterval(silenceTimer);
    } else if (request.action == "stop") {
      console.log("stop")
      isPauseRecognized = false
      isStopRecognized = true
      isDeleteTranscriptionHistory = true
      recognition.abort()
      recognition.stop();
      manager.reset()
      removeSilenceAlert()
      container.interim_span.innerHTML = ""
      container.final_span.innerHTML = ""
    } else if (request.language) {
      recognition.lang = request.language;
    } else if (request.action == "increase") {
      container.increase()
    } else if (request.action == "decrease") {
      container.decrease()
    } else if (request.action == "clear") {
      recognition.abort()
      silenceCount = 0
      manager.reset()
      container.interim_span.innerHTML = ""
      container.final_span.innerHTML = ""
    } else if (request.action == "position") {
      console.log("position-change")
      container.changeContainer()
    }
  });

//callback recognition

recognition.onstart = function() {
  console.log("onstart")
  
  setupInstance()
  if (silenceCount < 2) {
    removeSilenceAlert()
    container.shouldDisplay(true)
  }
  recognizing = true;
};

recognition.onresult = function(event) {
  t0 = performance.now();

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      manager.finishTranscription()
      wholeHistory += event.results[i][0].transcript;
      wholeHistory += " "
    } else if (event.results[i][0].confidence >= 0.6) {
      manager.add(event.results[i][0].transcript)
    }
  }

  container.interim_span.innerHTML = manager.getAll();
  
  t1 = performance.now();
  container.scrollIfNeeds()
  //
}

function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

recognition.onend = function() {
  if (!isStopRecognized && !isPauseRecognized) {
    recognition.start()
  } else if (isStopRecognized && !isPauseRecognized) {
    setupInstance()
    container.shouldDisplay(false)
  } else if (isPauseRecognized) {
    removeSilenceAlert()
    container.shouldDisplay(true)
  }

  console.log("onend")
  recognizing = false;
};

recognition.onerror = function(event) {
  console.log("onerror")
  if (event.error == 'no-speech') {
    console.log("no-speech")
    addSilenceAlert()
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    console.log("audio-capture");
    ignore_onend = true;
    isStopRecognized = true
  }
  if (event.error == 'not-allowed') {
    console.log("not-allowed")
    recognition.stop()
    ignore_onend = true;
    isStopRecognized = true
  }
};

//functions

function setup() {
  addJsModule()
  recognition.continuous = true;
  recognition.interimResults = true;
  setHeightContainer()
  setLanguague()
  silenceTimer = setInterval(verifySilenceTime, 3000);
}

function startRecognition() {
  setLanguague()
  recognition.start();
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
        .splitTextToSize(wholeHistory, 7.5)

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

function setLanguague() {
  chrome.storage.local.get(["language"], function (languageName) {
    recognition.lang = convertLanguageNameToCode(getCurrentLanguague(languageName.language))
  });
}

function setHeightContainer() {
  chrome.storage.local.get(["numberHeight"], function (response) {
    if (response.numberHeight) {
      numberHeight = response.numberHeight
    }
  });
}

function addJsModule() {
  const script = document.createElement('script');
  const script2 = document.createElement('script');
  const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL('src/js/model/transcriptionContainerModel.js'));

  script2.setAttribute("type", "module");
  script2.setAttribute("src", chrome.extension.getURL('src/js/presenter/transcriptionManager.js'));

  head.insertBefore(script, head.lastChild);
  head.insertBefore(script2, head.lastChild);
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


  if (silenceCount >= 2) {
    addSilenceAlert() 
    recognition.stop()
  }

  if (t0 == t2 && t1 == t3) {
    silenceCount++
    clearInterval(silenceTimer);
    silenceTimer = setInterval(verifySilenceTime, 3000);
  } else {
    silenceCount = 0
  }

  t2 = t0
  t3 = t1
}


function getCurrentLanguague(language) {
  var defaultLanguage = "pt-BR"
  return !language ? defaultLanguage : language
}

function setupInstance() {
  if (!container) {
    container = new TranscriptionContainerModel(document,numberHeight)
  }
}

function addSilenceAlert() {
  if(!document.body.contains(silenceAlert) && !isStopRecognized) {
    silenceAlert.textContent = "Silence Detect, if this keep for a long time please stop and play, if this don't work for three times, please close and open your browse, we are working on this =)"
    className = "transcription-container"
    silenceAlert.className = className
    document.body.appendChild(silenceAlert)
    container.shouldDisplay(false)
  }
}

function removeSilenceAlert() {
  if (document.body.contains(silenceAlert)) {
    document.body.removeChild(silenceAlert)
  }
}