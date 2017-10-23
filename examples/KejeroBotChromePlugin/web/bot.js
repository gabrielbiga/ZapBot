// bot.min.js (Tem que copiar e colar o bundle aqui. Nao da pra carregar no site do Zap)
!function(){var e=function(){function e(){this.events=new Map}return e.prototype.on=function(e,t){this.events.has(e)||this.events.set(e,[]),this.events.get(e).push(t)},e.prototype.emit=function(e,t){this.events.has(e)&&this.events.get(e).forEach(function(e){return e(t)})},e}(),t=function(){function e(e){void 0===e&&(e=50),this._maxSize=e,this._buffer=[]}return e.prototype.append=function(e){return!this.exists(e.digest)&&(this._buffer.length>=this._maxSize&&this._buffer.shift(),this._buffer.push(e),this._allignBufferHistory(e),!0)},e.prototype.size=function(){return this._buffer.length},e.prototype.exists=function(e){return void 0!==this._buffer.find(function(t){return t.digest===e})},e.prototype._allignBufferHistory=function(e){if(!this._newerItem)return void(this._newerItem=e.date);e.date>this._newerItem&&(this._newerItem=e.date)},e.prototype.diffAndMerge=function(e){var t=this,s=this._newerItem||new Date;return s.setMinutes(s.getMinutes()-1),e.filter(function(e){return t.append(e)}).filter(function(e){return e.date>=s})},e}();window.ZapBot=function(){function s(s,n,i){void 0===s&&(s=!1),void 0===n&&(n=!1),void 0===i&&(i=2e3),this._processRetroactive=s,this._startListening=n,this._listenInterval=i,this._firstRun=!0,this._messageBuffer=new t,this._messagesEmitted={},this._tasksProcessed={},this.event=new e,this._startListening&&this.startListen()}return s.prototype.startListen=function(){var e=this;this._startListening||setInterval(function(){return e.listenReceiveMessage()},this._listenInterval)},s.prototype.sendMessage=function(e){var t=document.querySelector(["#main","footer","div.block-compose","div.input-container","div.pluggable-input.pluggable-input-compose","div.pluggable-input-body.copyable-text.selectable-text"].join(">"));if(!t)throw new ReferenceError("Aconteceu algum problema ao enviar essa mensagem");var s=new(window.Event||window.InputEvent)("input",{bubbles:!0}),n=new Date;t.textContent=e,t.dispatchEvent(s),document.querySelector("button.compose-btn-send").click(),this.event.emit("onSend",{message:e,date:n}),this._messagesEmitted[this.hashCode(e,!0)]=e},s.prototype.listenReceiveMessage=function(){var e=this,t=Array.from(document.querySelectorAll(".message-in, .message-out")),s=t.map(function(t){var s=t.querySelector(".bubble");if(!s)return null;var n=s.getAttribute("data-pre-plain-text"),i={me:t.classList.contains("message-out"),message:t.querySelector(".selectable-text").innerText,sender:n.split("]").pop().replace(":","").trim(),date:new Date(n.split("]").shift().replace("[","").trim()),digest:0,processDigest:e.hashCode(t.querySelector(".message-text").getAttribute("data-id"))};return i.digest+=e.hashCode(i),i.rawElement=t,i}).filter(function(e){return Boolean(e)}).filter(function(t){return void 0===e._messagesEmitted[e.hashCode(t.message,!0)]});if(this._firstRun&&!this._processRetroactive)return s.forEach(function(t){return e._tasksProcessed[t.processDigest]=!0}),void(this._firstRun=!1);this._messageBuffer.diffAndMerge(s).filter(function(t){return void 0===e._tasksProcessed[t.processDigest]}).forEach(function(t){e.event.emit("onReceive",t),e._tasksProcessed[t.processDigest]=!0})},s.prototype.hashCode=function(e,t){var s=JSON.stringify(e);return t&&(s=s.replace(/[^a-zA-Z0-9]/g,"")),s.split("").reduce(function(e,t){return(e=(e<<5)-e+t.charCodeAt(0))&e},0)},s}()}();
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
    'Rafael': 'Peretta_Ladrao',
    'Andre': 'Moreno'
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
    const compare = (regex) => regex.test(meta.message.toLowerCase());

    if (!compare(/@kejero/)) return;

    meta.sender = meta.me
                ? names['Gabriel']
                : names[firstName(meta.sender)] || meta.sender;

    if (compare(/boa/))
    {
        zap.sendMessage(`${meta.sender}, a boa hoje é comer variuz keju kjkjk`);
    }
    else if (compare(/cu/))
    {
        zap.sendMessage(`Ow ${meta.sender} seu fdp, vai toma no cu vc`);
    }
    else if (compare(/cock/))
    {
        zap.sendMessage(`@${meta.sender} COCK-COLLA 8========D`);
    }
    else if (compare(/drone/))
    {
        zap.sendMessage(`@${meta.sender}, ` + [
            'Ta nadando na praia',
            'foda-se',
            'vai tomar no cu',
            'ta nadando no puteiro da sua mae'
        ][randomInt(0, 3)]);
    }
    else
    {
        zap.sendMessage(
            `Eae ${meta.sender}! ${eaeMessages[randomInt(0, eaeMessages.length -1)]}`
        );
    }

    console.log('@kejero: ', meta);
});

zap.startListen();