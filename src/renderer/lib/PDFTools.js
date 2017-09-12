import execa from 'execa';
import fs from 'fs';

export default {
  optionsConstructor(opt, user) {
    if (user === {}) return opt;

    Object.keys(user).forEach((key) => {
      opt[key] = user[key];
    });

    return opt;
  },

  optimize(file, userOptions = {}) {
    let options = {
      quality: 99,
    };

    options = this.optionsConstructor(options, userOptions);

    // TODO: Make temp path
    const newPath = `/Users/bruno/Desktop/temps/${file.name}`;

    execa.shellSync(`gm convert -size 595x842 '${file.realPath}'\
          -background white\
          -compress JPEG\
          -gravity center\
          -rotate '90>'\
          -geometry '595x842>'\
          -extent 595x842\
          -density 150x150\
          -resample 150x150\
          -quality ${options.quality}\
          '${newPath}'`);

    return newPath;
  },

  convert(images, userOptions = {}) {
    let options = {
      quality: 40,
      contrast: 'normal',
    };

    options = this.optionsConstructor(options, userOptions);
    // 40, 1
    // Contrast = 0 --
    // Contrast = 1 NONE
    // Contrast = 2 ++
    // TODO: Use temp path
    // Converts a /path/to/image to "'/path/to/image' "
    // and joins them to get rid of ',' imposed by JS arrays
    let contrastString = '';
    const allPaths = images.map(image => `'${image}' `).join('');

    if (options.contrast === 'decrease') contrastString = '-contrast -contrast';
    else if (options.contrast === 'increase') contrastString = '+contrast +contrast';

    console.log('Default options = ' + JSON.stringify(options)); // eslint-disable-line
    console.log('Current options = ' + JSON.stringify(options)); // eslint-disable-line
    console.log(contrastString); // eslint-disable-line

    const command = `gm convert\
          ${allPaths}\
          ${contrastString}\
          -compress JPEG\
          -quality ${options.quality}\
          /Users/bruno/Desktop/temp.pdf`;

    execa.shellSync(command);
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

  getDirectory(path) {
    const regex = /(.*\/).*/;
    const dir = path.match(regex)[1];

    return dir;
  },

  extractPDF(file) {
    console.log(file); // eslint-disable-line
    const name = this.getFileName(file.path);
    const newPath = `/Users/bruno/Desktop/temps/extracted/${name}`;
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }
    const pdfbox = __dirname + '/pdfbox-app-2.0.6.jar'; // eslint-disable-line
    let resultImages = [];

    execa.shellSync(`java -jar ${pdfbox} PDFToImage -outputPrefix '${newPath}/' '${file.realPath}'`);

    fs.readdirSync(newPath).forEach((file) => {
      const filePath = `${newPath}/${file}`;
      resultImages.push(filePath);
    });

    // natural sort array
    resultImages = resultImages.sort(function(a, b) { // eslint-disable-line
      return +/\d+/.exec(a)[0] - +/\d+/.exec(b)[0];
    });

    const resultFiles = [];

    resultImages.forEach((img) => {
      const contents = fs.readFileSync(img, { encoding: 'utf-8' });
      const fileName = this.getFileNameAndExtension(img);
      const f = new File([contents], fileName, {
        type: 'image/jpg',
      });
      f.realPath = img;
      resultFiles.push(f);
    });

    return resultFiles;
  },
};
