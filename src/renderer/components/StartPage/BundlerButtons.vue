<template lang='pug'>
  div
    div
      button.ui.primary.button(@click='generatePreview') Preview
      button.ui.button(@click='clearFiles') Clear
      button.ui.button(@click='bundle') Bundle
    canvas#pdfPreview
</template>

<script>
  import JsPDF from 'jspdf';
  import execa from 'execa';

  export default {
    name: 'bundler-buttons',

    methods: {
      showPDF: true,

      clearFiles() {
        this.$store.commit('clearFiles');
      },

      bundle() {
        const doc = new JsPDF({ unit: 'px' });
        const file = this.$store.state.files[0];
        const chunk = this.$readChunk.sync(file.path, 0, 4100);
        const ext = this.$fileType(chunk).ext;
        let img = this.$electron.nativeImage.createFromPath(file.path);
        img = img.resize({ width: 595, quality: 'best' });
        const url = img.toDataURL();
        const posX = (595 - img.getSize().width) / 2;
        const posY = (842 - img.getSize().height) / 2;
        console.log(posX); // eslint-disable-line
        console.log(posY); // eslint-disable-line

        doc.addImage(url, ext, 0, 0, 400, 400);
        doc.save('teste2.pdf');
      },

      generatePreview() {
        // const pdf = new JsPDF({ unit: 'px' });
        const files = this.$store.state.files;
        const images = [];

        files.every((file) => {
          // const chunk = this.$readChunk.sync(file.path, 0, 4100);
          // const ext = this.$fileType(chunk).ext;
          const img = this.resizeImage(file);
          // const posX = (595 - this.getImageSize(img)[0]) / 2;
          // const posY = (595 - this.getImageSize(img)[1]) / 2;
          // console.log(posX); // eslint-disable-line
          // console.log(posY); // eslint-disable-line

          // pdf.addImage(`file:///${img}`, ext, posX, posY);
          images.push(img);

          return true;
        });

        // pdf.save('ops.pdf');
        this.convertToPDF(images);
      },

      resizeImage(file) {
        const newPath = `/Users/bruno/Desktop/${file.name}`;

        execa.shellSync(`gm convert -size 595x842 '${file.path}'\
          -background white\
          -gravity center\
          -rotate '90>'\
          -geometry '595x842>'\
          -extent 595x842\
          -quality 90\
          '${newPath}'`);

        return newPath;
      },

      getImageSize(file) {
        const command = execa.shellSync(`gm identify -format "%w %h" '${file}'`);
        const result = command.stdout.split(' ');

        return result;
      },

      /* eslint-disable */
      convertToPDF(images) {
        // Converts a /path/to/image to "'/path/to/image' "
        // and joins them to get rid of ',' imposed by JS arrays
        const allPaths = images.map(image => `'${image}' ` ).join("");
        const command = `gm convert\
          ${allPaths}\
          -quality 90\
          /Users/bruno/Desktop/man.pdf`;

        execa.shellSync(command);
      },
      /* eslint-enable */
    },

  };
</script>

<style></style>
