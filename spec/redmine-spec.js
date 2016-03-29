'use babel'
/* eslint-env jasmine */
// TODO: where's this actually coming from?
/* global waitsForPromise */

import '../lib/redmine'

 // Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
 //
 // To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
 // or `fdescribe`). Remove the `f` to unfocus the block.

describe('Redmine', () => {
  let [workspaceElement, activationPromise] = []

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    atom.config.set('host', 'www.example.com')
    atom.config.set('apiKey', 'foobarbaz')
    activationPromise = atom.packages.activatePackage('redmine')
  })

  describe('when the redmine:all-issues event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.redmine-issues')).not.toExist()

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'redmine:all-issues')

      // activationPromise.then((redmine) => {
      //   console.log(redmine)
      //   debugger
      // })

      waitsForPromise(() => activationPromise)

      runs(() => {
        expect(workspaceElement.querySelector('.redmine-issues')).toExist()

        let redmineElement = workspaceElement.querySelector('.redmine-issues')
        expect(redmineElement).toExist()

        let redminePanel = atom.workspace.panelForItem(redmineElement)
        expect(redminePanel.isVisible()).toBe(true)
        atom.commands.dispatch(workspaceElement, 'redmine:all-issues')
        expect(redminePanel.isVisible()).toBe(false)
      })
    })

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement)

      expect(workspaceElement.querySelector('.redmine')).not.toExist()

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'redmine:toggle')

      waitsForPromise(() => activationPromise)

      runs(() => {
        // Now we can test for view visibility
        let redmineElement = workspaceElement.querySelector('.redmine')
        expect(redmineElement).toBeVisible()
        atom.commands.dispatch(workspaceElement, 'redmine:toggle')
        expect(redmineElement).not.toBeVisible()
      })
    })
  })
})
