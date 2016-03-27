'use babel'

import Redmine from './fetch-redmine'

import { CompositeDisposable } from 'atom'
import CSON from 'season'
import _path from 'path'

import shell from 'shell'

import IssuesListView from './views/issues-list-view'

const CONFIG_PATH = '.atom-redmine'

export default {
  config: {
    host: {
      title: 'Redmine Host',
      description: 'The hostname of the Redmine instance.',
      type: 'string',
      default: ''
    },
    apiKey: {
      title: 'Redmine API Key',
      description: 'The Redmine api key which can be found on the My Account page',
      type: 'string',
      default: ''
    }
  },

  subscriptions: null,

  redmine: null,
  projectId: null,

  issuesListView: null,

  activate (state) {
    this.redmine = new Redmine({
      host: atom.config.get('redmine.host'),
      apiKey: atom.config.get('redmine.apiKey')
    })

    if (!this.readConfigFile()) {
      atom.notifications.addError(
        `<strong>Atom Redmine Error</strong><br/>
        <code>${CONFIG_PATH}</code> config file not found. See the README for details.`,
        { dismissable: true }
      )
      return false
    }

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'redmine:my-issues': () => this.listIssues({ assigned_to_id: 'me' }),
      'redmine:all-issues': () => this.listIssues(),
      'redmine:open-project': () => this.openProject()
    }))
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  readConfigFile () {
    var configured = false
    atom.project.getPaths().forEach((path) => {
      var configPath = path + _path.sep + CONFIG_PATH
      if (atom.project.contains(configPath)) {
        var config = CSON.readFileSync(configPath)
        if (config) {
          var complete = true
          if (config.projectId) {
            this.projectId = config.projectId
          } else {
            complete = false
          }
          configured = configured || complete
        }
      }
    })
    return configured
  },

  listIssues (options = {}) {
    var params = {
      project_id: this.projectId,
      sort: 'updated_on:desc'
    }
    Object.getOwnPropertyNames(options).forEach(key => params[key] = options[key])
    var issues = this.redmine.getIssues(params)
    this.createIssuesListView().show(issues.catch(this.showError))
  },

  createIssuesListView () {
    return this.issuesListView || (this.issuesListView = new IssuesListView())
  },

  openProject () {
    shell.openExternal(`http://${atom.config.get('redmine.host')}/projects/${this.projectId}`)
  },

  showError (error) {
    console.error('error in atom-redmine', error)
    // ["STATUSCODE_REJECTION 404"]
  }
}
