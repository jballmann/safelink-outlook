<template>
  <div class="mt-4 space-y-3">
    <div>Version: 0.0.1 (beta)</div>
    <div>
      <a
        class="text-blue-600 hover:underline"
        :href="repoUrl"
        target="_blank"
      >
        {{ repoUrl }}
      </a>
    </div>
    <div>
      &copy; jballmann, 2022
    </div>
    <div>
      Licence: GPLv3
    </div>
    <div>
      External dependencies:
      <ul class="pl-1 text-sm">
        <li v-for="([name, by], url) in dependencies">
          <a
            class="text-blue-600 hover:underline"
            :href="url"
            target="_blank"
          >
            {{ name }} by {{ by }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        repoUrl: 'http://www.github.com/jballmann/safelink-extension',
        dependencies: {
          'https://github.com/ghostery/adblocker': ['Adblocker', 'Ghostery'],
          'https://vuejs.org': ['Vue.js', 'Yuxi (Evan) You'],
          'https://windicss.org': ['Windi CSS', 'Veritas Raven'],
          'https://github.com/aceakash/string-similarity': ['string-similarity', 'Akash Kurdekar'],
          'https://developer.microsoft.com/en-us/fluentui': ['Fluent UI', 'Microsoft']
        }
      }
    }
  }
</script>