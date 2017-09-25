import FolderTools from './lib/FolderTools.js';

export default {
  name: 'xpdf',
  methods: {
    addFiles(e) {
      const filesToAdd = e.dataTransfer.files;

      for (let i = 0; i < filesToAdd.length; i += 1) {
        const f = filesToAdd.item(i);
        if (this.isMissing(f) && this.isAcceptable(f)) {
          f.realPath = f.path; // Add realPath property for easy mutation later
          console.log(f); // eslint-disable-line
          console.log(typeof(f.path)); // eslint-disable-line
          console.log(typeof(f.realPath)); // eslint-disable-line
          this.$store.commit('addFile', f);
        }
      }
    },

    isAcceptable(file) {
      const chunk = this.$readChunk.sync(file.path, 0, 4100);
      const ext = this.$fileType(chunk).ext;
      const acceptable = this.$store.state.acceptableExts;

      return acceptable.includes(ext);
    },

    isMissing(file) {
      const files = this.$store.state.files;

      // Returns on the first that finds the condition true
      return !files.some(stored => file.realPath === stored.realPath);
    },
  },

  created() {
    FolderTools.initializeMasterFolder();
    console.log('created'); // eslint-disable-line
  },
};
