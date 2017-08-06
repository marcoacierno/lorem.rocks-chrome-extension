const loremRocks = {
    heading: {},
    paragraph: {},
};
let currentDictionary = null;

// chrome.storage.local.clear();

chrome.storage.local.get(['dictionary', 'dictionaries'], items => {
    currentDictionary = items.dictionary;

    if (!items.dictionaries) {
        fetchDictionaries()
            .then(apiDictionaries => {
                //
                const dictionaries = apiDictionaries.map(dictionary => ({
                    slug: dictionary.slug,
                    name: dictionary.name,
                }));

                if (!currentDictionary) {
                    currentDictionary = apiDictionaries[0].slug;
                }

                chrome.storage.local.set({
                    dictionaries,
                    dictionary: currentDictionary,
                });

                prepareInitialValues(dictionaries);
            });
    } else {
        prepareInitialValues(items.dictionaries);
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const key in changes) {
        const change = changes[key];

        if (key !== 'dictionary') {
            continue;
        }

        currentDictionary = change.newValue;
    }
});


const prepareInitialValues = dictionaries => {
    dictionaries.forEach(dictionary => {
        const slug = dictionary.slug;

        fetchWords('paragraph', slug);
        fetchWords('heading', slug);
    });
}

const fetchDictionaries = () => {
    return fetch('https://api.lorem.rocks/dictionaries/')
        .then(res => res.json());
};

const fetchWords = (what, dictionary) => {
    const BASE_URL = `https://api.lorem.rocks/dictionaries/${dictionary}/`;
    let finalUrl = '';

    if (loremRocks[what][dictionary] && loremRocks[what][dictionary].isUpdating) {
        return null;
    }

    loremRocks[what][dictionary] = {
        isUpdating: true,
        text: loremRocks[what][dictionary] && loremRocks[what][dictionary].text || '',
    };

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
                .then(res => Promise.resolve(res.text))
                .then(text => {
                    loremRocks[what][dictionary] = {
                        isUpdating: false,
                        text,
                    };
                });
};

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
                heading: loremRocks['heading'][dictionary].text,
                paragraph: loremRocks['paragraph'][dictionary].text,
            },
        }, typeUsed => {
            switch (typeUsed) {
            case 'heading':
                fetchWords('heading', dictionary);
                break;
            case 'paragraph':
                fetchWords('paragraph', dictionary);
                break;
            }
        });
    });
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
