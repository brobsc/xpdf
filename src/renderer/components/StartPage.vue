<template lang='pug'>
  .x-container
    .display-panel
      h1.title sPDF
      p Files: {{ files.length }}
      a.button.is-small Add files
    .settings-panel
      settings-panel
    .preview-cards
      preview-cards
    .bundler-buttons
      bundler-buttons
</template>

<script>
  import BundlerButtons from './StartPage/BundlerButtons';
  import PreviewCards from './StartPage/PreviewCards';
  import SettingsPanel from './StartPage/SettingsPanel';

  export default {
    name: 'start-page',
    components: {
      BundlerButtons,
      PreviewCards,
      SettingsPanel,
    },

    computed: {
      files() {
        return this.$store.state.files;
      },
    },
  };
</script>

<style lang='scss' scoped>
  .x-container {
    display: grid;
    height: 100%;
    grid-template-columns: 1.5fr 4fr;
    grid-template-rows: 2fr 435px 1fr;
    grid-template-areas:
      'display-panel settings-panel'
      'preview-cards preview-cards'
      'bundler-buttons bundler-buttons';
    grid-gap: 12px;
  };

  .display-panel {
    grid-area: display-panel;
    display: grid;
    grid-gap: 4px;
  };

  .settings-panel {
    grid-area: settings-panel;
  };

  .preview-cards {
    grid-area: preview-cards;
  };

  .bundler-buttons {
    grid-area: bundler-buttons;
  };

  .title {
    padding: 0;
    margin: 0;
  }
</style>
