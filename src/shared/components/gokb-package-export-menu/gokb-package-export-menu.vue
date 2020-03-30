<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <gokb-button
        icon-id="import_export"
        :disabled="disabled"
        @click.native="on.click"
      >
        Export
      </gokb-button>
    </template>
    <v-list>
      <v-list-item
        v-for="(exportType, name) of exportVariants"
        :key="name"
      >
        <v-list-item-title>
          <a
            download
            :href="dataUrl"
            :type="type"
            @click="download(exportType)"
          >
            {{ name }}
          </a>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import selection from '@/shared/models/selection'
  import GokbButton from '@/shared/components/base/gokb-button'

  const EXPORT_VARIANTS = {
    KBART: { url: `${process.env.VUE_APP_API_BASE_URL}/packages/kbart/`, type: 'text/comma-separated-values' },
    GOKb: { url: `${process.env.VUE_APP_API_BASE_URL}/packageTSVExport/`, type: 'text/tab-separated-values' },
  }
  export default {
    name: 'GokbPackageExportMenu',
    components: { GokbButton },
    data () {
      return {
        exportVariants: EXPORT_VARIANTS,
        dataUrl: undefined,
        type: undefined,
      }
    },
    computed: {
      disabled () {
        return this.selectedItems?.length !== 1
      },
      selectedItems () {
        return selection.get()
      }
    },
    methods: {
      download (exportType) {
        const id = this.selectedItems[0].uuid
        this.type = exportType.type
        this.dataUrl = `${exportType.url}${id}`
      },
    }
  }
</script>

<style scoped>
  a:visited, a:link, a:active {
    text-decoration: none;
  }
</style>
