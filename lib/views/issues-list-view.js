'use babel';
import {$$, SelectListView} from 'atom-space-pen-views';
import shell from 'shell';

import Issue from '../models/issue';

export default class IssuesListView extends SelectListView {

  constructor() {
    super();
    this.addClass('redmine-issues');
  }

  activate() {
    console.log('activate');
  }

  getFilterKey() {
    return 'title';
  }

  getFilterQuery() {
    return this.filterEditorView.getText();
  }

  cancelled() {
    this.hide();
  }

  toggle(issues) {
    if(this.panel && this.panel.isVisible()) {
      this.hide();
    } else {
      this.show(issues);
    }
  }

  show(issuesPromise) {
    this.panel = this.panel || atom.workspace.addModalPanel({ item: this });
    this.loading.text('Loading issues ...');
    this.loadingArea.show();
    this.panel.show();
    issuesPromise.then(issues => {
      this.setItems(issues.issues);
      this.focusFilterEditor();
    });
  }

  hide() {
    if(this.panel) {
      this.panel.hide();
    }
  }

  viewForItem(issue) {
    Object.setPrototypeOf(issue, Issue.prototype);
    return $$(function() {
      this.li({class: 'two-lines redmine-issue'}, ()=> {
        this.div({ class: `redmine-issue__status redmine-issue__status--${issue.status.id} pull-right` }, issue.status.name);
        this.div({ class: `primary-line icon icon-issue-opened` }, ()=> this.span(issue.title));
        this.div({ class: 'secondary-line no-icon' }, ()=> {
          this.span('By ');
          this.span(issue.author.name, { class: 'redmine-issue__author'});

          this.span(' on ');
          this.span(new Date(issue.created_on).toLocaleString(), { class: 'redmine-issue__created-on' });

          this.span('. Last modified on ');
          this.span(new Date(issue.updated_on).toLocaleString(), { class: 'redmine-issue__updated-on' });
        });
      });
    });
  }

  confirmed(item) {
    shell.openExternal(`http://${atom.config.get('redmine.host')}/issues/${item.id}`);
  }
}
