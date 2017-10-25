# ZapBot

O ZapBot é uma API de programação que permite fazer as operações triviais de um chat (enviar e receber mensagens) dentro do ZapZop Web.
Pull requests são bem vindos... ;)

# Como usar?

1. Abra o web.whatsapp.com
2. Entre na janela de conversa (pode ser um grupo ou pessoa)
3. Cole o código de exemplo no console do browser
```javascript
// Copie aqui o conteúdo do arquivo "/bin/bot.min.js" pois não é possível baixar scripts externos.
// Você pode pegar o arquivo "/examples/simple.bot.js" que está completo.

// Instancia do Bot
const zap = new ZapBot();

/**
 * Exemplo de todas funcionalidades
 */
zap.event.on('onReceive', (meta) =>
{
    if (meta.me)
    {
        return console.log('Recebi uma mensagem de mim mesmo!', meta);
    }

    console.log('Recebi uma mensagem!', meta);
});

zap.event.on('onSend', (meta) =>
{
    console.log('Enviei uma mensagem!', meta);
});

// Começa escutar novas mensagens
zap.startListen();

// Manda um hello world pra testar
zap.sendMessage('Hello world!');
```
4. O bot estará funcionando :)

# Mais exemplos

Dentro da pasta "examples" você pode encontrar mais exemplos de utilização:

* backend.bot - Integração com ZapBot + Chrome Extension + Node.JS 7+ (KOA)
* joao-paulo.bot - Bot sobre o meme do Joao Paulo by @GabrielCoelho
* kejero.bot - Homenagem ao mano Kejero
* marmita.bot - Automatização dos pedidos de marmitex
* responde.bot - Bot chato
* simple.bot - Mesmo exemplo + bundle do README

# RoadMap

- [X] Enviar mensagens (Baseado no gist do @mathloureiro: https://gist.github.com/mathloureiro/4c74d60f051ed59650cc76d1da0d32da)
- [X] Receber mensagens
- [X] Implementar listeners
- [ ] Escutar e enviar mensagens para mais de um grupo ou pessoa
- [ ] Enviar imagens
- [ ] Testes unitários
- [ ] Build melhor (gulp)

# Desenvolvendo

Nota: Esta etapa é necessaria somente caso queira ajudar no desenvolvimento da ferramenta.
O framework é escrito em Typescript e para ajudar é muito fácil...

```bash
npm install
npm run build
```

Feito isso você já fez o build do framework.

# Licença

BSD-3