<template>
  <div class="mt-4 space-y-8 mb-16">
    <div>
      <h2 class="text-lg text-sky-500 mb-3">
        <i class="ms-Icon ms-Icon--FavoriteStarFill mr-2 transform translate-y-0.5"></i>
        {{ getMessage('type_custom') }}
      </h2>
      <fluent-card class="py-3">
        <div
          v-for="(applies, domain) in custom"
          class="flex w-full hover:bg-gray-100 items-center px-4 py-2"
        >
          <div class="flex-auto">{{ domain }}</div>
          <div class="flex-none">
            <button
              @click="deleteDomain(domain)"
              class="flex items-center justify-center text-sm rounded-1/2 text-gray-600 w-30px h-30px hover:bg-black/10"
            >
              <i class="ms-Icon ms-Icon--ChromeClose" />
            </button>
          </div>
        </div>
      </fluent-card>
    </div>
  </div>
</template>

<script>
  import getMessage from '../utilities/i18n.js';
  import { storage } from '../utilities/connector.js';
  
  export default {
    data() {
      return {
        custom: {}
      }
    },
    async mounted() {
      this.custom = await storage.get('settings/custom');
      window.addEventListener('storage', async (event) => {
        if (event.key === 'settings/custom') {
          this.custom = await storage.get('settings/custom');
        }
      });
    },
    methods: {
      getMessage,
      deleteDomain(domain) {
        Office.context.ui.messageParent(JSON.stringify({
          event: 'mistrustDomain',
          domain
        }));
        delete this.custom[domain];
        storage.set('settings/custom', this.custom);
      }
    }
  }
</script>