<template>
  <gokb-dialog
    v-model="localValue"
    title="KBART Import"
    @submit="importKbart"
  >
    <gokb-section sub-title="Optionen">
      <gokb-file-input-field label="Datei" />
      <gokb-select-field label="Titel-ID Namensraum" />
      <gokb-checkbox-field label="Weitere Identifier sind zu beachten" />
      <v-progress-linear :height="20">
        <template v-slot="{ value }">
          <strong>{{ value }}%</strong>
        </template>
      </v-progress-linear>
    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.native="close"
      >
        Abbrechen
      </gokb-button>
      <gokb-button default>
        Import
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/base-component'

  export default {
    name: 'GokbKbartImportPopup',
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
    },
    data () {
      return {
        error: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    },
    methods: {
      close () {
        this.localValue = false
      },
      importKbart () {
        console.log('do import')
        this.close()
      }
    }
  }
</script>
