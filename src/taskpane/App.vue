<template>
  <div class="pt-0 p-4">
    <button
      class="absolute top-0.5 right-5 text-xl"
      @click="showSettings()"
    >
      <i class="ms-Icon ms-Icon--Settings"></i>
    </button>
    <div
      v-if="loading"
      class="text-center py-8 space-y-2"
    >
      <fluent-progress-ring class="m-auto" />
      <div>{{ getMessage('analyze') }}</div>
    </div>
    <div v-else>
      <fluent-tabs v-if="processedUrls.length > 0">
        <TabItem
          @trust-unknown="trustUnknown"
          :data="[...suspiciousUrls, ...sortedUnknownUrls, ...trustedUrls]"
        >
          {{ getMessage('allTypes') }}
        </TabItem>
        <TabItem
          @trust-unknown="trustUnknown"
          type="suspicious"
          :data="suspiciousUrls"
        />
        <TabItem
          @trust-unknown="trustUnknown"
          type="unknown"
          :data="sortedUnknownUrls"
        />
        <TabItem
          @trust-unknown="trustUnknown"
          type="trusted"
          :data="trustedUrls"
        />
        <TabItem
          @trust-unknown="trustUnknown"
          type="redirect"
          :data="redirectUrls"
        />
      </fluent-tabs>
      <div
        v-else
        class="text-center py-10"
      >
        {{ getMessage('notFound') }}
      </div>
    </div>
  </div>
</template>

<script>
  import SafelinkCore from 'safelink-core';
  
  import TabItem from './TabItem.vue';
  
  import getMessage from '../utilities/i18n.js';
  import Connector from '../utilities/connector.js';
  
  export default {
    components: {
      TabItem
    },
    data() {
      return {
        safelinkCore: null,
        loading: true,
        urls: Office.context.mailbox.item.getEntities().urls,
        processedUrls: []
      }
    },
    async mounted() {
      this.safelinkCore = new SafelinkCore(Connector);
      await this.safelinkCore.create();
      
      Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
        this.loading = true;
        this.urls = Office.context.mailbox.item.getEntities().urls;
        this.processUrls();
      });
      
      this.processUrls();
    },
    computed: {
      suspiciousUrls() {
        return this.processedUrls.filter((x) => {
          return x.type === 'suspicious' || x.redirect?.type === 'suspicious'
        });
      },
      sortedUnknownUrls() {
        const similar = this.unknownUrls.filter((x) => {
          return x.similar?.rating > 0.7
        });
        return [...new Set([...similar, ...this.unknownUrls])];
      },
      unknownUrls() {
        return this.processedUrls.filter((x) => {
          return x.type === 'unknown' || x.redirect?.type === 'unknown'
        });
      },
      trustedUrls() {
        return this.processedUrls.filter((x) => {
          return x.type === 'trusted' ||
            x.type === 'custom' || 
            x.redirect?.type === 'trusted' ||
            x.redirect?.type === 'custom';
        })
      },
      redirectUrls() {
        return this.processedUrls.filter((x) => {
          return x.type === 'redirect';
        })
      }
    },
    methods: {
      getMessage,
      showSettings() {
        Office.context.ui.displayDialogAsync('https://localhost:3000/options.html', {
            height: 80,
            width: 50
          },
          (asyncResult) => {
            if (asyncResult.status == "failed") {
              return;
            }
            let madeChanges = false;
            const dialog = asyncResult.value;
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, () => {
              madeChanges = true;
            });
            dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
              if (madeChanges) {
                this.processedUrls = [];
                this.loading = true;
                this.processUrls();
              }
            });
          }
        );
      },
      async processUrls() {
        // remove duplicated urls
        this.urls = [...new Set(this.urls)];
        const promises = [];
        for (const url of this.urls) {
          promises.push((async () => {
            let info = await this.safelinkCore.findDomain(url);
            info.url = url;
            if (info.type === 'redirect') {
              if(info.dereferrerTarget) {
                info.redirect = await this.safelinkCore.findDomain(info.dereferrerTarget)
              }
              else {
                info.redirect = await this.safelinkCore.findRedirectDomain(info.url);
              }
            }
            return info;
          })());
        }
        const promiseResults = await Promise.allSettled(promises);
        
        const domains = {
          trusted: [],
          unknown: [],
          suspicious: []
        }; 
        for (const result of promiseResults) {
          if (result.status === 'fulfilled') {
            const domainInfo = result.value;
            const type = domainInfo.type === 'custom' ? 'trusted' : domainInfo.type;
            if (type === 'trusted' || type === 'unknown' || type === 'suspicious') {
              // prevent duplicated domains
              if (domains[type].length === 0 || domains[type].indexOf(domainInfo.domain) === -1) {
                domains[type].push(domainInfo.domain);
                this.processedUrls.push(domainInfo);
              }
            }
            else {
              this.processedUrls.push(domainInfo);
            }
          }
        }
        this.loading = false;
      },
      trustUnknown(domain) {
        this.safelinkCore.prefer.trustUnknown(domain);
        for (const item of this.processedUrls) {
          if (item.domain === domain) {
            item.type = 'custom';
          }
          else if (item.redirect?.domain === domain) {
            item.redirect.type = 'custom';
          }
        } 
      }
    }
  }
</script>