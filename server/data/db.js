// server/data/db.js
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);

// Garante que a pasta `data` exista
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const getFile = (name) => path.join(dataDir, `${name}.json`);

function loadJSON(name) {
  try {
    const raw = fs.readFileSync(getFile(name), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveJSON(name, data) {
  fs.writeFileSync(getFile(name), JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  loadJSON,
  saveJSON,
};
