  // Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fabric-assets-license

// tslint:disable:max-line-length

import {
  IIconOptions,
  IIconSubset,
  registerIcons
} from '@uifabric/styling';

export function initializeIcons(
  baseUrl: string = '',
  options?: IIconOptions
): void {
  const subset: IIconSubset = {
    style: {
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontStyle: 'normal',
      fontWeight: 'normal',
      speak: 'none'
    },
    fontFace: {
      fontFamily: `"FabricMDL2Icons"`,
      src: `url('${baseUrl}fabric-icons-b6242516.woff') format('woff')`
    },
    icons: {
      'Add': '\uE710',
      'Back': '\uE72B',
      'ChevronDown': '\uE70D',
      'ChevronDownMed': '\uE972',
      'ChevronDownSmall': '\uE96E',
      'ChromeClose': '\uE8BB',
      'Completed': '\uE930',
      'CompletedSolid': '\uEC61',
      'CriticalErrorSolid': '\uF5C9',
      'Error': '\uE783',
      'FavoriteStar': '\uE734',
      'FavoriteStarFill': '\uE735',
      'LightningBolt': '\uE945',
      'LightningBoltSolid': '\uE45F',
      'MoreVertical': '\uF2BC',
      'Settings': '\uE713',
      'Sync': '\uE895',
      'Unknown': '\uE9CE',
      'UnknownSolid': '\uF2E1'
    }
  };

  registerIcons(subset, options);
}
