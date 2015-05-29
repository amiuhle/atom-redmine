'use babel';
import {$$, SelectListView} from 'atom-space-pen-views';
import shell from 'shell';

import Issue from '../models/issue';

export default class IssuesListView extends SelectListView {

  constructor() {
    super();
    this.controller = null;
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
    // issue.__proto__ = Issue.prototype;
    return $$(function() {
      this.li({class: 'two-lines'}, ()=> {
        this.div({ class: 'status status-added' });
        this.div({ class: `primary-line icon icon-issue-opened` }, ()=> {
          this.span(issue.title);
        });
        this.div({ class: 'secondary-line no-icon' }, ()=> {
          this.span(issue.status.name);
        });
      });
    });
  }

  confirmed(item) {
    shell.openExternal(`http://${atom.config.get('redmine.host')}/issues/${item.id}`);
  }
}
