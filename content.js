console.log('hello from contentscript');

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


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const dictionary = request.data.dictionary;

    switch (request.action) {
        case 'inject_text':
            const activeElement = document.activeElement;
            const tagName = activeElement.tagName.toLowerCase();

            console.log('active tag', tagName);

            switch (tagName) {
                case 'input':
                    activeElement.value += heading[dictionary];

                    fetchWords('heading', dictionary)
                        .then(t => heading[dictionary] = t);
                    break;
                case 'textarea':
                    activeElement.value += paragraph[dictionary];

                    fetchWords('paragraph', dictionary)
                        .then(t => paragraph[dictionary] = t);
                    break;
                case 'iframe':
                    // debugger;
                    console.log('iframe', activeElement);
                    activeElement.contentDocument.body.innerText += paragraph[dictionary];

                    fetchWords('paragraph', dictionary)
                        .then(t => paragraph[dictionary] = t);
                    break;
                default:
                    break;
            }

            console.log('change value');
            break;
    }
});
