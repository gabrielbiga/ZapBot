(() => {
    class EventEmitter<T>
    {
        private events: Map<string, Array<EventListenerFn<T>>> = new Map();

        public on(event: string, listener: EventListenerFn<T>): void
        {
            if (!this.events.has(event)) this.events.set(event, []);
            this.events.get(event)!.push(listener);
        }

        public emit(event: string, param: T): void
        {
            if (this.events.has(event))
                this.events.get(event)!.forEach(
                    (listener: EventListenerFn<T>) => listener(param)
                );
        }
    }

    return window['ZapBot'] = class ZapBot
    {
        public readonly event: EventEmitter<BotEvent> = new EventEmitter();
        private _lastReceivedMessageCount: number = 0;

        constructor(
            private _processRetroactive: boolean = false,
            private _startListening: boolean = false,
            private _listenInterval: number = 2000
        )
        {
            if (this._startListening) this.startListen();
        }

        public startListen(): void
        {
            if (!this._startListening) setInterval(
                () => this.listenReceiveMessage(),
                this._listenInterval
            );
        }

        /**
         * From: https://gist.github.com/mathloureiro/4c74d60f051ed59650cc76d1da0d32da by @mathloureiro
         */
        public sendMessage(message: string): void
        {
            const textBox: Element = document.querySelector([
                '#main', 'footer', 'div.block-compose', 'div.input-container',
                'div.pluggable-input.pluggable-input-compose',
                'div.pluggable-input-body.copyable-text.selectable-text'
            ].join('>'));
            const event: Event = new (window['Event'] || window['InputEvent'])('input', {
                bubbles: true
            });
            const date: Date = new Date();

            textBox.textContent = message;
            textBox.dispatchEvent(event);

            (document.querySelector('button.compose-btn-send') as HTMLElement).click();

            this.event.emit('onSend', { message, date });
        }

        private listenReceiveMessage(): void
        {
            const lastMessages: NodeListOf<Element> = document.querySelectorAll('.message-in, .message-out');
            const lastMessagesLen: number = lastMessages.length;

            if (this._lastReceivedMessageCount === 0 && !this._processRetroactive)
            {
                console.warn(`Starting now... Omitting about ${lastMessagesLen} old messages`);
                this._lastReceivedMessageCount = lastMessagesLen;
                return;
            }

            if (this._lastReceivedMessageCount >= lastMessagesLen) return;

            console.warn(`New ${lastMessagesLen - this._lastReceivedMessageCount} messages!`);

            for (let i = this._lastReceivedMessageCount; i < lastMessagesLen; i++)
            {
                const bubbleElem: Element = lastMessages[i];
                const bubbleMetadata: string = bubbleElem.querySelector('.bubble').getAttribute('data-pre-plain-text');

                this.event.emit('onReceive', {
                    rawElement: bubbleElem,
                    me: bubbleElem.classList.contains('message-out'),
                    message: (bubbleElem.querySelector('.selectable-text') as HTMLElement).innerText,
                    sender: bubbleMetadata.split(']').pop().replace(':', '').trim(),
                    date: new Date(bubbleMetadata.split(']').shift().replace('[', '').trim())
                });
            }

            this._lastReceivedMessageCount = lastMessagesLen;
        }
    }
})();
