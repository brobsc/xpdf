import fs from 'fs';
const { app } = require('electron').remote; // eslint-disable-line
const { sep } = require('path');

export default {
  dirString() {
    return `${this.userData()}${sep}temp${sep}`;
  },

  rotatedDir() {
    return `${this.dirString()}ROTATED${sep}`;
  },

  extractedDir() {
    return `${this.dirString()}EXTRACTED${sep}`;
  },

  thumbsDir() {
    return `${this.dirString()}THUMBS${sep}`;
  },

  userData() {
    return app.getPath('userData');
  },

  async initializeMasterFolder() {
    try {
      fs.mkdirSync(this.dirString());
    } catch (e) {
      if (e.code !== 'EEXIST') {
        console.log(e); // eslint-disable-line
        throw e;
      }
    }
    await this.createFolder('ROTATED');
    await this.createFolder('EXTRACTED');
    await this.createFolder('THUMBS');
  },

  async createFolder(name) {
    const folderName = `${this.dirString()}${name}${sep}`;

    try {
      fs.mkdirSync(folderName);
    } catch (e) {
      if (e.code !== 'EEXIST') {
        console.log(e); // eslint-disable-line
        throw e;
      }
    }

    return folderName;
  },

  async createChildFolder(name, parent) {
    const folderName = `${parent}${name}${sep}`;

    try {
      fs.mkdirSync(folderName);
    } catch (e) {
      if (e.code !== 'EEXIST') {
        console.log(e); // eslint-disable-line
        throw e;
      }
    }

    return folderName;
  },
};
