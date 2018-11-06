function getCurrentLanguague(language) {
  var defaultLanguage = "pt-BR"

  return !language ? defaultLanguage : language
}

function addClass(view, className) {
  view.classList.add(className)
  return div
}

function wordCount(str) {
  return str.split(" ").length;
}

function removeWordAtPosition(str, position) {
  position -= 1
  var isFirstWord = position === 0
  var finalString = str.replace(str.substring(getPosition(str, " ", position), getPosition(str, " ", position + 1)), "")
  finalString = isFirstWord ? finalString.slice(1, finalString.length) : finalString
  return finalString
}

function getWordAtPosition(str, position) {
  if (!str || !position) {
    return ""
  }

  position -= 1
  var isFirstWord = position === 0
  var spacePosition = isFirstWord ? 0 : 1
  var word = { word: "", positionStart: 0, positionEnd: 0 }
  word.word = str.slice(getPosition(str, " ", position) + spacePosition, getPosition(str, " ", position + 1))
  word.positionStart = (getPosition(str, " ", position) + spacePosition)
  word.positionEnd = (getPosition(str, " ", position + 1))
  return word
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function groupInterimTranscription(last, actual) {
  last = last.toLowerCase()
  actual = actual.toLowerCase()

  if (isSameTranscription(last, actual)) {
    return ""
  }

  var interceptionPoint = getInterceptionWordBeetweenTwoInterimTranscription(last, actual)

  if (interceptionPoint) {
    return actual.slice(interceptionPoint.positionEnd, actual.length)
  } else {
    return " " + actual
  }

}

function isSameTranscription(last, actual) {
  return (wordCount(last) == wordCount(actual) + 1
    || isTheSameTranscription(last, actual)
    || isTheSameLastTwoWords(last, actual)
    || getWordAtPosition(last, wordCount(last)).word == getWordAtPosition(actual, wordCount(actual)).word)
}

function getInterceptionWordBeetweenTwoInterimTranscription(first, second) {
  var quantityFirstWord = wordCount(first)
  var quantitySecondWord = wordCount(second)
  var lastWordFirstTranscription = getWordAtPosition(first, quantityFirstWord).word

  for (i = 8; i >= 1; i--) {
    if (lastWordFirstTranscription == getWordAtPosition(second, quantitySecondWord - i).word) {
      if ((getWordAtPosition(first, quantityFirstWord - 1).word == getWordAtPosition(second, quantitySecondWord - i - 1).word)) {
        return getWordAtPosition(second, quantitySecondWord - i)
      }
    }
  }

  return ""
}

function isTheSameTranscription(last, actual) {
  if (wordCount(last) > 3 && wordCount(actual) > 3) {
    return getLastsWord(last, 3) + " " + getLastsWord(last, 2) + " " + getLastsWord(last, 1)
      == getLastsWord(actual, 3) + " " + getLastsWord(actual, 2) + " " + getLastsWord(actual, 1)
  } else if (wordCount(last) == 2 && wordCount(actual) == 2) {
    return getLastsWord(last, 2) + " " + getLastsWord(actual, 1) == getLastsWord(actual, 2) + " " + getLastsWord(actual, 1)
  } else {
    return false
  }
}

function isTheSameLastTwoWords(last, actual) {
  return getWordAtPosition(last, wordCount(last) - 1).word + " " + getWordAtPosition(last, wordCount(last)).word
    == getWordAtPosition(actual, wordCount(actual) - 1).word + " " + getWordAtPosition(actual, wordCount(actual)).word
}

function getLastsWord(sentence, index) {
  var phrase = ""
  for (var i = (index - 1); i == 0; i--) {
    phrase += getWordAtPosition(sentence, wordCount(sentence) - index).word
    phrase += " "
  }
  return phrase
}

function removeTranscriptionContainer() {
  if(document.body.contains(div)) {
    document.body.removeChild(div)
  }
  if (youtuberContainer && youtuberContainer.contains(youtubeDiv)) {
    youtuberContainer.removeChild(youtubeDiv)
  }
}
