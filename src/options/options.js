/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

import 'windi.css';
import '../fabric-icons/css/fabric-icons-inline.css';

import { createApp } from 'vue';

import {
  provideFluentDesignSystem,
  fluentCard,
  fluentButton,
  fluentTab,
  fluentTabPanel,
  fluentTabs,
  fluentCheckbox,
  fluentTextField
} from '@fluentui/web-components';

import App from './App.vue';

provideFluentDesignSystem().register(
  fluentCard(),
  fluentButton(),
  fluentTab(),
  fluentTabPanel(),
  fluentTabs(),
  fluentCheckbox(),
  fluentTextField()
);

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    createApp(App).mount('#app');
  }
});
