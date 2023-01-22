<template>
  <fluent-card
    class="py-3"
    style="content-visibility: visible; contain: none;"
  >
    <div v-for="(lists, group) in categorized">
      <template v-if="lists.length > 0">
        <div class="px-4 py-1">
          {{ getMessage('group_' + group) }}
        </div>
        <label
          v-for="list in lists"
          class="flex group w-full items-center px-4 py-2 cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100"
        >
          <div class="flex-none mr-3">
            <input
              @change="(e) => $emit('toggle', { id: list.id, on: e.target.checked })"
              type="checkbox"
              :checked="!list.off"
            />
          </div>
          <div
            v-if="loadingLists.indexOf(list.id) > -1"
            class="mr-3"
          >
            <i class="ms-Icon ms-Icon--Sync text-gray-500 animate-spin"></i>
          </div>
          <div class="flex-auto min-w-0">
            <div class="truncate text-sm">
              {{ list.title || list.url }}
            </div>
            <div class="text-xs text-gray-500">
              {{ list.id }}
            </div>
          </div>
          <div class="hidden group-hover:block focus-within:block flex-none ml-3">
            <button class="dropdown-btn">
              <i class="ms-Icon ms-Icon--MoreVertical"></i>
              <div class="dropdown">
                <a @click="openUrl(list.url)">
                  {{ getMessage('inspect') }}
                </a>
                <a
                  v-if="list.web"
                  @click="openUrl(list.web)"
                >
                  {{ getMessage('website') }}
                </a>
                <a
                  v-if="!list.off"
                  @click="$emit('update', list.id)"
                  :class="loadingLists.indexOf(list.id) > -1 ? 'text-gray-200 pointer-events-none' : ''"
                >
                  {{ getMessage('update') }}
                </a>
                <a
                  v-if="group === 'custom'"
                  @click="$emit('remove', list.id)"
                >
                  {{ getMessage('remove') }}
                </a>
              </div>
            </button>
          </div>
        </label>
      </template>
    </div>
  </fluent-card>
</template>

<script>
  import getMessage from '../utilities/i18n.js';
  
  export default {
    props: ['categorized', 'loadingLists'],
    emits: ['toggle', 'update', 'remove'],
    methods: {
      getMessage,
      openUrl(url) {
        window.open(url, '_blank');
      }
    }
  }
</script>