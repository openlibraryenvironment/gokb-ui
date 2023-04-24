<template>
  <a
    :href="$route"
    :style="{ textDecoration: 'none' }"
    target="_blank"
    @click.prevent=""
  >
    <gokb-button
      :color="color"
      :iconId="iconId"
      :to="to"
      :text="text"
      :disabled="disabled"
      :title="title"
      @click="$emit('export-search-results')"
    >
      {{ $i18n.t('btn.export') }}
    </gokb-button>
  </a>
</template>

<script>
  import exportServices from '@/shared/services/export-services'
  import GokbButton from '@/shared/components/base/gokb-button'
  export default {
    name: 'GokbExportButton',
    extends: GokbButton,
    props: {
      default: {
        type: Boolean,
        required: false,
        default: false,
      },
      color: {
        type: String,
        required: false,
        default: undefined,
      },
      iconId: {
        type: String,
        required: false,
        default: undefined,
      },
      to: {
        type: String,
        required: false,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      title: {
        type: String,
        required: false,
        default: undefined
      }
    }
  }
</script>
