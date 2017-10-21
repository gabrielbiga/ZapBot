

chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {file: "bot.js"});
});
