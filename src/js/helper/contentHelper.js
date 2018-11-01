function getCurrentLanguague(language) {
    var defaultLanguage = "pt-BR"
  
    return !language ? defaultLanguage : language
  }

  function addClass(view, className) {
    console.log(view)
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

  function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
 }