// Seu servidor
const BACKEND_ENDPOINT = 'http://localhost:3000';

//https://developer.chrome.com/extensions/messaging
chrome.extension.onConnect.addListener((port) =>
{
    if(port.name !== "zapzop-channel") return;

    console.log('Someone Connected! Channel: ', port.name);

    port.onMessage.addListener((message, ptt) =>
    {
        console.log('Recebi uma msg!', message);

        xhrRequest(message)
            .then((data) =>
            {
                ptt.postMessage({
                    idTask: message.idTask,
                    data: JSON.parse(data)
                });
            });
    });
});

document.addEventListener('DOMContentLoaded', () =>
{
    chrome.tabs.getSelected(null, (tab) =>
    {
        if (!/whatsapp.com/.test(tab.url))
        {
            return document.write('You must run it in zapzopt web');
        }

        document.getElementById('start').addEventListener('click', startBot);
    });
});

function startBot()
{
    chrome.tabs.getSelected(null, (tab) =>
        chrome.tabs.executeScript(tab.id, {
            file: 'backend.bot.js'
        })
    );
}

function xhrRequest(payload)
{
    return new Promise((resolve, reject) =>
    {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', `${BACKEND_ENDPOINT}/api/receive`);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () =>
        {
            if (xhr.readyState === 4)
            {
                resolve(xhr.responseText);
            }
        }

        xhr.send(JSON.stringify(payload));
    });
}
