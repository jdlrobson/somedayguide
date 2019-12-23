const CACHE_KEY = process.env.CACHE_KEY || Math.random();

module.exports = {
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-transform-react-jsx", { "pragma":"h" }],
    ["transform-define", {
      "process.env.CACHE_KEY": CACHE_KEY
    }]
  ]
};
