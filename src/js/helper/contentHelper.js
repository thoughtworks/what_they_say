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

  function removeWordAtPosition(str,position) {
    position -= 1
    var isFirstWord = position === 0
    var finalString = str.replace(str.substring(getPosition(str," ", position), getPosition(str," ", position + 1)), "")
    finalString = isFirstWord ? finalString.slice(1, finalString.length) : finalString
    return finalString
  }

  function getWordAtPosition(str,position) {
    if (!str || !position) {
      return ""
    }

    position -= 1
    var isFirstWord = position === 0
    var spacePosition = isFirstWord ? 0 : 1
    var word = {word: "", positionStart : 0, positionEnd: 0}
    word.word = str.slice(getPosition(str," ", position) + spacePosition, getPosition(str," ", position + 1))
    word.positionStart = (getPosition(str," ", position) + spacePosition)
    word.positionEnd = (getPosition(str," ", position + 1))
    return word
  }

  function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
 }

 function groupInterimTranscription(last, actual) {
  var interceptionPoint = getInterceptionWordBeetweenTwoInterimTranscription(last, actual)

  if (wordCount(last) == wordCount(actual) + 1) {
    return last
  }

  if (last == actual) {
    return last
  }

   if (interceptionPoint.word == undefined ) {
     return last + " " + actual
   }

   return last + actual.slice(interceptionPoint.positionEnd, actual.length)
 }

 function getInterceptionWordBeetweenTwoInterimTranscription(first, second) {
   var quantityFirstWord = wordCount(first)
   var quantitySecondWord = wordCount(second)
   var lastWordFirstTranscription = getWordAtPosition(first, quantityFirstWord).word

   for (i = quantitySecondWord; i >= 1; i --) {
     if (lastWordFirstTranscription == getWordAtPosition(second, i).word) {
          return getWordAtPosition(second,i)
     }
   }

   return ""
 }