console.log('hello from background');
let currentDictionary = null;

chrome.storage.local.get('dictionary', items => {
    currentDictionary = items.dictionary;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (const key in changes) {
        const change = changes[key];

        if (key !== 'dictionary') {
            continue;
        }

        currentDictionary = change.newValue;
    }
});


const fetchWords = (what, dictionary) => {
    const BASE_URL = `https://api.lorem.rocks/dictionaries/${dictionary}/`;
    let finalUrl = '';

    switch (what) {
    case 'paragraph':
        finalUrl = `${BASE_URL}paragraph/`;
        break;
    case 'heading':
        finalUrl = `${BASE_URL}heading/`;
        break;
    }

    return fetch(finalUrl)
                .then(res => res.json())
                .then(res => Promise.resolve(res.text));
};

let paragraph = {};
let heading = {};

fetchWords('paragraph', 'ipsum')
    .then(t => paragraph['ipsum'] = t);

fetchWords('heading', 'ipsum')
    .then(t => heading['ipsum'] = t);

fetchWords('paragraph', 'macaroni')
    .then(t => paragraph['macaroni'] = t);

fetchWords('heading', 'macaroni')
    .then(t => heading['macaroni'] = t);


function sendInjectText(dictionary, force=false) {
    let action;
    switch (force) {
    case 'paragraph':
        action = 'inject_paragraph';
        break;
    case 'heading':
        action = 'inject_heading';
        break;
    default:
        action = 'inject_text';
        break;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            action,
            data: {
                heading: heading[dictionary],
                paragraph: paragraph[dictionary],
            },
        }, typeUsed => {
            console.log('answer', typeUsed);

            switch (typeUsed) {
            case 'heading':
                fetchWords('heading', dictionary)
                    .then(t => heading[dictionary] = t);
                break;
            case 'paragraph':
                fetchWords('paragraph', dictionary)
                    .then(t => paragraph[dictionary] = t);
                break;
            }
        });
    });

    if (!force) {

    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message, sender, sendResponse);

    if (message.action === 'popup_open') {
        sendInjectText(currentDictionary);
    }
});

chrome.commands.onCommand.addListener(command => {
    console.log('Command:', command);
    switch (command) {
    case 'insert-heading':
        sendInjectText(currentDictionary, 'heading');
        break;
    case 'insert-paragraph':
        sendInjectText(currentDictionary, 'paragraph');
        break;
    case 'fill':
        sendInjectText(currentDictionary);
        break;
    }
});
