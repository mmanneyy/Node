const { access } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');

const store = (pathName) => {
  const DATA_PATH = path.join(__dirname, '../data', pathName + '.json');

  const writeData = async (data) => {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  };

  const checkFileExist = async (path) => {
    try {
      await fs.access(path);
    } catch {
      await fs.writeFile(path, '{}');
    }
  };
  const readData = async () => {
    try {
      await checkFileExist(DATA_PATH);
      const data = await fs.readFile(DATA_PATH, 'utf8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  };

  return { writeData, readData };
};

module.exports = store;