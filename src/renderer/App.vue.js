import fileType from 'file-type';
import readChunk from 'read-chunk';

export default {
  name: 'xpdf',
  methods: {
    addFiles(e) {
      const filesToAdd = e.dataTransfer.files;
      for (let i = 0; i < filesToAdd.length; i += 1) {
        const f = filesToAdd.item(i);
        if (this.isMissing(f) && this.isAcceptable(f)) {
          this.$store.commit('addFile', f);
        }
      }
    },

    isAcceptable(file) {
      const chunk = readChunk.sync(file.path, 0, 4100);
      const acceptable = this.$store.state.acceptableExts;
      const ext = fileType(chunk).ext;

      return acceptable.includes(ext);
    },

    isMissing(file) {
      const files = this.$store.state.files;

      // Returns on the first that finds the condition true
      return !files.some(stored => file.path === stored.path);
    },
  },
};
