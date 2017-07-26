const dictionarySelect = document.querySelector('#dictionary');
dictionarySelect.addEventListener('change', e => {
    chrome.storage.local.set({ dictionary:  dictionarySelect.value });
});

chrome.storage.local.get('dictionary', items => {
    const dictionary = items.dictionary;
    dictionarySelect.value = dictionary;

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const dictionary = dictionarySelect.value;

        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'inject_text',
            data: {
                dictionary,
            },
        });
    });
});
