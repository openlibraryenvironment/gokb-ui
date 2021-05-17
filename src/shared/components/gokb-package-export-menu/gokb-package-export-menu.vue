<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <gokb-button
        icon-id="import_export"
        :disabled="disabled"
        @click="on.click"
      >
        KBART Download
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
            :title="exportType.description"
            :type="type"
            @click="download(exportType)"
          >
            {{ exportType.label }}
          </a>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import selection from '@/shared/models/selection'
  import GokbButton from '@/shared/components/base/gokb-button'

  export default {
    name: 'GokbPackageExportMenu',
    components: { GokbButton },
    data () {
      return {
        dataUrl: undefined,
        type: undefined,
      }
    },
    computed: {
      disabled () {
        return !this.selectedItems || this.selectedItems?.length < 1
      },
      selectedItems () {
        return selection.get()
      },
      exportVariants () {
        return {
          KBART: {
            url: `${process.env.VUE_APP_API_BASE_URL}/packages/kbart`,
            flavour: 'tipp',
            label: this.$i18n.t('kbart.export.type.tipp.label'),
            description: this.$i18n.t('kbart.export.type.tipp.description'),
            type: 'text/tab-separated-values'
          },
          KBART_TITLE: {
            url: `${process.env.VUE_APP_API_BASE_URL}/packages/kbart`,
            flavour: 'title',
            label: this.$i18n.t('kbart.export.type.title.label'),
            description: this.$i18n.t('kbart.export.type.title.description'),
            type: 'text/tab-separated-values'
          }
        }
      }
    },
    methods: {
      download (exportType) {
        this.type = exportType.type

        if (this.selectedItems?.length === 1) {
          this.dataUrl = `${exportType.url}/${this.selectedItems[0].uuid}?exportType=${exportType.flavour}`
        } else if (this.selectedItems?.length > 1) {
          this.dataUrl = `${exportType.url}?exportType=${exportType.flavour}`
          this.selectedItems.forEach(pkg => {
            this.dataUrl = this.dataUrl + `&pkg=${pkg.uuid}`
          })
        }
      },
    }
  }
</script>

<style scoped>
  a:visited, a:link, a:active {
    text-decoration: none;
  }
</style>
