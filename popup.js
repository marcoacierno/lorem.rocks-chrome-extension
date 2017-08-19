const dictionarySelect = document.querySelector('#dictionary');

dictionarySelect.addEventListener('change', e => {
    console.log('change value to', e);

    const dictionary = dictionarySelect.value;
    chrome.storage.local.set({ dictionary });
});

chrome.storage.local.get(['dictionary', 'dictionaries'], items => {
    const dictionary = items.dictionary;
    dictionarySelect.value = dictionary;

    if (items.dictionaries) {
        setupDictionaries(items.dictionaries, dictionary);
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const key in changes) {
        const change = changes[key];

        if (key !== 'dictionaries') {
            continue;
        }

        const dictionaries = change.newValue;
        setupDictionaries(dictionaries, dictionarySelect.value);
    }
});

function setupDictionaries(dictionaries, active) {
    dictionarySelect.innerHTML = '';

    dictionaries.forEach(dictionary => {
        const option = document.createElement('option');
        option.value = dictionary.slug;
        option.innerText = dictionary.name;

        if (dictionary.slug === active) {
            option.selected = true;
        }

        dictionarySelect.appendChild(option);
    });
}

chrome.runtime.sendMessage({ action: 'popup_open' });
