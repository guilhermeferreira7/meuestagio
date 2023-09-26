module.exports = {
  presets: ["next/babel"],
  plugins: ["istanbul"],
};

console.dir(module.exports, { depth: null });

// rename .babelrc.test.js to .babelrc.js to run tests
