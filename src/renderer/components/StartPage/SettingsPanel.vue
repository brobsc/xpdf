<template lang='pug'>
  .x-settings-container
    .x-title
      h1.title Settings
    .x-quality
      label Quality
      b-input(size='is-small' icon='level-up' v-model='quality' type='number' max='100' min='1')
    .x-contrast
      label Contrast
      b-select(size='is-small' icon='adjust' v-model='contrast')
        option(v-for='option of contrastOptions'
               :value='option' :key='option')
          | {{option}}
</template>

<script>
  export default {
    data() {
      return {
        name: 'settings-panel',
        contrastOptions: [
          'decrease',
          'none',
          'increase',
        ],
      };
    },

    methods: {
    },

    computed: {
      quality: {
        get() {
          return this.$store.state.quality;
        },
        set(val) {
          this.$store.commit('changeQuality', val);
        },
      },
      contrast: {
        get() {
          return this.$store.state.applyContrast;
        },
        set(val) {
          this.$store.commit('changeContrast', val);
        },
      },
    },
  };
</script>

<style lang='scss' scoped>
  .x-settings-container {
    display: grid;
    grid-template-areas:
    'title'
    'quality'
    'contrast';
    grid-gap: 16px;
  }

  .x-title {
    grid-area: title;
  }

  label {
    font-weight: 600;
  }

  .x-quality {
    grid-area: quality;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-gap: 4px;
  }
  .x-contrast {
    grid-area: contrast;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-gap: 4px;
  }
</style>

