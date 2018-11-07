// - properties -

var actionButton = document.getElementById('transcription');
var version = document.getElementById('version')
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
  saveLanguageStatus(language)
}

function saveLanguageStatus(language) {
  localStorage.save(language, function(){})
}

function saveTranscriptionButtonAction() {
  localStorage.save(transcriptionButton, function(){})
}


function buildCustomSelectLanguage(languageObj) {
  //
var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  console.log(x)
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");


  //SET THE LANGUAGE SELECTED
  //a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  console.log(languageObj)
  a.innerHTML = languageObj.language
  console.log(selElmnt.options[selElmnt.selectedIndex].innerHTML)
  //


  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/

    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        //GET SELECTED VALUE
        h = this.parentNode.previousSibling;

        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            console.log(s)
            s.selectedIndex = i;

            // SET ON SELECT BOX
            h.innerHTML = this.innerHTML;
                    ///// SAVE LANGUAGE 

            console.log(h)
            language.language = h.textContent
            saveLanguageStatus(language)

            //
            y = this.parentNode.getElementsByClassName("same-as-selected");
            console.log(y)
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  console.log(y)
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}