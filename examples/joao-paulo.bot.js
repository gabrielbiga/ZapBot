//copy the ./bin/bot.min.js to work
!function(){var e=function(){function e(){this.events=new Map}return e.prototype.on=function(e,t){this.events.has(e)||this.events.set(e,[]),this.events.get(e).push(t)},e.prototype.emit=function(e,t){this.events.has(e)&&this.events.get(e).forEach(function(e){return e(t)})},e}(),t=function(){function e(e){void 0===e&&(e=50),this._maxSize=e,this._buffer=[]}return e.prototype.append=function(e){return!this.exists(e.digest)&&(this._buffer.length>=this._maxSize&&this._buffer.shift(),this._buffer.push(e),this._allignBufferHistory(e),!0)},e.prototype.size=function(){return this._buffer.length},e.prototype.exists=function(e){return void 0!==this._buffer.find(function(t){return t.digest===e})},e.prototype._allignBufferHistory=function(e){if(!this._newerItem)return void(this._newerItem=e.date);e.date>this._newerItem&&(this._newerItem=e.date)},e.prototype.diffAndMerge=function(e){var t=this,s=this._newerItem||new Date;return s.setMinutes(s.getMinutes()-1),e.filter(function(e){return t.append(e)}).filter(function(e){return e.date>=s})},e}();window.ZapBot=function(){function s(s,n,i){void 0===s&&(s=!1),void 0===n&&(n=!1),void 0===i&&(i=2e3),this._processRetroactive=s,this._startListening=n,this._listenInterval=i,this._firstRun=!0,this._messageBuffer=new t,this._messagesEmitted={},this._tasksProcessed={},this.event=new e,this._startListening&&this.startListen()}return s.prototype.startListen=function(){var e=this;this._startListening||setInterval(function(){return e.listenReceiveMessage()},this._listenInterval)},s.prototype.sendMessage=function(e){var t=document.querySelector(["#main","footer","div.block-compose","div.input-container","div.pluggable-input.pluggable-input-compose","div.pluggable-input-body.copyable-text.selectable-text"].join(">"));if(!t)throw new ReferenceError("Aconteceu algum problema ao enviar essa mensagem");var s=new(window.Event||window.InputEvent)("input",{bubbles:!0}),n=new Date;t.textContent=e,t.dispatchEvent(s),document.querySelector("button.compose-btn-send").click(),this.event.emit("onSend",{message:e,date:n}),this._messagesEmitted[this.hashCode(e,!0)]=e},s.prototype.listenReceiveMessage=function(){var e=this,t=Array.from(document.querySelectorAll(".message-in, .message-out")),s=t.map(function(t){var s=t.querySelector(".bubble");if(!s)return null;var n=s.getAttribute("data-pre-plain-text"),i={me:t.classList.contains("message-out"),message:t.querySelector(".selectable-text").innerText,sender:n.split("]").pop().replace(":","").trim(),date:new Date(n.split("]").shift().replace("[","").trim()),digest:0,processDigest:e.hashCode(t.querySelector(".message-text").getAttribute("data-id"))};return i.digest+=e.hashCode(i),i.rawElement=t,i}).filter(function(e){return Boolean(e)}).filter(function(t){return void 0===e._messagesEmitted[e.hashCode(t.message,!0)]});if(this._firstRun&&!this._processRetroactive)return s.forEach(function(t){return e._tasksProcessed[t.processDigest]=!0}),void(this._firstRun=!1);this._messageBuffer.diffAndMerge(s).filter(function(t){return void 0===e._tasksProcessed[t.processDigest]}).forEach(function(t){e.event.emit("onReceive",t),e._tasksProcessed[t.processDigest]=!0})},s.prototype.hashCode=function(e,t){var s=JSON.stringify(e);return t&&(s=s.replace(/[^a-zA-Z0-9]/g,"")),s.split("").reduce(function(e,t){return(e=(e<<5)-e+t.charCodeAt(0))&e},0)},s}()}();

//instantiate the class ZapBot
const zap = new ZapBot();

/*
Start to listen to any new received messages
*/
zap.startListen();

/*
create the array with the Strings.
Note: Everytime that we mention "João Paulo", you can change to your Name!
This will make this bot more real to your contacts.
*/
var joaoPaulo = [
    'Bom dia... é exatamente 8:15 da manhã!',
    'O dia nem começou ainda... Mas eu já fui derrotado umas 6 vezes',
    'Minha vida é uma merda',
    'Morrendo de fome aqui, fui abrir a geladeira. Não tinha nada... só a luz',
    'E a vontade de chorar é inevitavel',
    'Todo mundo realizando os seus sonhos, conseguindo suas coisas *e eu na merda*',
    'Na merda, na merda, na merda...',
    'Sabe o estágio da sua vida em que você parou? Que você não faz mais nada? Não vai pra frente nem pra trás?',
    'Nem merda você consegue fazer mais que você estacionou na sua vida...',
    'Se existe uma definição, maior pra merda o nome é João Paulo!',
    'é um adjetivo, substantivo, um nome próprio tudo junto...',
    'Quando você for xingar seu filho, sua mãe, seus irmãos... não diga seu FDP...grite \'Seu joão paulo...\'',
    'A vontade de rir é grande, mas a de chorar é maior',
    'Meu Deus, o que que eu fui fazer com a minha vida?',
    'Eu to chorando ó... ',
    '*_Caralho eu sou um MERDA MERMÃO_*',
    'Será que um dia eu vou vencer na vida? Eu tenho certeza que não!',
    'Eu sou realista... é daqui pra pior',
    '_caralho eu vou sair aqui que eu to com vontade de chorar bicho_'
];
/*
 Function that return all the Strings.
 Note: don't care too much about the MacGyverism in this part of code.
 I'm still learning JS, be nice!
*/
var index = 0;
  function returnMessage(){
  index ++;

  if(index >= 19){
    clearInterval(timer);
    timer = undefined;
  }

  console.log(index);
  return joaoPaulo[index-1];
}

/*
Initiate the bot.
Note: This bot will only do the script once. This is all the script of the João Paulo's meme video.
*/

let timer = setInterval(
  () => zap.sendMessage(returnMessage()),
  5000 //you can add more milliseconds to do it more dramatically
);
