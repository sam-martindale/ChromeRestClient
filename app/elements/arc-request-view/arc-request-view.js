(function() {
'use strict';

Polymer({
  is: 'arc-request-view',
  properties: {
    opened: {
      type: Boolean,
      observer: '_requestChanged'
    },
    /**
     * A restored request object.
     */
    request: {
      type: Object,
      notify: true
    },
    /**
     * A value used by the URL editor widget.
     * It will not directly assign url value to the request object.
     * It must be done via observer.
     */
    masterUrl: {
      type: String,
      observer: '_masterUrlChanged'
    },
    /**
     * A value of the content type header.
     * It is not directly assigned to the method editor element. Change handlers should update
     * the value properly.
     *
     * Observers of this element may use this property as a current Content-Type header value.
     *
     * @type {String}
     */
    contentType: {
      type: String,
      // value: 'application/json',
      notify: true
    },

    requestHeaders: {
      type: String,
      notify: true,
      observer: '_headersChanged'
    },
    /**
     * Tru if request is loading at the moment.
     * Will display a progress bar.
     */
    requestLoading: Boolean,
    // A message to display in the action bar.
    statusMessage: String
  },

  observers: [
    '_requestChanged(request, request.*)'
  ],

  attached: function() {
    this.listen(window, 'restore-request', '_onRequestRestore');
  },

  detached: function() {
    this.unlisten(window, 'restore-request', '_onRequestRestore');
    this.opened = undefined;
    this.request = undefined;
    this.masterUrl = undefined;
    this.contentType = undefined;
    this.requestHeaders = undefined;
    this.requestLoading = undefined;
    this.statusMessage = undefined;
  },

  _requestChanged: function() {
    if (!this.opened) {
      return;
    }
    var urlValue = this.request ? this.request.url : undefined;
    this.set('masterUrl', urlValue);
    var headers = this.request ? this.request.headers : '';
    this.set('requestHeaders', headers);
    if (headers) {
      var ct = arc.app.headers.getContentType(headers);
      this.set('contentType', ct);
    } else {
      this.set('contentType', undefined);
    }
  },

  _masterUrlChanged: function() {
    if (!this.opened) {
      return;
    }
    if (!this.request || this.request.url === this.masterUrl) {
      return;
    }
    this.set('request.url', this.masterUrl);
  },
  /**
   * Called when the headers editor change its value.
   */
  _headersChanged: function() {
    if (!this.opened) {
      return;
    }
    if (this.request && this.request.headers === this.requestHeaders) {
      return;
    }
    this.set('request.headers', this.requestHeaders);
  },

  _sendRequest: function() {
    this.fire('send');
  },

  _abortRequest: function() {
    this.fire('abort');
  },

  _onRequestRestore: function(e) {
    this.set('request', e.detail.request);
    page('/request/current');
  },

  _urlSuggestionsOpened: function(e) {
    if (!e.detail.value) {
      return;
    }
    var historyPanel = this.$$('history-context-panel');
    if (!historyPanel) {
      throw new Error('history-context-panel not available.');
    }
    if (historyPanel.opened) {
      historyPanel.opened = false;
    }
  }
});
})();
