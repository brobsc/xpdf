import execa from 'execa';

export default {
  optimize(file, quality = 99) {
    // TODO: Make temp path
    const newPath = `/Users/bruno/Desktop/temps/${file.name}`;

    execa.shellSync(`gm convert -size 595x842 '${file.path}'\
          -background white\
          -compress JPEG\
          -gravity center\
          -rotate '90>'\
          -geometry '595x842>'\
          -extent 595x842\
          -density 72x72\
          -resample 72x72\
          -quality ${quality}\
          '${newPath}'`);

    return newPath;
  },

  convert(images, quality = 40, contrast = 1) {
    // Contrast = 0 --
    // Contrast = 1 NONE
    // Contrast = 2 ++
    // TODO: Use temp path
    // Converts a /path/to/image to "'/path/to/image' "
    // and joins them to get rid of ',' imposed by JS arrays
    let contrastString = '';
    const allPaths = images.map(image => `'${image}' `).join('');

    if (contrast <= 0) contrastString = '-contrast -contrast';
    else if (contrast === '1') contrastString = '';
    else contrastString = '+contrast +contrast';

    console.log('Current contrast = ' + contrast); // eslint-disable-line
    console.log('Current quality = ' + quality); // eslint-disable-line

    const command = `gm convert\
          ${allPaths}\
          ${contrastString}\
          -compress JPEG\
          -quality ${quality}\
          /Users/bruno/Desktop/temp.pdf`;

    execa.shellSync(command);
  },

  getSize(file) {
    const command = execa.shellSync(`gm identify -format "%w %h" '${file}'`);
    const result = command.stdout.split(' ');

    return result;
  },
};
