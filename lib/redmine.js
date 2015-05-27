'use babel';

import Redmine from 'promised-redmine';
import {CompositeDisposable} from 'atom';

import IssuesListView from './views/issues-list-view';

var redmine;

var cb = function(thing) {
  console.log(thing);
};

var projectId = 'm_38';

export default {
  config: {
    host: {
      title: 'Redmine Host',
      description: 'The hostname of the Redmine instance.',
      type: 'string',
      default: null
    },
    apiKey: {
      title: 'Redmine API Key',
      description: 'The Redmine api key which can be found on the My Account page',
      type: 'string',
      default: null
    }
  },

  subscriptions: null,

  redmine: null,
  currentUser: null,

  issuesListView: null,

  activate(state) {
    this.redmine = new Redmine({
      host: atom.config.get('redmine.host'),
      apiKey: atom.config.get('redmine.apiKey')
    });

    // this.getCurrentUser();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'redmine:list-issues': ()=> this.listIssues(),
      'redmine:set-project': ()=> this.setProject()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  getCurrentUser() {
    this.redmine.getUserCurrent().then((user)=> {
        this.currentUser = user;
      }, this.showError);
  },

  listIssues() {
    this.redmine.getIssues({
      project_id: projectId,
      assigned_to_id: 'me'
    }).then((issues)=> {
      this.createIssuesListView().toggle(issues);
    }, this.showError);
  },

  createIssuesListView() {
    return this.issuesListView || (this.issuesListView = new IssuesListView());
  },

  setProject() {
    console.log('setting project!');
  },

  showError(error) {
    console.error('error in atom-redmine', error);
    // ["STATUSCODE_REJECTION 404"]
  }
};
