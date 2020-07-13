<template>
  <gokb-dialog
    v-model="localValue"
    title="KBART Import"
    @submit="importKbart"
  >
    <gokb-section sub-title="Optionen">
      <gokb-file-input-field
        v-model="selectedFile"
        :disabled="importRunning"
      />
      <gokb-namespace-field
        v-model="selectedNamespace"
        label="Titel-ID Namensraum"
      />
      <gokb-checkbox-field
        v-model="considerAdditionalIdentifier"
        label="Weitere Identifier sind zu beachten"
      />
      <v-progress-linear
        height="25"
        :value="completion"
      >
        <template #default="{ value: v }">
          <strong>{{ v }}%</strong>
        </template>
      </v-progress-linear>
    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        default
        :disabled="!selectedFile || importRunning"
        @click="doImport"
      >
        Import
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import math from '@/shared/utils/math'
  import GokbNamespaceField from '@/shared/components/simple/gokb-namespace-field'

  export default {
    name: 'GokbKbartImportPopup',
    components: { GokbNamespaceField },
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: true
      },
    },
    data () {
      return {
        error: undefined,
        selectedNamespace: undefined,
        considerAdditionalIdentifier: undefined,
        importRunning: undefined,
        selectedFile: undefined,
        completion: undefined,
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
      },
      doImport () {
        this.error = undefined
        this.importRunning = true
        this.completion = 0
        this.readerForImport = new FileReader()
        this.readerForImport.onload = this._importCompleted
        this.readerForImport.onprogress = this._importProgress
        this.readerForImport.readAsText(this.selectedFile)
      },
      async _importCompleted () {
        const csvDataRows = this.readerForImport.result.split(/\r?\n/)
          .filter(row => row.trim())
        if (csvDataRows.length === 0) {
          return
        }
        try {
          // await baseServices.pubchargedb({
          //   initiator: this._importCompleted.name,
          //   data: rowsAsJson
          // })
        } catch (exception) {
          this.error = exception
        } finally {
          this.completion = 100
          this.importRunning = false
        }
      },
      _importProgress ({ loaded, total }) {
        this.completion = math.asPercent(loaded / total)
      },
    }
  }
</script>
