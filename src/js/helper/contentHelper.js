const transcriptionContainerClass = "transcription-container"

function getCurrentLanguague(language) {
  var defaultLanguage = "pt-BR"

  return !language ? defaultLanguage : language
}

function setupTranscriptionContainer(view) {
  view.classList.add(transcriptionContainerClass)
}
