let tabId = null;

chrome.tabs.getSelected(null, (tab) =>
{
    tabId = tab.id;

    const log = (message) => chrome.tabs.executeScript(tab.id, {
        code: `console.warn('${message}')`
    });

    if (!/whatsapp.com/.test(tab.url))
    {
        return log('You must run it in zapzap web');
    }

    if (typeof tab.zap !== 'undefined')
    {
        return log('ZapBot already started!');
    }

    chrome.tabs.executeScript(tab.id, {
        file: 'marmita.bot.js'
    });

    log('ZapBot started!');
});

document.addEventListener('DOMContentLoaded', () =>
{
    document.getElementById('clearbtn').addEventListener('click', clear);
});

function clear()
{
    if (!tabId)
    {
        return alert('Not Loaded!');
    }

    chrome.tabs.executeScript(tabId, {
        code: `marmitaDB.clear(); zap.sendMessage('Marmitas apagadas! Vlw Flw.');`
    });
}
