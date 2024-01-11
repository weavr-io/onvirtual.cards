module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'standard',
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'vue/valid-v-slot': [
            'error',
            {
                allowModifiers: true,
            },
        ],
        'import/named': 0,
    },
}
