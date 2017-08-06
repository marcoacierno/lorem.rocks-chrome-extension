console.log('content script');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('content script: ', request);
    switch (request.action) {
        case 'inject_text':
            const heading = request.data.heading;
            const paragraph = request.data.paragraph;

            const activeElement = document.activeElement;
            const tagName = activeElement.tagName.toLowerCase();

            console.log('active tag', tagName);

            switch (tagName) {
                case 'textarea':
                    activeElement.value += paragraph;
                    sendResponse('paragraph');
                    break;
                case 'input':
                    activeElement.value += heading;
                    sendResponse('heading');
                    break;
                case 'iframe':
                    activeElement.contentDocument.body.innerText += paragraph;
                    sendResponse('paragraph');
                    break;
                default:
                    break;
            }

            console.log('change value');
            break;
    }
});
