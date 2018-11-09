class Time {
    constructor(localStorage, s = 0,m = 0) {
      this.localStorage = localStorage
      this.s = s
      this.m = m
    }
  }

  var timer
  var time
  var jackson = "jackson"

  if (time == null) {
   time = new Time()
  }

function setTimer(boolean) {
    console.log("iniciando")
    var value = ""
      if (boolean) {
        clearInterval(timer)
        timer = setInterval(function(){
          time.s++;
          if(time.s == 60) {
            time.s = 00;
            time.m++;
      
              if(time.m == 60) {
                time.m = 00;
                  // hours++;
              }
          }
      }, 1000);
      } else {
        clearInterval(timer)
        time.s = 0
        time.m = 0
      }
  }

  function increase() {
    console.log()
    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.executeScript(null,
                               {code:"document.getElementById('transcription-container').style.height += 20"});
    });
  }

