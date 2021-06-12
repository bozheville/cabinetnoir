const fs = require('fs');

const appVersion = JSON.parse(fs.readFileSync('./package.json')).version;
const time = Date.now();

fs.writeFileSync('./public/release-info.json', JSON.stringify({
  time,
  version: appVersion,
}));
