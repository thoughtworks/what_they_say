class TranscriptionContainerModel {
    constructor(
     dom,
     height = 40,
     id = "transcription-container",
     className = "transcription-container",
     div = document.createElement('div'),
     interim_span = document.createElement('span'),
     final_span = document.createElement('span'),
     )
      {
        this.dom = dom
        this.id = id
        this.div = div
        this.className = className
        this.interim_span = interim_span
        this.final_span = final_span
        this.height = height

        this.interim_span.id = "interim_span"
        this.interim_span.className = "interim"
        this.final_span.id = "final_span"
        this.final_span.className = "final"

        this.setup()
    }

    setup() {
        this.div.appendChild(this.final_span)
        this.div.appendChild(this.interim_span)
        this.div.classList.add(this.className)
        this.div.id = this.id
    }

    shouldDisplay(boolean) {
        if(!this.dom.body.contains(this.div) && boolean) {
            this.dom.body.appendChild(this.div)
        } else if (this.dom.body.contains(this.div) && !boolean) {
            this.dom.body.removeChild(this.div)
        }
      }

    scrollIfNeeds() {
        if (this.div.scrollHeight > this.div.offsetHeight) {
            this.div.scrollTop += 20 
        }
      }

      increase() {
        if (this.height >= 220) {
            return
        }
        this.div.classList.remove(this.getHeightClass());
        this.height += 20
        this.div.classList.add(this.getHeightClass())
      }

      decrease() {
        if (this.height <= 40) {
            return
        }
        this.div.classList.remove(this.getHeightClass());
        this.height -= 20
        this.div.classList.add(this.getHeightClass())
    }

    getHeightClass() {
        return 'increase-level-' + this.height / 20
    }

    changeContainer() {
        if (this.div.className == "transcription-container-center") {
            console.log("center")
            this.div.classList.remove("transcription-container-center")
            this.div.classList.add("transcription-container")
        } else {
            console.log("normal")
            this.div.classList.remove("transcription-container")
            this.div.classList.add("transcription-container-center")
        }
    }
}

