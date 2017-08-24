<template lang='pug'>
  div
    div
      button.ui.primary.button(@click='generatePreview') Preview
      button.ui.button(@click='clearFiles') Clear
      button.ui.button(@click='bundle') Bundle
    canvas#pdfPreview
</template>

<script>
  import execa from 'execa';

  export default {
    name: 'bundler-buttons',

    methods: {
      showPDF: true,

      clearFiles() {
        this.$store.commit('clearFiles');
      },

      bundle() {
      },

      generatePreview() {
        const files = this.$store.state.files;
        const images = [];

        files.forEach(file => images.push(this.resizeImage(file)));

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
          -contrast -contrast\
          -compress JPEG\
          -quality 40\
          /Users/bruno/Desktop/man.pdf`;

        execa.shellSync(command);
      },
      /* eslint-enable */
    },

  };
</script>

<style lang='scss' scoped>
</style>
