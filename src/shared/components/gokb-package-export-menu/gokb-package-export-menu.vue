<template>
  <v-menu id="export-menu" offset-y>
    <template v-slot:activator="{ on }">
      <gokb-button
        icon-id="mdi-swap-vertical"
        color="primary"
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
            :href="exportType.url"
            :type="type"
          >
            {{ exportType.label }}
          </a>
          <gokb-tooltip
            :code="exportType.description"
          />
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
    props: {
      pkgId: {
        type: [Number, String],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        dataUrl: undefined,
        type: undefined,
      }
    },
    computed: {
      disabled () {
        return !this.pkgId && (!this.selectedItems || this.selectedItems?.length < 1)
      },
      selectedItems () {
        return selection.get()
      },
      exportVariants () {
        return {
          KBART: {
            url: this.currentTippUrl,
            flavour: 'tipp',
            label: this.$i18n.t('kbart.export.type.tipp.label'),
            description: 'kbart.export.type.tipp.description',
            type: 'text/tab-separated-values'
          },
          KBART_TITLE: {
            url: this.currentTitleUrl,
            flavour: 'title',
            label: this.$i18n.t('kbart.export.type.title.label'),
            description: 'kbart.export.type.title.description',
            type: 'text/tab-separated-values'
          }
        }
      },
      currentTippUrl () {
        var fullUrl = `${process.env.VUE_APP_API_BASE_URL}/packages/kbart`

        if (this.pkgId) {
          fullUrl = fullUrl + `/${this.pkgId}` + `?exportType=tipp`
        } else if (this.selectedItems?.length === 1) {
          fullUrl = fullUrl + `/${this.selectedItems[0].uuid}` + `?exportType=tipp`
        } else if (this.selectedItems) {
          fullUrl = fullUrl + `?exportType=tipp`

          this.selectedItems.forEach(pkg => {
            fullUrl = fullUrl + `&pkg=${pkg.uuid}`
          })
        }

        return fullUrl
      },
      currentTitleUrl () {
        var fullUrl = `${process.env.VUE_APP_API_BASE_URL}/packages/kbart`

        if (this.pkgId) {
          fullUrl = fullUrl + `/${this.pkgId}` + `?exportType=title`
        } else if (this.selectedItems?.length === 1) {
          fullUrl = fullUrl + `/${this.selectedItems[0].uuid}` + `?exportType=title`
        } else if (this.selectedItems) {
          fullUrl = fullUrl + `?exportType=title`

          this.selectedItems.forEach(pkg => {
            fullUrl = fullUrl + `&pkg=${pkg.uuid}`
          })
        }

        return fullUrl
      }
    }
  }
</script>

<style scoped>
  a:visited, a:link, a:active {
    text-decoration: none;
  }
</style>
