const dictionarySelect = document.querySelector('#dictionary');

dictionarySelect.addEventListener('change', e => {
    chrome.storage.local.set({ dictionary:  dictionarySelect.value });
});

chrome.storage.local.get('dictionary', items => {
    const dictionary = items.dictionary;
    dictionarySelect.value = dictionary;

    chrome.runtime.sendMessage({
        action: 'popup_open',
        data: {
            dictionary,
        }
    });
});
