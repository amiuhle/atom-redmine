RedmineView = require './redmine-view'
{CompositeDisposable} = require 'atom'

module.exports = Redmine =
  redmineView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @redmineView = new RedmineView(state.redmineViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @redmineView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'redmine:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @redmineView.destroy()

  serialize: ->
    redmineViewState: @redmineView.serialize()

  toggle: ->
    console.log 'Redmine was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
