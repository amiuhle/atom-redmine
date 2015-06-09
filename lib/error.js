'use babel'

export function displayError (error) {
  console.error(error)
  atom.notifications.addFatalError(
    `
    <strong>Atom Redmine Error</strong><br/>
    ${error.message || error}
    `
  )


}
