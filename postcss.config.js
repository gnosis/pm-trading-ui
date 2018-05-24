module.exports = {
  sourceMap: true,
  plugins: [
    require('autoprefixer')({
      browsers: ['> 1%', 'last 2 versions'],
    }),
  ],
}
