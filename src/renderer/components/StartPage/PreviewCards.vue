<template lang='pug'>
  .columns.is-multiline.is-mobile
    .column.is-one-quarter(v-for='file in files')
      .card
        .card-image
          img(:src="'file:///' + file.path")
        .card-content
          .title.is-4.is-spaced.is-marginless
            | {{ file.name }}
          .subtitle.is-6.is-pulled-right {{ file.size | prettyBytes }}
          .subtitle.is-6 {{ file.type }}
          .card-footer
            a.card-footer-item.is-paddingless(@click='removeFile(file)') Remove
</template>

<script>
  export default {
    name: 'preview-cards',

    computed: {
      files() {
        return this.$store.state.files;
      },
    },

    methods: {
      removeFile(file) {
        this.$store.commit('removeFile', file);
      },
    },
  };
</script>

<style lang='scss' scoped>
.card-footer-item {
  color: red;
  font-size: 8px;
};
.card-content {
  padding: 4px;
};
.is-4 {
  font-size: 12px;
};
.is-6 {
  font-size: 8px;
  margin-bottom: 4px;
};
.column {
  padding: 5px;
};
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
};
</style>
