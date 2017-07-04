<template lang='pug'>
  .ui.three.column.grid
    .column(v-for='file in files')
      .ui.fluid.card
        .image
          img(:src="'file:///' + file.path" height=210)
        .content
          .header
            | {{ file.name }}
          .meta
            a {{ file.type }}
            span.right.floated
              .meta {{ file.size | prettyBytes }}
</template>

<style>
.ui.grid {
  padding-top: 12px;
  padding-bottom: 12px;
};
</style>

<script>
  export default {
    name: 'preview-cards',

    computed: {
      files() {
        return this.$store.state.files;
      },
    },
  };
</script>
