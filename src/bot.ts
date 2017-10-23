(() => {
    /**
     * Small event emitter implementation
     */
    class EventEmitter<T>
    {
        private events: Map<string, Array<EventListenerFn<T>>> = new Map();

        /**
         * Register a listener for an event
         *
         * @param event Event name
         * @param listener Function to be executed
         */
        public on(event: string, listener: EventListenerFn<T>): void
        {
            if (!this.events.has(event)) this.events.set(event, []);
            this.events.get(event)!.push(listener);
        }

        /**
         * Trigger an event
         *
         * @param event Event name
         * @param param Value
         */
        public emit(event: string, param: T): void
        {
            if (this.events.has(event))
                this.events.get(event)!.forEach(
                    (listener: EventListenerFn<T>) => listener(param)
                );
        }
    }

    /**
     * Buffer implementation with a fixed value size
     */
    class PeekBuffer<T extends Bufferable>
    {
        private _buffer: Array<T> = [];
        private _newerItem: Date;

        constructor(private _maxSize: number = 50)
        { }

        /**
         * Append just unique items
         *
         * @param item The item
         */
        public append(item: T): boolean
        {
            if (this.exists(item.digest)) return false;

            if (this._buffer.length >= this._maxSize) this._buffer.shift();

            this._buffer.push(item);
            this._allignBufferHistory(item);
            return true;
        }

        /**
         * Buffer size
         */
        public size(): number
        {
            return this._buffer.length;
        }

        /**
         * Check if other equal object exists
         *
         * @param digest Checksum number
         */
        public exists(digest: number): boolean
        {
            return this._buffer.find(item => item.digest === digest) !== undefined;
        }

        /**
         * Store the newer item
         *
         * @param newItem Latest item
         */
        private _allignBufferHistory(newItem: T): void
        {
            if (!this._newerItem)
            {
                this._newerItem = newItem.date;
                return;
            }

            if (newItem.date > this._newerItem) this._newerItem = newItem.date;
        }

        /**
         * Get a full array, take its difference and merge with the local buffer.
         *
         * @param origin The full new array
         */
        public diffAndMerge(origin: Array<T>): Array<T>
        {
            const startNewerItem: Date = this._newerItem || new Date();

            // Minute tolerance to process tasks. (value in minutes)
            // You can tweak this value if you want to handle SPAM atacks
            startNewerItem.setMinutes(startNewerItem.getMinutes() - 1);

            return origin
                // Add the new items to the buffer
                .filter((item: T) => this.append(item))
                // Just newer messages
                .filter((item: T) => item.date >= startNewerItem);
        }
    }

    /**
     * ZapBot Implementation
     */
    return window['ZapBot'] = class ZapBot
    {
        // Already started?
        private _firstRun: boolean = true;

        // All messages processed
        private _messageBuffer: PeekBuffer<ReceiveEvent> = new PeekBuffer();

        // All messages emitted by the bot
        private _messagesEmitted: SimpleBufferFastSeek<string> = {};

        // All tasks processed by the bot
        private _tasksProcessed: SimpleBufferFastSeek<boolean> = {};

        // Event emitter for all messages
        public readonly event: EventEmitter<BotEvent> = new EventEmitter();

        constructor(
            // Process messages before bot has been started
            // @experimental
            private _processRetroactive: boolean = false,

            // Start the class listening
            private _startListening: boolean = false,

            // Listen interval
            // Be careful: Lower times can crash your browser
            private _listenInterval: number = 2000
        )
        {
            if (this._startListening) this.startListen();
        }

        /**
         * Start listen to new messages
         */
        public startListen(): void
        {
            if (!this._startListening) setInterval(
                () => this.listenReceiveMessage(),
                this._listenInterval
            );
        }

        /**
         * Send a simple message to contact or group
         *
         * From: https://gist.github.com/mathloureiro/4c74d60f051ed59650cc76d1da0d32da by @mathloureiro
         *
         * @param messsage Your message
         */
        public sendMessage(message: string): void
        {
            const textBox: Element = document.querySelector([
                '#main', 'footer', 'div.block-compose', 'div.input-container',
                'div.pluggable-input.pluggable-input-compose',
                'div.pluggable-input-body.copyable-text.selectable-text'
            ].join('>'));

            // Shit happens...
            if (!textBox) throw new ReferenceError('Aconteceu algum problema ao enviar essa mensagem');

            const event: Event = new (window['Event'] || window['InputEvent'])('input', {
                bubbles: true
            });
            const date: Date = new Date();

            textBox.textContent = message;
            textBox.dispatchEvent(event);

            (document.querySelector('button.compose-btn-send') as HTMLElement).click();

            this.event.emit('onSend', { message, date });
            this._messagesEmitted[this.hashCode(message, true)] = message;
        }

        /**
         * Process new messages and trigger the event
         */
        private listenReceiveMessage(): void
        {
            // Search new messages on screen
            const lastMessages: Array<Element> = Array.from(document.querySelectorAll('.message-in, .message-out'));

            // Parse the new data
            const receivedMessages: Array<ReceiveEvent> = lastMessages.map((bubbleElem: Element) =>
            {
                const bubbleElement: Element = bubbleElem.querySelector('.bubble');

                // Validate a real bubble box
                if (!bubbleElement) return null;

                const bubbleMetadata: string = bubbleElement.getAttribute('data-pre-plain-text');

                const parsedMessage: ReceiveEvent = {
                    me: bubbleElem.classList.contains('message-out'),
                    message: (bubbleElem.querySelector('.selectable-text') as HTMLElement).innerText,
                    sender: bubbleMetadata.split(']').pop().replace(':', '').trim(),
                    date: new Date(bubbleMetadata.split(']').shift().replace('[', '').trim()),
                    digest: 0,
                    processDigest: this.hashCode(bubbleElem.querySelector('.message-text').getAttribute('data-id'))
                };

                parsedMessage.digest += this.hashCode(parsedMessage);
                parsedMessage.rawElement = bubbleElem;

                return parsedMessage;
            })
            // Eliminate gaps (invalid bubbles)
            .filter((newMessage: ReceiveEvent) => Boolean(newMessage))
            // Filter messages dont sended by the bot
            .filter((newMessage: ReceiveEvent) => this._messagesEmitted[this.hashCode(newMessage.message, true)] === undefined);

            // Is the first run?
            // FIXME: This flag(_processRetroactive) is so fucking bugged. I have no idea why I did this shit.
            if (this._firstRun && !this._processRetroactive)
            {
                console.warn(`Starting now... Omitting about ${lastMessages.length} old messages`);

                // Flaging as processed
                receivedMessages.forEach(message => this._tasksProcessed[message.processDigest] = true);

                this._firstRun = false;
                return;
            }

            // Just fresh messages
            const newMessages: Array<ReceiveEvent> = this._messageBuffer.diffAndMerge(receivedMessages)
                .filter(message => this._tasksProcessed[message.processDigest] === undefined);

            // Emit changes to the bot implementation
            newMessages.forEach(message =>
            {
                this.event.emit('onReceive', message);
                this._tasksProcessed[message.processDigest] = true;
            });
        }

        /**
         * Calculates a checksum of the given object
         *
         * @param obj Your object
         * @param [literal] Remove all special chars
         */
        private hashCode<T>(obj: T, literal?: boolean): number
        {
            let str: string = JSON.stringify(obj);

            if (literal) str = str.replace(/[^a-zA-Z0-9]/g, '');

            return str
                .split('')
                .reduce((a: number, b: string) =>
                {
                    a = ( ( a << 5 ) - a ) + b.charCodeAt(0);

                    return a & a;
                }, 0);
        }
    }
})();
