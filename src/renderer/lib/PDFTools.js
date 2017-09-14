import sharp from 'sharp';
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

  async optimize(file, userOptions = {}) {
    let options = {
      quality: 100,
    };

    options = this.optionsConstructor(options, userOptions);

    // TODO: Make temp path
    const newPath = `/Users/bruno/Desktop/temps/${file.name}`;

    const image = sharp(file.realPath);
    const metadata = await image.metadata();

    if (metadata.width > metadata.height) {
      await image.rotate(-90);
    }

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

    return newPath;
  },

  convertToPDF(images, userOptions = {}) {
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
          /Users/bruno/Desktop/temp.pdf`;

    const command2 = `img2pdf ${allPaths} --without-pdfrw -f shrink -S A4 -o /Users/bruno/Desktop/temp2.pdf`;

    execa.shellSync(command1);
    execa.shellSync(command2);

    console.log(fs.statSync('/Users/bruno/Desktop/temp.pdf').size * 0.001); // eslint-disable-line
    console.log(fs.statSync('/Users/bruno/Desktop/temp2.pdf').size * 0.001); // eslint-disable-line
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

    execa.shellSync(`java -jar ${pdfbox} PDFToImage -outputPrefix '${newPath}/${name}-' '${file.realPath}'`);

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
