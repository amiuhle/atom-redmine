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
      default: ''
    },
    apiKey: {
      title: 'Redmine API Key',
      description: '',
      type: 'string',
      default: ''
    }
  },

  subscriptions: null,

  redmine: null,

  issuesListView: null,

  activate(state) {
    this.redmine = new Redmine({
      host: atom.config.get('redmine.host'),
      apiKey: atom.config.get('redmine.apiKey')
    });

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'redmine:list-issues': ()=> this.listIssues(),
      'redmine:set-project': ()=> this.setProject()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  listIssues() {
    console.log('listing issues!');
    this.redmine.getIssues({
      project_id: projectId
    }).then((issues)=> {
      this.createIssuesListView().toggle(issues);
    }, this.showError);
  },

  createIssuesListView() {
    this.issuesListView = this.issuesListView || new IssuesListView();
    return this.issuesListView; // || (this.issuesListView = new IssuesListView());
  },

  setProject() {
    console.log('setting project!');
  },

  showError(error) {
    console.error('error in atom-redmine', error);
    // ["STATUSCODE_REJECTION 404"]
  }
};
