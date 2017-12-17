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
        const oldScriptTag = document.querySelector('#loremrocks-inject');

        if (oldScriptTag !== null) {
            oldScriptTag.parentNode.removeChild(oldScriptTag);
        }

        const script = document.createElement('script');
        script.id = 'loremrocks-inject';
        const injectTextCode = `
            loremRocksFocusedEditor = tinymce.focusedEditor;

            if (loremRocksFocusedEditor !== null) {
                loremRocksFocusedEditor.insertContent("${text}");
            }
        `;
        script.appendChild(document.createTextNode(injectTextCode));
        document.body.appendChild(script);
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
