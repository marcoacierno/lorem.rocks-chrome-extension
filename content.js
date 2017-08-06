console.log('content script');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const activeElement = document.activeElement;
    const tagName = activeElement.tagName.toLowerCase();

    switch (request.action) {
    case 'inject_paragraph':
        setText(
            activeElement,
            request.data.paragraph,
        );
        sendResponse('paragraph');
        break;
    case 'inject_heading':
        setText(
            activeElement,
            request.data.heading,
        );
        sendResponse('heading');
        break;
    case 'inject_text':
        const heading = request.data.heading;
        const paragraph = request.data.paragraph;
        const textType = inputToTextType(tagName);

        setText(
            activeElement,
            textType === 'paragraph' ? paragraph : heading
        );

        sendResponse(textType);
        break;
    }
});

function setText(to, text) {
    switch (to.tagName.toLowerCase()) {
    case 'textarea':
    case 'input':
        to.value += text;
        break;
    case 'iframe':
        to.contentDocument.body.innerText += text;
        break;
    }
}

function inputToTextType(tagName) {
    switch (tagName) {
    case 'textarea':
    case 'iframe':
        return 'paragraph';
    case 'input':
        return 'heading';
    default:
        return null;
    }
}
