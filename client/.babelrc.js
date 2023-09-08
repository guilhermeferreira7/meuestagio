const shouldInstrumentCode = process.env.INSTRUMENT_CODE;
console.log("shouldInstrumentCode", shouldInstrumentCode);

module.exports = {
  presets: ["next/babel"],
  plugins: shouldInstrumentCode ? ["istanbul"] : [],
};

console.dir(module.exports, { depth: null });
