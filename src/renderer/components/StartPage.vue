<template lang='pug'>
  div
    h1 sPDF
    p Number of files: {{ files.length }}
    preview-cards
    bundler-buttons
</template>

<script>
  import BundlerButtons from './StartPage/BundlerButtons';
  import PreviewCards from './StartPage/PreviewCards';

  export default {
    name: 'start-page',
    components: {
      BundlerButtons,
      PreviewCards,
    },

    computed: {
      files() {
        return this.$store.state.files;
      },
    },
  };
</script>

<style>
</style>
