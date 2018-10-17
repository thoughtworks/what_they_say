var showMaxSpeeches = 10
var wholeText = ""
var recognition = new webkitSpeechRecognition();
var isStopRecognized = false
var languague = "pt-BR"

div = document.createElement('div');
setDivStyle(div);

recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = languague;

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
  }
}

recognition.onerror = function(event) {
  isStopRecognized = true
  recognition.stop();
  console.log("error happens click to transcription again")
  console.log(event.error);
}

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

function startRecognition() {
  recognition.start();
}

function makeASentence(event) {
  var partialSentence = ""
  var totalSentence = ""
  var newResults = event.results
  var results = event.results

  for (i=0; i<results.length; i++) {
    if (results[i][0].confidence > 0.8 && results[i].isFinal ) {
      totalSentence += results[i][0].transcript
      totalSentence += " "
    }
  }

  if (newResults.length > showMaxSpeeches) {
    var tempArray = Array.from(newResults)
    newResults = tempArray.slice(newResults.length - 2, newResults.length)
  }

  for (i=0; i<newResults.length; i++) {
    if (newResults[i][0].confidence > 0.8) {
      partialSentence += newResults[i][0].transcript
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

function generatePDF() {
  var doc = new jsPDF('p', 'in', 'letter'),
    sizes = [12, 16, 20],
    fonts = [['Helvetica', '']],
    font, size, lines,
    margin = 0.5, // inches on a 8.5 x 11 inch sheet.
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
  document.body.appendChild(div);
}
