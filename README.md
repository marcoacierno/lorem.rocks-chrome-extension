# lorem.rocks chrome extension

This extensions allows you to insert dummy text, taken from [lorem.rocks](https://lorem.rocks) in the active input. If the active input is an input dom element,
it will insert a `heading`. If the current active input is a textarea or an iframe (tbd, integrate with tinymce)
it will insert a `paragraph`.

## How to use

### Via Browser icon

You can click the browser icon to:

- Insert dummy text in the active input
- Change dictionary used

### Via shortcut

The extension provides three shortcuts:

- `Ctrl + F` => Fill, it's the same as clicking the browser icon. Inserts a paragraph or heading based on the active dom element type.
- `Ctrl + H` => Always inserts a heading
- `Ctrl + P` => Always inserts a paragraph
