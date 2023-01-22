<template>
  <div class="p-4">
    <div class="flex w-full items-center justify-center p-4 pointer-events-none">
      <div class="flex-none mr-2">
        <img src="assets/logo_32x32.png" />
      </div>
      <div class="flex-auto text-gray-500">
        Safelink extension
      </div>
    </div>
    <fluent-tabs>
      <fluent-tab>
        {{ getMessage('general') }}
      </fluent-tab>
      <fluent-tab-panel>
        <SettingsGeneral />
      </fluent-tab-panel>
      <fluent-tab>
        {{ getMessage('lists') }}
      </fluent-tab>
      <fluent-tab-panel>
        <SettingsLists />
      </fluent-tab-panel>
      <fluent-tab>
        {{ getMessage('custom') }}
      </fluent-tab>
      <fluent-tab-panel>
        <SettingsCustom />
      </fluent-tab-panel>
      <fluent-tab>
        {{ getMessage('about') }}
      </fluent-tab>
      <fluent-tab-panel>
        <SettingsAbout />
      </fluent-tab-panel>
    </fluent-tabs>
  </div>
</template>

<script>
  import getMessage from '../utilities/i18n.js';
  
  import SettingsGeneral from './SettingsGeneral.vue';
  import SettingsLists from './SettingsLists.vue';
  import SettingsCustom from './SettingsCustom.vue';
  import SettingsAbout from './SettingsAbout.vue';
  
  export default {
    components: {
      SettingsGeneral,
      SettingsLists,
      SettingsCustom,
      SettingsAbout
    },
    methods: {
      getMessage
    }
  }
</script>