const connector = {
  storage: {
    async get(key) {
      const cache = window.localStorage.getItem(key);
      return cache ? JSON.parse(cache) : {};
    },
    async set(key, value) {
      return window.localStorage.setItem(key, JSON.stringify(value));
    },
    async remove(key) {
      return window.localStorage.removeItem(key);
    }
  },
  async fetch(url, type = 'get') {
    if (type === 'follow') {
      console.log('follow me...');
      const response = await window.fetch('https://safelink-proxy.vercel.app/follow/' + encodeURIComponent(url));
      const body = await response.text();
      const res = {
        url: body,
        status: response.status,
        redirected: true
      }
      console.log(res);
      return res;
    }
    else {
      return await window.fetch(url);
    }
  }
};

const { storage, fetch } = connector;

export {
  connector as default,
  storage,
  fetch
}

