export class ErrorReport extends HTMLElement {
  static define(): void {
    customElements.define("qc-error-report", this);
  }

  constructor(obj: Error) {
    super();
  }

  attach(): void {}
  detach(): void {}
}
ErrorReport.define();
