const configGlobal = require('./config-global');

let configLocal;
try {
  configLocal = require('./config_local');
} catch (e) {
  console.info('you can override global config by config_local.js');
  configLocal = {};
}

const config = { ...configGlobal, ...configLocal }

export default config;
