var timer
var time

class Time {
  constructor(localStorage, s = 0, m = 0) {
    this.localStorage = localStorage
    this.s = s
    this.m = m
  }
}

if (time == null) {
  time = new Time()
}

function setTimer(isNewTimer) {
  console.log("iniciando")
  if (isNewTimer) {
    clearInterval(timer)
    timer = setInterval(function () {
      time.s++;

      if (time.s == 60) {
        time.s = 00;
        time.m++;

        if (time.m == 60) {
          time.m = 00;
        }
      }
    }, 1000);
  } else {
    clearInterval(timer)
    time.s = 0
    time.m = 0
  }
}

function pauseTimer() {
  clearInterval(timer)
}

