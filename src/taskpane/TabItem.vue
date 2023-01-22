<template>
  <fluent-tab
    v-if="data.length > 0"
    class="flex items-center pb-2"
  >
    <span
      v-if="$slots.default"
      class="text-lg"
    >
      <slot />
    </span>
    <template v-else>
      <i
        :class="iconClasses"
        class="text-xl mr-1 ms-Icon"
      ></i>
      <span class="text-lg">
        {{ data.length }}
      </span>
    </template>
  </fluent-tab>
  <fluent-tab-panel v-if="data.length > 0">
    <div class="space-y-2 pt-2">
      <DomainCard
        v-for="item in data"
        :data="item"
        :key="item"
        @trust-unknown="(e) => $emit('trustUnknown', e)"
      />
    </div>
  </fluent-tab-panel>
</template>

<script>
  import DomainCard from './DomainCard.vue';
  
  export default {
    components: {
      DomainCard
    },
    props: ['type', 'data'],
    emits: ['trustUnknown'],
    computed: {
      iconClasses() {
        switch(this.type) {
          case 'suspicious': return 'text-red-500 ms-Icon--Error';
          case 'unknown': return 'text-grey-500 ms-Icon--Unknown';
          case 'trusted': return 'text-green-500 ms-Icon--Completed';
          case 'redirect': return 'text-orange-500 ms-Icon--LightningBolt';
        }
      }
    }
  }
</script>