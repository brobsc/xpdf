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
          this.$store.commit('addFile', f);
        }
      }
    },

    isAcceptable(file) {
      const chunk = this.$readChunk.sync(file.path, 0, 4100);
      const acceptable = this.$store.state.acceptableExts;

      let result;

      try {
        const ext = this.$fileType(chunk).ext;
        result = acceptable.includes(ext);
      } catch (e) {
        if (e.name === 'TypeError') {
          // this.$toast.open({
          //   duration: 3000,
          //   type: 'is-danger',
          //   message: `Unnaceptable extension on file '${file.name}'`,
          //   position: 'is-bottom',
          // });
          return false;
        }
      }

      return result;
    },

    isMissing(file) {
      const files = this.$store.state.files;

      // Returns on the first that finds the condition true
      return !files.some(stored => file.path === stored.realPath);
    },
  },

  async created() {
    try {
      await FolderTools.initializeMasterFolder();
    } catch (e) {
      this.$toast.open({
        duration: 5000,
        message: e.code,
        position: 'is-bottom',
        type: 'is-danger',
      });
    }
  },
};
