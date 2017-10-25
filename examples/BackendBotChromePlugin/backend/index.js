const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('koa-router')({ prefix: '/api' });
const koaRequest = require('koa-http-request');

const app = new Koa();

app.use(koaRequest({
    json: true, //automatically parsing of JSON response
    timeout: 10000    //10s timeout
}));

class OperationList
{
    constructor()
    {
        this.operations = [];
    }

    sendMessage(text)
    {
        this.operations.push({ type: 'SEND_MSG', text});
    }
}

router.post('/receive', koaBody(), async (ctx, next) =>
{
    const operations = ctx.body = new OperationList();
    const messageMetadata = ctx.request.body.data;

    console.log(messageMetadata);

    if (/forecast/.test(messageMetadata.message))
    {
        const placeMsg = messageMetadata.message.split('forecast').pop().trim();

        let forecast = await ctx.get(
            `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in \
            (select woeid from geo.places(1) where text='${encodeURIComponent(placeMsg)}')&format=json`
        );

        if (!forecast.query.results)
        {
            return operations.sendMessage(`E ae ${messageMetadata.sender}?! Nem achei essa cidade...`);
        }

        const place = forecast.query.results.channel.location;
        const placeName = `${place.city}/${place.region}, ${place.country}`;
        const weather = forecast.query.results.channel.item.forecast[0];

        return operations.sendMessage(
            `E ae ${messageMetadata.sender}?! A previsão do tempo para ${placeName} ` +
            `é max de ${weather.high} e minima ${weather.low} e o status é ${weather.text}`
        );
    }

    operations.sendMessage(`Hello *${messageMetadata.sender}* from NodeJS!`);
})

app.use(router.routes());

app.listen(3000);
