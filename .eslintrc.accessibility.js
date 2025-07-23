module.exports = {
    extends: [
        'plugin:jsx-a11y/recommended',
    ],
    plugins: [
        'jsx-a11y',
    ],
    rules: {
        // Enforce ARIA attributes are valid and not misspelled
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',

        // Enforce that all elements that require alternative text have meaningful information
        'jsx-a11y/alt-text': 'error',

        // Enforce that anchors have content and that the content is accessible to screen readers
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/anchor-is-valid': 'error',

        // Enforce that heading elements (h1, h2, etc.) have content
        'jsx-a11y/heading-has-content': 'error',

        // Enforce that HTML elements have a lang prop
        'jsx-a11y/html-has-lang': 'error',

        // Enforce that <img> elements have alt prop
        'jsx-a11y/img-redundant-alt': 'error',

        // Enforce that <label> elements have the htmlFor prop
        'jsx-a11y/label-has-associated-control': 'error',

        // Enforce that the accessKey prop is not used on any element
        'jsx-a11y/no-access-key': 'error',

        // Enforce tabIndex value is not greater than zero
        'jsx-a11y/tabindex-no-positive': 'error',
    },
};
