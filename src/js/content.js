//setup
var container

var recognition = new webkitSpeechRecognition();
var isStopRecognized = false
var isDeleteTranscriptionHistory = false

var isFullScreen = false
var history = ""

var recognizing = false;
var ignore_onend;
var final_transcript = '';

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

var actualFinalTranscription = ""
var actualInterimTranscription = ""
var lastFinalTranscription = ""
var lastInterimTranscription = ""
var combined_interim_transcript = ""
var combined_final_transcript = ""
var numberHeight = 40



setup()

//listeners

document.addEventListener('webkitfullscreenchange', setFullScreenHandler, false);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.action == "start") {
      isStopRecognized = false
      isDeleteTranscriptionHistory = false
      startRecognition();
      silenceTimer = setInterval(verifySilenceTime, 3000);
    } else if (request.action == "history") {
      generatePDF();
    } else if (request.action == "pause") {
      console.log("pause")
      isStopRecognized = true
      recognition.stop();
      clearInterval(silenceTimer);
    } else if (request.action == "stop") {
      console.log("stop")
      isStopRecognized = true
      isDeleteTranscriptionHistory = true
      recognition.stop();
      combined_final_transcript = ""
      combined_interim_transcript = ""
      lastFinalTranscription = ""
      lastInterimTranscription = ""
      actualFinalTranscription = ""
      actualInterimTranscription = ""
      container.interim_span.innerHTML = ""
      container.final_span.innerHTML = ""
    } else if (request.language) {
      recognition.lang = request.language;
    } else if (request.action == "increase") {
      console.log("increase")
      container.increase()
    } else if (request.action == "decrease") {
      console.log("decrease")
      container.decrease()
    }
  });

//callback recognition

recognition.onstart = function() {
  console.log("onstart")
  
  setupInstance()
  container.shouldDisplay(true)
  recognizing = true;
};

recognition.onresult = function(event) {
  t0 = performance.now();

  var interim_transcript = '';
  final_transcript = '';

  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else if (event.results[i][0].confidence >= 0.6) {
      interim_transcript += event.results[i][0].transcript;
    }
  }

  combined_interim_transcript = lastInterimTranscription + " " + interim_transcript

    //teste

    if (combined_interim_transcript == actualInterimTranscription ) {
      console.log("some error is happening, and i need to understand and solve this, please stop and continue")
      return
    }

    //


  combined_final_transcript = lastFinalTranscription + " " + final_transcript
  container.final_span.innerHTML = combined_final_transcript;

  container.interim_span.innerHTML = combined_interim_transcript;

  actualFinalTranscription = combined_final_transcript
  actualInterimTranscription = combined_interim_transcript
  
  t1 = performance.now();
  container.scrollIfNeeds()

  //
}

function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

recognition.onend = function() {

  if (!isDeleteTranscriptionHistory) {
    lastInterimTranscription = actualInterimTranscription
    lastFinalTranscription = actualFinalTranscription
  }
  
  if (!isStopRecognized) {
    recognition.start()
  } else {
    recognition.stop()
    setupInstance()
    container.shouldDisplay(false)
  }

  console.log("onend")
  recognizing = false;
  if (ignore_onend) {
    return;
  }
};

recognition.onerror = function(event) {
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
    isStopRecognized = true
    recognition.stop()
    ignore_onend = true;
  }
  isStopRecognized = false
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
    console.log(combined_final_transcript)
    if (fonts.hasOwnProperty(i)) {
      font = fonts[i]
      size = sizes[i]

      lines = doc.setFont(font[0], font[1])
        .setFontSize(size)
        .splitTextToSize(combined_interim_transcript, 7.5)

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
  const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL('src/js/model/transcriptionContainerModel.js'));
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


  if (silenceCount >= 1) {
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