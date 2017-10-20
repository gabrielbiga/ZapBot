(function () {
    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this.events = new Map();
        }
        EventEmitter.prototype.on = function (event, listener) {
            if (!this.events.has(event))
                this.events.set(event, []);
            this.events.get(event).push(listener);
        };
        EventEmitter.prototype.emit = function (event, param) {
            if (this.events.has(event))
                this.events.get(event).forEach(function (listener) { return listener(param); });
        };
        return EventEmitter;
    }());
    return window['ZapBot'] = /** @class */ (function () {
        function ZapBot(_processRetroactive, _startListening, _listenInterval) {
            if (_processRetroactive === void 0) { _processRetroactive = false; }
            if (_startListening === void 0) { _startListening = false; }
            if (_listenInterval === void 0) { _listenInterval = 2000; }
            this._processRetroactive = _processRetroactive;
            this._startListening = _startListening;
            this._listenInterval = _listenInterval;
            this.event = new EventEmitter();
            this._lastReceivedMessageCount = 0;
            if (this._startListening)
                this.startListen();
        }
        ZapBot.prototype.startListen = function () {
            var _this = this;
            if (!this._startListening)
                setInterval(function () { return _this.listenReceiveMessage(); }, this._listenInterval);
        };
        ZapBot.prototype.sendMessage = function (message) {
            var textBox = document.querySelector([
                '#main', 'footer', 'div.block-compose', 'div.input-container',
                'div.pluggable-input.pluggable-input-compose',
                'div.pluggable-input-body.copyable-text.selectable-text'
            ].join('>'));
            var event = new (window['Event'] || window['InputEvent'])('input', {
                bubbles: true
            });
            var date = new Date();
            textBox.textContent = message;
            textBox.dispatchEvent(event);
            document.querySelector('button.compose-btn-send').click();
            this.event.emit('onSend', { message: message, date: date });
        };
        ZapBot.prototype.listenReceiveMessage = function () {
            var lastMessages = document.querySelectorAll('.message-in, .message-out');
            var lastMessagesLen = lastMessages.length;
            if (this._lastReceivedMessageCount === 0 && !this._processRetroactive) {
                console.warn("Starting now... Omitting about " + lastMessagesLen + " old messages");
                this._lastReceivedMessageCount = lastMessagesLen;
                return;
            }
            if (this._lastReceivedMessageCount >= lastMessagesLen)
                return;
            console.warn("New " + (lastMessagesLen - this._lastReceivedMessageCount) + " messages!");
            for (var i = this._lastReceivedMessageCount; i < lastMessagesLen; i++) {
                var bubbleElem = lastMessages[i];
                var bubbleMetadata = bubbleElem.querySelector('.bubble').getAttribute('data-pre-plain-text');
                this.event.emit('onReceive', {
                    rawElement: bubbleElem,
                    me: bubbleElem.classList.contains('message-out'),
                    message: bubbleElem.querySelector('.selectable-text').innerText,
                    sender: bubbleMetadata.split(']').pop().replace(':', '').trim(),
                    date: new Date(bubbleMetadata.split(']').shift().replace('[', '').trim())
                });
            }
            this._lastReceivedMessageCount = lastMessagesLen;
        };
        return ZapBot;
    }());
})();
