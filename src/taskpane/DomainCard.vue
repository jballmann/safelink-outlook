<template>
  <fluent-card
    class="relative"
    :class="data.type === 'redirect' ? '' : 'px-5 pb-8 pt-4 ' + cardClasses"
    style="content-visibility: visible; contain: none;"
  >
    <div
      v-if="data.type === 'redirect'"
      class="flex items-center text-orange-500 py-2 px-4"
    >
      <div>
        <i class="mr-2 ms-Icon ms-Icon--LightningBolt transform translate-y-0.5"></i>
      </div>
      <div
        class="w-full truncate"
        :title="data.url"
      >
        {{ data.url }}
      </div>
    </div>
    <div :class="data.type === 'redirect' ? 'p-5 pt-2 rounded-b-[8px] ' + cardClasses : ''">
      <div class="flex items-center">
        <h2
          class="flex-auto text-lg mb-1"
          :class="isSimilar ? 'underline decoration-red-500 decoration-wavy' : ''"
        >
          <strong>{{ domain.secondLevelDomain }}</strong>.{{ domain.topLevelDomain }}
        </h2>
        <div class="flex-none">
          <i
            class="text-3xl ms-Icon"
            :class="iconClass"
          ></i>
        </div>
      </div>
      <div
        v-if="domain.type === 'trusted'"
        class="text-sm leading-tight"
      >
        <p class="font-semibold">{{ domain.nm }}</p>
        <p>{{ getMessage('sector_' + domain.se) }}, {{ domain.co }}</p>
      </div>
      <div v-if="domain.type === 'suspicious'">
        {{ getMessage('type_suspicious') }}
      </div>
      <template v-if="domain.type === 'unknown'">
        <div
          v-if="isSimilar"
          class="text-red-500 mb-2"
        >
          {{ log(getMessage('similarDomain')).replace('$text', domain.similar.target) }}
        </div>
        <div>
          {{ getMessage('type_unknown') }}
        </div>
      </template>
      <div v-if="domain.type === 'custom'">
        {{ getMessage('type_custom') }}
      </div>
    </div>
    <div
      v-if="domain.type === 'unknown'"
      class="absolute bottom-2 right-2"
    >
      <button class="dropdown-btn">
        <i class="ms-Icon ms-Icon--ChevronDownMed"></i>
        <div class="dropdown">
          <a
            class="whitespace-nowrap"
            @click="trustUnknown()"
          >
            {{ getMessage('trustDomain') }}
          </a>
          <a
            class="whitespace-nowrap"
            @click="openURL('https://duckduckgo.com?q=' + domain.domain)"
          >
            {{ getMessage('checkDomain') }}
          </a>
        </div>
      </button>
    </div>
  </fluent-card>
</template>

<script>
  import getMessage from '../utilities/i18n.js';
  
  export default {
    props: ['data'],
    emits: ['trustUnknown'],
    computed: {
      cardClasses() {
        switch(this.domain.type) {
          case 'trusted': return 'bg-green-500 text-white';
          case 'suspicious': return 'bg-red-500 text-white';
          case 'custom': return 'bg-sky-500 text-white';
        }
        return '';
      },
      iconClass() {
        switch(this.domain.type) {
          case 'trusted': return 'ms-Icon--Completed';
          case 'suspicious': return 'ms-Icon--Error';
          case 'unknown': return 'ms-Icon--Unknown';
          case 'custom': return 'ms-Icon--FavoriteStarFill';
        }
      },
      domain() {
        console.log('data', this.data)
        if (this.data.redirect) {
          return this.data.redirect;
        }
        return this.data;
      },
      isSimilar() {
        return this.domain.similar?.rating >= 0.7;
      }
    },
    methods: {
      getMessage,
      trustUnknown() {
        this.$emit('trustUnknown', this.domain.domain);
        document.activeElement.blur();
      },
      openURL(url) {
        window.open(url, '_blank');
        document.activeElement.blur();
      },
      log(ct) {
        console.log(ct);
        return ct;
      }
    }
  }
</script>