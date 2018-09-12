const presets = [
  '@babel/preset-env'
]

const plugins = [
  '@babel/plugin-syntax-dynamic-import',
  ['@babel/plugin-transform-runtime', {helpers: false}],
  ['component', {'libraryName': 'element-ui', 'styleLibraryName': 'theme-chalk'}]
]

module.exports = {presets, plugins}
