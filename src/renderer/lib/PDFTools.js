import sharp from 'sharp';
import execa from 'execa';
import fs from 'fs';
import fileType from 'file-type';
import readChunk from 'read-chunk';
import FolderTools from './FolderTools.js';

export default {
  async createPDFThumbnail(file, userOptions = {}) {
    let options = {
      heightSize: 150,
    };

    options = this.optionsConstructor(options, userOptions);

    if (this.getFileExtension(file.realPath) !== 'pdf') return file;

    const newName = `${this.getFileName(file.realPath)}-thumb.jpg`;
    const newPathName = FolderTools.thumbsDir();
    const newPath = `${newPathName}${newName}`;

    const command1 = `gm convert\
          '${file.realPath}'[0]\
          -size 'x${options.heightSize}'\
          -compress JPEG\
          -geometry 'x${options.heightSize}'\
          '${newPath}'`;

    execa.shellSync(command1);

    const f = await this.fileGenerator(newPath);

    return f;
  },

  async fileGenerator(path) {
    const contents = fs.readFileSync(path, { encoding: 'utf-8' });
    const fileName = this.getFileNameAndExtension(path);
    const f = new File([contents], fileName, {
      type: 'image/jpg',
    });
    f.realPath = path;

    return f;
  },

  async pdfGenerator(path) {
    const contents = fs.readFileSync(path);
    const fileName = this.getFileNameAndExtension(path);
    const f = new File([contents], fileName, {
      type: 'application/pdf',
    });
    f.realPath = path;

    return f;
  },

  optionsConstructor(opt, user) {
    if (user === {}) return opt;

    Object.keys(user).forEach((key) => {
      opt[key] = user[key];
    });

    return opt;
  },

  async rotate(file) {
    const newName = `${this.getFileName(file.realPath)}-rotated.jpg`;
    const newPathName = FolderTools.rotatedDir();
    const newPath = `${newPathName}${newName}`;

    await sharp(file.realPath)
      .rotate(-90)
      .jpeg({ quality: 100 })
      .toFile(newPath);

    const f = await this.fileGenerator(newPath);

    return f;
  },

  async optimize(file, userOptions = {}) {
    let options = {
      quality: 100,
    };

    options = this.optionsConstructor(options, userOptions);

    // TODO: Make temp path
    const newPath = `${FolderTools.dirString()}${file.name}`;

    const image = sharp(file.realPath);
    // const metadata = await image.metadata();

    // if (metadata.width > metadata.height) {
    //   await image.rotate(-90);
    // }

    await image
      .background('white')
      .max()
      .embed()
      .jpeg({ quality: options.quality })
      .toFile(newPath);

    // execa.shellSync(`gm convert -size 595x842 '${file.realPath}'\
    //       -background white\
    //       -compress JPEG\
    //       -gravity center\
    //       -rotate '90>'\
    //       -geometry '595x842>'\
    //       -extent 595x842\
    //       -density 150x150\
    //       -resample 150x150\
    //       -quality ${options.quality}\
    //       '${newPath}'`);

    const f = this.fileGenerator(newPath);
    return f;
  },

  async convertToPDF(images, userOptions = {}) {
    let options = {
      quality: 40,
      contrast: 'normal',
    };

    options = this.optionsConstructor(options, userOptions);
    let contrastString = '';
    const allPaths = images.map(image => `'${image.realPath}' `).join('');

    if (options.contrast === 'decrease') contrastString = '-contrast -contrast';
    else if (options.contrast === 'increase') contrastString = '+contrast +contrast';

    const firstMethodPath = `${FolderTools.pdfsDir()}01.pdf`;
    const secondMethodPath = `${FolderTools.pdfsDir()}02.pdf`;

    const command1 = `gm convert\
          ${allPaths}\
          ${contrastString}\
          -compress JPEG\
          -gravity center\
          -background white\
          -geometry '595x842>'\
          -extent 595x842\
          -density 96x96\
          -resample 96x96\
          -define jpeg:preserve-settings\
          '${firstMethodPath}'`;

    const command2 = `img2pdf ${allPaths} --without-pdfrw -f shrink -S A4 -o '${secondMethodPath}'`;

    execa.shellSync(command1);
    execa.shellSync(command2);

    const result1 = await this.pdfGenerator(firstMethodPath);
    const result2 = await this.pdfGenerator(secondMethodPath);

    return [result1, result2];
  },

  getSize(file) {
    const command = execa.shellSync(`gm identify -format "%w %h" '${file}'`);
    const result = command.stdout.split(' ');

    return result;
  },

  getFileNameAndExtension(path) {
    // const regex = /.*\/(.*)\./;
    const regex = /.*\/(.*)/;
    const nameAndExt = path.match(regex)[1];

    return nameAndExt;
  },

  getFileName(path) {
    const regex = /.*\/(.*)\..*/;
    const name = path.match(regex)[1];

    return name;
  },

  getFileExtension(path) {
    const chunk = readChunk.sync(path, 0, 4100);
    const ext = fileType(chunk).ext;

    return ext;
  },

  getDirectory(path) {
    const regex = /(.*\/).*/;
    const dir = path.match(regex)[1];

    return dir;
  },

  async extractPDF(file) {
    console.log(file); // eslint-disable-line
    const name = this.getFileName(file.realPath);
    const newPath = await FolderTools.createChildFolder(name, FolderTools.extractedDir());
    const pdfbox = __dirname + '/pdfbox-app-2.0.6.jar'; // eslint-disable-line
    let resultImages = [];

    await execa.shell(`java -jar ${pdfbox} PDFToImage -outputPrefix '${newPath}/${name}-' '${file.realPath}'`);

    fs.readdirSync(newPath).forEach((newFile) => {
      // TODO: Check if file is a valid image
      const filePath = `${newPath}/${newFile}`;
      resultImages.push(filePath);
    });

    // natural sort array
    resultImages = resultImages.sort(function(a, b) { // eslint-disable-line
      return +/\d+/.exec(a)[0] - +/\d+/.exec(b)[0];
    });

    const resultFiles = [];

    resultImages.forEach(async (img) => {
      const f = await this.fileGenerator(img);
      resultFiles.push(f);
    });

    return resultFiles;
  },
};
