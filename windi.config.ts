import { defineConfig } from 'windicss/helpers';


export default defineConfig({
  shortcuts: {
    'dropdown-btn': {
      '@apply': 'flex relative items-center justify-center text-sm rounded-1/2 text-gray-600 w-30px h-30px hover:bg-black/10 focus:bg-black/10',
      '.dropdown': {
        '@apply': 'absolute hidden top-34px right-0 bg-white shadow min-w-120px py-2 rounded z-1 text-left',
        'a': {
          '@apply': 'block px-4 py-1 hover:bg-$accent-fill-hover hover:text-white'
        }
      },
      '&:focus .dropdown': {
        '@apply': 'block'
      }
    }
  }
});