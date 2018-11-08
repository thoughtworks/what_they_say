class TranscriptionContainerModel {
    constructor(
     dom,
     className = "transcription-container",
     div = document.createElement('div'),
     interim_span = document.createElement('span'),
     final_span = document.createElement('span'),)
      {
        this.dom = dom
        this.div = div
        this.className = className
        this.transcriptionClass = transcriptionClass
        this.interim_span = interim_span
        this.final_span = final_span
        console.log(dom)

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
}

