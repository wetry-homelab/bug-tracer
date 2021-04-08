import { Component, Prop, h, State } from '@stencil/core';
// import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

@Component({
  tag: 'bug-tracer',
  styleUrl: 'bug-tracer.scss',
  shadow: false,
})
export class BugTracer {
  /**
   * Api URL
   */
  @Prop() api: string;

  /**
   * Project ID
   */
  @Prop() projectid: string;

  @State() open: boolean = false;

  @State() explanation: string = '';
  @State() screenShot: boolean = true;
  @State() console: boolean = true;
  @State() isSuccess: boolean = false;
  @State() sending: boolean = false;

  logs: any[] = [];

  componentWillLoad() {
    let current_error = console.error;
    const that = this;

    console.error = function (msg) {
      if (msg !== undefined) that.logs.push(arguments);
      current_error.apply(null, Array.from(arguments));
    }

  }

  takeScreenshot() {
    function filter(node) {
      return (node.tagName !== 'BUG-TRACER');
    }

    return domtoimage.toPng(document.querySelector("body"), { quality: 0.95, filter: filter })
      .then(function (dataUrl) {
        return dataUrl;
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  openChat() {
    this.open = true;
  }

  closeChat() {
    this.open = false;
    this.isSuccess = false;
  }

  explanationChane(e) {
    this.explanation = e.target.value;
  }

  toggleScreenshot() {
    this.screenShot = !this.screenShot;
  }

  toggleConsole() {
    this.console = !this.console;
  }

  clear() {
    this.logs = [];
    this.explanation = '';
  }

  onSuccess() {
    this.clear();
    this.isSuccess = true;
  }

  async submitForm() {
    if (!this.sending && this.explanation.trim().length > 0) {
      this.sending = true;
      const that = this;
      const data = new FormData();
      data.append('explanation', this.explanation);
      if (this.screenShot) {
        const image = await this.takeScreenshot();
        data.append('image', image);
      }
      if (this.console) {
        data.append('console', JSON.stringify(this.logs));
      }
      data.append('projectID', this.projectid);
      const request = new XMLHttpRequest();
      request.open("POST", this.api);
      function reqSuccess () {
        console.log('response', this.responseText);
        that.onSuccess();
        that.sending = false;
      }
      function reqFail () {
        console.log('fails');
        that.sending = false;
      }
      request.addEventListener("load", reqSuccess);
      request.addEventListener("error", reqFail);
      request.send(data);
    }
  }

  render() {
    return (
      <div>
        <div id="chat-circle" class={{
          'btn btn-raised': true,
          '-opened': this.open
        }} onClick={() => this.openChat()}>
          <div id="chat-overlay"></div>
          <i class="material-icons">bug_report</i>
        </div>

        <div class={{
          'chat-box': true,
          '-opened': this.open
        }}>
          <div class="chat-box-header">
            Bug Tracer
              <span class="chat-box-toggle"><i class="material-icons" onClick={() => this.closeChat()}>close</i></span>
          </div>
          <div class="chat-box-body">
            <div class="chat-logs">
              <p>Hello, do you have a bug to report to us?</p>
              <form>
                <textarea id="chat-input" placeholder="Describe the bug..." maxlength="1000" onInput={(e) => this.explanationChane(e)} value={this.explanation}></textarea>
                <div class="actions">
                  <label class="pure-material-checkbox">
                    <input type="checkbox" checked={this.screenShot} onChange={() => this.toggleScreenshot()} />
                    <span>
                      <span class="pure-material-checkbox-text">Send screenshot</span>
                    </span>
                  </label>
                  <label class="pure-material-checkbox">
                    <input type="checkbox" checked={this.console} onChange={() => this.toggleConsole()} />
                    <span>
                      <span class="pure-material-checkbox-text">Send console</span>
                    </span>
                  </label>
                  <button type="button" class="chat-submit" id="chat-submit"
                    onClick={() => this.submitForm()}
                    disabled={this.sending}>
                    <i class="material-icons">send</i>
                  </button>
                </div>
              </form>
              { this.isSuccess ? (<div class="overlay">
                <i class="material-icons success-flag">
                  done
                </i>
                <span class="success-message">Thank's for your feedback</span>
              </div>) : '' }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
