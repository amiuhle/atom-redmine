'use babel'

export default class Issue {

  get title () {
    return `${this.tracker.name} #${this.id}: ${this.subject}`
  }

}
