'use babel';
import {$$, SelectListView} from 'atom-space-pen-views';

export default class IssuesListView extends SelectListView {
  constructor() {
    super();
    this.controller = null;
  }

  activate() {
    console.log('activate');
  }

  getFilterKey() {
    return 'subject';
  }

  getFilterQuery() {
    return this.filterEditorView.getText();
  }

  cancelled() {
    this.hide();
  }

  toggle(issues) {
    this.issues = issues;
    if(this.panel && this.panel.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.panel = this.panel || atom.workspace.addModalPanel({ item: this });
    this.loading.text('Loading issues ...');
    this.loadingArea.show();
    this.panel.show();
    this.setItems(this.issues.issues);
    this.focusFilterEditor();
  }

  hide() {
    if(this.panel) {
      this.panel.hide();
    }
  }

  viewForItem(issue) {
    console.log('viewForItem', issue);
    return $$(function() {
      this.li({class: 'two-lines'}, ()=> {
        this.div({ class: 'status status-added' });
        this.div({ class: 'primary-line no-icon' }, ()=> {
          this.span('#' + issue.id);
          this.span(' – ');
          this.span(issue.subject);
        });
        this.div({ class: 'secondary-line no-icon' }, ()=> {
          this.span(issue.project.name);
        });
      });
    });
  }

  confirmed(item) {
    // TODO Open in browser for now?
  }
}
