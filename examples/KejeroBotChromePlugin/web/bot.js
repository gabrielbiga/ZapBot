// bot.min.js (Tem que copiar e colar o bundle aqui. Nao da pra carregar no site do Zap)
!function(){var e=function(){function e(){this.events=new Map}return e.prototype.on=function(e,t){this.events.has(e)||this.events.set(e,[]),this.events.get(e).push(t)},e.prototype.emit=function(e,t){this.events.has(e)&&this.events.get(e).forEach(function(e){return e(t)})},e}();window.ZapBot=function(){function t(t,s,n){void 0===t&&(t=!1),void 0===s&&(s=!1),void 0===n&&(n=2e3),this._processRetroactive=t,this._startListening=s,this._listenInterval=n,this.event=new e,this._lastReceivedMessageCount=0,this._startListening&&this.startListen()}return t.prototype.startListen=function(){var e=this;this._startListening||setInterval(function(){return e.listenReceiveMessage()},this._listenInterval)},t.prototype.sendMessage=function(e){var t=document.querySelector(["#main","footer","div.block-compose","div.input-container","div.pluggable-input.pluggable-input-compose","div.pluggable-input-body.copyable-text.selectable-text"].join(">")),s=new(window.Event||window.InputEvent)("input",{bubbles:!0}),n=new Date;t.textContent=e,t.dispatchEvent(s),document.querySelector("button.compose-btn-send").click(),this.event.emit("onSend",{message:e,date:n})},t.prototype.listenReceiveMessage=function(){var e=document.querySelectorAll(".message-in, .message-out"),t=e.length;if(0===this._lastReceivedMessageCount&&!this._processRetroactive)return void(this._lastReceivedMessageCount=t);if(!(this._lastReceivedMessageCount>=t)){for(var s=this._lastReceivedMessageCount;s<t;s++){var n=e[s],i=n.querySelector(".bubble").getAttribute("data-pre-plain-text");this.event.emit("onReceive",{rawElement:n,me:n.classList.contains("message-out"),message:n.querySelector(".selectable-text").innerText,sender:i.split("]").pop().replace(":","").trim(),date:new Date(i.split("]").shift().replace("[","").trim())})}this._lastReceivedMessageCount=t}},t}()}();
// ---

// Instancia do Bot
const zap = new ZapBot();
const randomInt = (min, max) => Math.floor(Math.random() * (max-min+1) + min);
const firstName = (name) => name.split(' ').shift();

/**
 * Bot em homenagem ao nosso mano Kejero
 */
const eaeMessages = [
    'Vai toma no seu cu seu mukirana viado',
    'Rato inescrupuloso do caralho',
    'Isso ai é extremamente facil, faço em 1 minuto',
    'Quem ta tiltado é vc, eu to suave',
    'Pra que gastar se podemos nao gastar?',
    'Free é mais gostoso, nao é?',
    'kek?',
    'COKcolla 8====D'
];

const names = {
    'Adolpho': 'Felpuda',
    'Felipe': 'Carequinha',
    'Leandro': 'Frangolho',
    'Gabriel': 'Bugado',
    'Thiago': 'Kejero(FAKE)',
    'Emerson': 'Kingão',
    'Paulo': 'Cagão',
    'Rafael': 'Peretta FDP'
};

zap.sendMessage(
`▒▒▒▒▒▒▒▓
▒▒▒▒▒▒▒▓▓▓
▒▓▓▓▓▓▓░░░▓
▒▓░░░░▓░░░░▓
▓░░░░░░▓░▓░▓
▓░░░░░░▓░░░▓
▓░░▓░░░▓▓▓▓
▒▓░░░░▓▒▒▒▒▓
▒▒▓▓▓▓▒▒▒▒▒▓
▒▒▒▒▒▒▒▒▓▓▓▓
▒▒▒▒▒▓▓▓▒▒▒▒▓
▒▒▒▒▓▒▒▒▒▒▒▒▒▓
▒▒▒▓▒▒▒▒▒▒▒▒▒▓
▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓
▒▓▒▓▒▒▒▒▒▒▒▒▒▓
▒▓▒▓▓▓▓▓▓▓▓▓▓
▒▓▒▒▒▒▒▒▒▓
▒▒▓▒▒▒▒▒▓
kk eae men. Eu sou o *Kejero B0T*!!!!
Pra falar cmg é só usar: *@kejero* no começo da frase.`
);

zap.event.on('onReceive', (meta) =>
{
    if (!/@kejero/.test(meta.message.toLowerCase())) return;

    const senderFirstName = firstName(meta.sender);
    meta.sender = meta.me
                ? names['Gabriel']
                : names[senderFirstName] || meta.sender;

    if (/boa/.test(meta.message))
    {
        zap.sendMessage(`${senderFirstName}, a boa hoje é comer variuz keju kjkjk`);
    }
    else if (/cu/.test(meta.message))
    {
        zap.sendMessage(`Ow ${senderFirstName} seu fdp, vai toma no cu vc`);
    }
    else if (/cock/.test(meta.message))
    {
        zap.sendMessage(`@${senderFirstName} COCK-COLLA 8========D`);
    }
    else
    {
        zap.sendMessage(
            `Eae ${senderFirstName}! ${eaeMessages[randomInt(0, eaeMessages.length -1)]}`
        );
    }

    console.log('@kejero: ', meta);
});

zap.startListen();