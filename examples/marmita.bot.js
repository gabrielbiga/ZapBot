// bot.min.js (Tem que copiar e colar o bundle aqui. Nao da pra carregar no site do Zap)
!function(){var e=function(){function e(){this.events=new Map}return e.prototype.on=function(e,t){this.events.has(e)||this.events.set(e,[]),this.events.get(e).push(t)},e.prototype.emit=function(e,t){this.events.has(e)&&this.events.get(e).forEach(function(e){return e(t)})},e}();window.ZapBot=function(){function t(t,s,n){void 0===t&&(t=!1),void 0===s&&(s=!1),void 0===n&&(n=2e3),this._processRetroactive=t,this._startListening=s,this._listenInterval=n,this.event=new e,this._lastReceivedMessageCount=0,this._startListening&&this.startListen()}return t.prototype.startListen=function(){var e=this;this._startListening||setInterval(function(){return e.listenReceiveMessage()},this._listenInterval)},t.prototype.sendMessage=function(e){var t=document.querySelector(["#main","footer","div.block-compose","div.input-container","div.pluggable-input.pluggable-input-compose","div.pluggable-input-body.copyable-text.selectable-text"].join(">")),s=new(window.Event||window.InputEvent)("input",{bubbles:!0}),n=new Date;t.textContent=e,t.dispatchEvent(s),document.querySelector("button.compose-btn-send").click(),this.event.emit("onSend",{message:e,date:n})},t.prototype.listenReceiveMessage=function(){var e=document.querySelectorAll(".message-in, .message-out"),t=e.length;if(0===this._lastReceivedMessageCount&&!this._processRetroactive)return void(this._lastReceivedMessageCount=t);if(!(this._lastReceivedMessageCount>=t)){for(var s=this._lastReceivedMessageCount;s<t;s++){var n=e[s],i=n.querySelector(".bubble").getAttribute("data-pre-plain-text");this.event.emit("onReceive",{rawElement:n,me:n.classList.contains("message-out"),message:n.querySelector(".selectable-text").innerText,sender:i.split("]").pop().replace(":","").trim(),date:new Date(i.split("]").shift().replace("[","").trim())})}this._lastReceivedMessageCount=t}},t}()}();
// ---

// Instancia do Bot
const zap = new ZapBot();
// BD
const db = new Map();

/**
 * Automatizacao dos pedidos de marmitex
 */
const firstName = (name) => name.split(' ').shift();
function parseMessage(message)
{
    const messageSplited = message.replace('@marmita', '').trim().split(',');

    return {
        vendor: messageSplited[0],
        description: messageSplited[1]
    }
}
function summary()
{
    let summary = '';

    Array.from(db.keys()).forEach(key =>
    {
        const vendor = db.get(key);

        summary += `*${key}*`;
        summary += "\n\n";
        vendor.forEach(order => summary += `${order.owner} - ${order.description} \n`);
        summary += "\n\n";
    });

    return summary === ''
        ? 'Nenhuma marmot ate agora...'
        : summary;
}

zap.sendMessage(
`O *_Marmitão BOT_* está ligado! Faça seu pedido no seguinte formato:
*@marmita <Vendor>, <Description>*
Ex: *@marmita Lorenzo, Light + Arroz integral + Frango*
Use *@marmita resumo* para pegar o relatório`
);

zap.event.on('onReceive', (meta) =>
{
    if (!/@marmita/.test(meta.message.toLowerCase())) return;

    meta.sender = meta.me
                ? 'Gabriel'
                : meta.sender;

    if (firstName(meta.sender) === '+55')
    {
        return zap.sendMessage('Não tenho seu numero cadastrado! :(');
    }

    if (/resumo/.test(meta.message))
    {
        return zap.sendMessage(summary());
    }

    if (/cagado/gi.test(meta.message))
    {
        return;
    }

    if (!meta.message.match(/@marmita\s+([^,]+),(.*?)$/))
    {
        return zap.sendMessage(
            `Ei ${firstName(meta.sender)}, seu pedido ta todo cagado mano.
            Ex: *@marmita Lorenzo, Light + Arroz integral + Frango*`
        );
    }

    const message = parseMessage(meta.message);

    if (!db.has(message.vendor))
    {
        db.set(message.vendor, []);
    }

    const vendorSector = db.get(message.vendor);

    const existingOrder = vendorSector
        .find(order => order.owner === firstName(meta.sender));

    if (existingOrder)
    {
        vendorSector.splice(vendorSector.indexOf(existingOrder), 1);
    }

    vendorSector.push({
        owner: firstName(meta.sender),
        description: message.description
    })

    zap.sendMessage(`Marmot do ${firstName(meta.sender)} lanchada!!`);
    zap.sendMessage(summary());

    console.log('@marmita: ', meta);
});

zap.startListen();