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

  var interceptionPoint = getInterceptionWordBeetweenTwoInterimTranscription(last, actual)

  console.log(isTheSameLastTwoWords(last, actual))

  //Dont Repeat
  if (wordCount(last) == wordCount(actual) + 1
   || isTheSameTranscription(last,actual) 
   || isTheSameLastTwoWords(last, actual)
   || getWordAtPosition(last, wordCount(last)).word == getWordAtPosition(actual, wordCount(actual)).word ) {
    return ""
  }

  console.log(interceptionPoint)

  if (interceptionPoint) {
    console.log("entrei aqui")
    return actual.slice(interceptionPoint.positionEnd, actual.length)
  } else {
    return " " + actual
  }

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
    return   getWordAtPosition(last, wordCount(last) - 2).word + " " + getWordAtPosition(last, wordCount(last) - 1).word + " " + getWordAtPosition(last, wordCount(last)).word
    == getWordAtPosition(actual, wordCount(actual) - 2).word + " " + getWordAtPosition(actual, wordCount(actual) - 1).word + " " + getWordAtPosition(actual, wordCount(actual)).word
  } else if (wordCount(last) == 2 && wordCount(actual) == 2) {
    var lastWords = getWordAtPosition(last, wordCount(last) - 1).word + " " + getWordAtPosition(last, wordCount(last)).word 
    == getWordAtPosition(actual, wordCount(actual) - 1).word + " " + getWordAtPosition(actual, wordCount(actual)).word
  } else {
    return false
  }


  return actual.includes(lastWords)
}

function isTheSameLastTwoWords(last, actual) {
  return  getWordAtPosition(last, wordCount(last) - 1).word + " " + getWordAtPosition(last, wordCount(last)).word
  == getWordAtPosition(actual, wordCount(actual) - 1).word + " " + getWordAtPosition(actual, wordCount(actual)).word
}