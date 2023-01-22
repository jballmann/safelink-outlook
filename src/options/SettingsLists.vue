<template>
  <div
    v-if="loading"
    class="mt-4"
  >
    {{ getMessage('loading') }}
  </div>
  <div
    v-else
    class="mt-4 space-y-8 mb-16"
  >
    <div class="space-x-2">
      <fluent-button
        appearance="accent"
        :disabled="loadingLists.length > 0"
        @click="updateAll()"
      >
        <i class="ms-Icon ms-Icon--Sync mr-1 transform translate-y-px"></i>
        {{ getMessage('update') }}
      </fluent-button>
      <fluent-button
        appearance="accent"
        @click="openAddList()"
        :disabled="showAddList"
      >
        <i class="ms-Icon ms-Icon--Add mr-1 transform translate-y-px"></i>
        {{ getMessage('addList') }}
      </fluent-button>
    </div>
    <form
      @submit.prevent="addList()"
      v-if="showAddList"
      class="shadow rounded p-4 space-y-2"
    >
      <div>
        <fluent-text-field
          ref="urlInput"
          class="w-full"
          :placeholder="getMessage('insertListUrl')"
          v-model="listUrl"
        />
      </div>
      <div class="text-right space-x-2">
        <fluent-button
          appearance="lightweight"
          @click="showAddList = false"
        >
          {{ getMessage('hide') }}
        </fluent-button>
        <fluent-button
          type="submit"
        >
          {{ getMessage('addList') }}
        </fluent-button>
      </div>
    </form>
    <div>
      <h2 class="text-lg text-green-500 mb-3">
        <i class="ms-Icon ms-Icon--CompletedSolid mr-2 transform translate-y-0.5"></i>
        {{ getMessage('type_trusted') }}
      </h2>
      <SettingsListsCard
        @toggle="toggleList"
        @update="updateList"
        @remove="removeList"
        :categorized="categorizedLists.trusted"
        :loadingLists="loadingLists"
      />
    </div>
    <div>
      <h2 class="text-lg text-orange-500 mb-3">
        <i class="ms-Icon ms-Icon--LightningBoltSolid mr-2 transform translate-y-0.5"></i>
        {{ getMessage('type_redirect') }}
      </h2>
      <SettingsListsCard
        @toggle="toggleList"
        @update="updateList"
        @remove="removeList"
        :categorized="categorizedLists.redirect"
        :loadingLists="loadingLists"
      />
    </div> 
    <div>
      <h2 class="text-lg text-red-500 mb-3">
        <i class="ms-Icon ms-Icon--CriticalErrorSolid mr-2 transform translate-y-0.5"></i>
        {{ getMessage('type_suspicious') }}
      </h2>
      <SettingsListsCard
        @toggle="toggleList"
        @update="updateList"
        @remove="removeList"
        :categorized="categorizedLists.suspicious"
        :loadingLists="loadingLists"
      />
    </div>
  </div>
</template>

<script>
  import SafelinkCore from 'safelink-core';
  
  import getMessage from '../utilities/i18n.js';
  import Connector, { storage } from '../utilities/connector.js';
  
  import SettingsListsCard from './SettingsListsCard.vue';
  
  const updater = (new SafelinkCore(Connector)).updater;
  
  export default {
    components: {
      SettingsListsCard
    },
    data() {
      return {
        myLists: {},
        loadingLists: [],
        showAddList: false,
        loading: true,
        changeMade: false,
        listUrl: null
      }
    },
    async mounted() {
      this.myLists = await storage.get('settings/lists');
      this.loading = false;
      window.addEventListener('storage', async (event) => {
        if (event.key === 'settings/list') {
          this.myLists = await storage.get('settings/lists');
          this.applyChanges();
        }
      });
    },
    computed: {
      categorizedLists() {
        const groups = {
          default: [],
          regions: [],
          custom: []
        };
        const categorized = {
          trusted: JSON.parse(JSON.stringify(groups)),
          redirect: JSON.parse(JSON.stringify(groups)),
          suspicious: JSON.parse(JSON.stringify(groups))
        };
        for (const listId in this.myLists) {
          const list = this.myLists[listId];
          categorized[list.type][list.group].push({
            ...list,
            id: listId
          });
        }
        return categorized;
      }
    },
    methods: {
      getMessage,
      openAddList() {
        this.showAddList = true;
        this.$nextTick(() => {
          this.$refs.urlInput.focus();
        });
      },
      toggleList({ id, on }) {
        this.myLists[id].off = !on;
        storage.set('settings/lists', this.myLists);
        this.applyChanges();
      },
      removeList(id) {
        delete this.myLists[id];
        storage.set('settings/lists', this.myLists);
        this.applyChanges();
      },
      async updateList(id) {
        this.loadingLists.push(id);
        await updater.updateLists(id);
        this.loadingLists.splice(this.loadingLists.indexOf(id), 1);
        this.applyChanges();
      },
      updateAll() {
        this.loadingLists = [];
        for (const listId in this.myLists) {
          if (!this.myLists[listId].off) { 
            this.loadingLists.push(listId);
            (async () => {
              await updater.updateLists(listId);
              this.loadingLists.splice(this.loadingLists.indexOf(listId), 1);
            })();
          }
        }
        this.applyChanges();
      },
      async addList() {
        await updater.addList(this.listUrl);
        this.showAddList = false;
        this.listUrl = null;
        this.applyChanges();
      },
      applyChanges() {
        Office.context.ui.messageParent(JSON.stringify({
          event: 'listChange'
        }));
      }
    }
  }
</script>