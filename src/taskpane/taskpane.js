/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

import 'windi.css';
import '../fabric-icons/css/fabric-icons-inline.css';

import { createApp } from 'vue';
import { storage } from '../utilities/connector.js';

import {
  provideFluentDesignSystem,
  fluentCard,
  fluentButton,
  fluentTab,
  fluentTabPanel,
  fluentTabs,
  fluentProgressRing
} from '@fluentui/web-components';

import App from './App.vue';

provideFluentDesignSystem().register(
  fluentCard(),
  fluentButton(),
  fluentTab(),
  fluentTabPanel(),
  fluentTabs(),
  fluentProgressRing()
);

Office.onReady(async (info) => {
  if (info.host === Office.HostType.Outlook) {
    const settings = await storage.get('settings/general');
    if (!('automaticUpdates' in settings)) {
      storage.set('settings/general', { ...settings, automaticUpdates: true });
    }
    createApp(App).mount('#app');
  }
});
