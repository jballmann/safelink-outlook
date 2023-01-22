<template>
  <form class="mt-4 text-sm">
    <div class="py-1 px-4">
      <fluent-checkbox
        value="automaticUpdates"
        class="mr-1"
        @change="handleChange"
        :checked="settings.automaticUpdates"
      >
        {{ getMessage('option_automaticUpdates') }}
      </fluent-checkbox>
    </div>
  </form>
</template>

<script>
  import getMessage from '../utilities/i18n.js';
  import { storage } from '../utilities/connector.js';
  
  export default {
    data() {
      return {
        settings: {}
      }
    },
    async mounted() {
      this.settings = await storage.get('settings/general');
    },
    methods: {
      getMessage,
      handleChange(event) {
        const target = event.target;
        this.settings[target.value] = target.checked;
        storage.set('settings/general', this.settings);
      }
    }
  }
</script>