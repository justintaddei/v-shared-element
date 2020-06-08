# Contributing to v-shared-element

Contributions to v-shared-element, such as issues and pull requests, are very much appreciated.
This is a short note to help make the process as smooth as possible.

## Reporting bugs

Before submitting an issue, please make sure you're using the latest released version.
You can install it with `npm i v-shared-element@latest`.

The best issues contain a reproducible demonstration of the bug in the
form of a [CodeSandbox](https://codesandbox.io/) or similar.
[This Sandbox](https://codesandbox.io/s/v-shared-element-template-792u3) has a basic setup to get started with.
You could also include an animated GIF generated with something like [LICECap](http://www.cockos.com/licecap/) - just drag
it into the editing window when you're writing the issue in GitHub, and it will upload it for you.


## Pull requests

To make a pull request, you should first fork this repository and create a new branch for your changes.

v-shared-element users the Prettier style guide, so please take care to adhere to existing conventions:

* Use `const` and `let`, not `var` - one declaration per line
* Use ES6 features such as arrow functions and template strings
* No semi-colons (execpt where absolutely necessary)
* Single-quotes for strings
* Liberal whitespace

You should run `npm run format` and `npm run lint` to catch any style-related issues in your code.

Above all, code should be clean and readable, and commented where necessary. If you add a new feature,
consider adding a test to go along with it if possible (put your test in the same folder as the source file.
If your file is `new-feature.ts` then your test should be `new-feature.spec.ts`).


## Small print

There's no contributor license agreement - contributions are made on a common sense basis.
v-shared-element is distributed under the MIT license, which means your contributions will be too.
