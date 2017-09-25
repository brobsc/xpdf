import fs from 'fs';
const { app } = require('electron').remote; // eslint-disable-line
const { sep } = require('path');

export default {
  dirString() {
    return `${this.userData()}${sep}temp${sep}`;
  },

  rotatedDir() {
    return `${this.dirString()}${sep}ROTATED${sep}`;
  },

  extractedDir() {
    return `${this.dirString()}${sep}EXTRACTED${sep}`;
  },

  userData() {
    return app.getPath('userData');
  },

  async initializeMasterFolder() {
    try {
      fs.mkdirSync(this.dirString());
    } catch (e) {
      console.log(e); // eslint-disable-line
    }

    await this.createFolder('ROTATED');
    await this.createFolder('EXTRACTED');

    console.log(this.dirString()); // eslint-disable-line
  },

  async createFolder(name) {
    const folderName = `${this.dirString()}${name}${sep}`;

    try {
      fs.mkdirSync(folderName);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }

    return folderName;
  },

  async createChildFolder(name, parent) {
    const folderName = `${parent}${name}${sep}`;

    try {
      fs.mkdirSync(folderName);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }

    return folderName;
  },
};
