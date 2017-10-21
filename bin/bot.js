(function () {
    /**
     * Small event emitter implementation
     */
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
    /**
     * Buffer implementation with a fixed value size
     */
    var PeekBuffer = /** @class */ (function () {
        function PeekBuffer(_maxSize) {
            if (_maxSize === void 0) { _maxSize = 50; }
            this._maxSize = _maxSize;
            this._buffer = [];
        }
        /**
         * Append just unique items
         *
         * @param item The item
         */
        PeekBuffer.prototype.append = function (item) {
            if (this.exists(item.digest))
                return false;
            if (this._buffer.length >= this._maxSize)
                this._buffer.shift();
            this._buffer.push(item);
            this._allignBufferHistory(item);
            return true;
        };
        PeekBuffer.prototype.size = function () {
            return this._buffer.length;
        };
        PeekBuffer.prototype.exists = function (digest) {
            return this._buffer.find(function (item) { return item.digest === digest; }) !== undefined;
        };
        /**
         * Store the newer item
         *
         * @param newItem Latest item
         */
        PeekBuffer.prototype._allignBufferHistory = function (newItem) {
            if (!this._newerItem) {
                this._newerItem = newItem.date;
                return;
            }
            if (newItem.date > this._newerItem)
                this._newerItem = newItem.date;
        };
        /**
         * Get a full array, take its difference and merge with the local buffer.
         *
         * @param origin The full new array
         */
        PeekBuffer.prototype.diffAndMerge = function (origin) {
            var _this = this;
            var startNewerItem = this._newerItem || new Date();
            // Minute tolerance
            startNewerItem.setMinutes(startNewerItem.getMinutes() - 1);
            return origin
                .filter(function (item) { return _this.append(item); })
                .filter(function (item) { return item.date >= startNewerItem; });
        };
        return PeekBuffer;
    }());
    /**
     * ZapBot Implementation
     */
    return window['ZapBot'] = /** @class */ (function () {
        function ZapBot(
            // Process messages before bot has been started
            // @experimental
            _processRetroactive, 
            // Start the class listening
            _startListening, 
            // Listen interval
            // Be careful: Lower times can crash your browser
            _listenInterval) {
            if (_processRetroactive === void 0) { _processRetroactive = false; }
            if (_startListening === void 0) { _startListening = false; }
            if (_listenInterval === void 0) { _listenInterval = 2000; }
            this._processRetroactive = _processRetroactive;
            this._startListening = _startListening;
            this._listenInterval = _listenInterval;
            // Already started?
            this._firstRun = true;
            // All messages processed
            this._messageBuffer = new PeekBuffer();
            // All messages emitted by the bot
            this._messagesEmitted = {};
            // All tasks processed by the bot
            this._tasksProcessed = {};
            // Event emitter for all messages
            this.event = new EventEmitter();
            // Minute tolerance to process tasks. (value in minutes)
            // You can tweak this value if you want to handle SPAM atacks
            this.minuteTolerance = 1;
            if (this._startListening)
                this.startListen();
        }
        /**
         * Start listen to new messages
         */
        ZapBot.prototype.startListen = function () {
            var _this = this;
            if (!this._startListening)
                setInterval(function () { return _this.listenReceiveMessage(); }, this._listenInterval);
        };
        /**
         * Send a simple message to contact or group
         *
         * From: https://gist.github.com/mathloureiro/4c74d60f051ed59650cc76d1da0d32da by @mathloureiro
         *
         * @param messsage Your message
         */
        ZapBot.prototype.sendMessage = function (message) {
            var textBox = document.querySelector([
                '#main', 'footer', 'div.block-compose', 'div.input-container',
                'div.pluggable-input.pluggable-input-compose',
                'div.pluggable-input-body.copyable-text.selectable-text'
            ].join('>'));
            // Shit happens...
            if (!textBox)
                throw new ReferenceError('Aconteceu algum problema ao enviar essa mensagem');
            var event = new (window['Event'] || window['InputEvent'])('input', {
                bubbles: true
            });
            var date = new Date();
            textBox.textContent = message;
            textBox.dispatchEvent(event);
            document.querySelector('button.compose-btn-send').click();
            this.event.emit('onSend', { message: message, date: date });
            this._messagesEmitted[this.hashCode(message, true)] = message;
        };
        /**
         * Process new messages and trigger the event
         */
        ZapBot.prototype.listenReceiveMessage = function () {
            var _this = this;
            // Search new messages on screen
            var lastMessages = Array.from(document.querySelectorAll('.message-in, .message-out'));
            // Parse the new data
            var receivedMessages = lastMessages.map(function (bubbleElem) {
                var bubbleMetadata = bubbleElem.querySelector('.bubble').getAttribute('data-pre-plain-text');
                var parsedMessage = {
                    me: bubbleElem.classList.contains('message-out'),
                    message: bubbleElem.querySelector('.selectable-text').innerText,
                    sender: bubbleMetadata.split(']').pop().replace(':', '').trim(),
                    date: new Date(bubbleMetadata.split(']').shift().replace('[', '').trim()),
                    digest: 0,
                    processDigest: _this.hashCode(bubbleElem.querySelector('.message-text').getAttribute('data-id'))
                };
                parsedMessage.digest += _this.hashCode(parsedMessage);
                parsedMessage.rawElement = bubbleElem;
                return parsedMessage;
            })
                .filter(function (newMessage) { return _this._messagesEmitted[_this.hashCode(newMessage.message, true)] === undefined; });
            // Is the first run?
            // FIXME: This flag(_processRetroactive) is so fucking bugged. I have no idea why I did this shit.
            if (this._firstRun && !this._processRetroactive) {
                console.warn("Starting now... Omitting about " + lastMessages.length + " old messages");
                // Flaging as processed
                receivedMessages.forEach(function (message) { return _this._tasksProcessed[message.processDigest] = true; });
                this._firstRun = false;
                return;
            }
            // Just fresh messages
            var newMessages = this._messageBuffer.diffAndMerge(receivedMessages)
                .filter(function (message) { return _this._tasksProcessed[message.processDigest] === undefined; });
            // Emit changes to the bot implementation
            newMessages.forEach(function (message) {
                _this.event.emit('onReceive', message);
                _this._tasksProcessed[message.processDigest] = true;
            });
        };
        /**
         * Calculates a checksum of the given object
         *
         * @param obj Your object
         * @param [literal] Remove all special chars
         */
        ZapBot.prototype.hashCode = function (obj, literal) {
            var str = JSON.stringify(obj);
            if (literal)
                str = str.replace(/[^a-zA-Z0-9]/g, '');
            return str
                .split('')
                .reduce(function (a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
        };
        return ZapBot;
    }());
})();
