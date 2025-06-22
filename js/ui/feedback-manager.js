"use strict";

export class FeedbackManager {
  static init() {
    FeedbackManager.setupErrorHandler();
  }

  static setupErrorHandler() {
    up.on("feedback:error", FeedbackManager.handleError);
  }

  static handleError(event) {
    const message = event.message || FeedbackManager.getDefaultErrorMessage();
    FeedbackManager.renderErrorFeedback(message);
  }

  static getDefaultErrorMessage() {
    return "There was an error loading the data. <br/>Please reload the page or try again later.";
  }

  static renderErrorFeedback(message) {
    up.render("#feedback", {
      fragment: `<div id="feedback" class="nes-balloon from-right">
            <span class="feedback-error">${message}</span>
        </div>`,
    });
  }
}
