<template>
  <gokb-dialog
    v-model="localValue"
    title="KBART Import"
    @submit="importKbart"
  >
    <gokb-section>
      <gokb-file-input-field
        v-model="options.selectedFile"
        :label="$t('kbart.file.label')"
        :disabled="importRunning"
      />
      <gokb-namespace-field
        v-model="options.selectedNamespace"
        :label="$t('kbart.propId.label')"
      />
      <gokb-checkbox-field
        v-model="options.addOnly"
        :label="$t('kbart.addOnly')"
      />
      <!-- <v-progress-linear
        height="25"
        :value="completion"
      >
        <template #default="{ value: v }">
          <strong>{{ v }}%</strong>
        </template>
      </v-progress-linear> -->
    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        default
        :disabled="!options.selectedFile || importRunning"
      >
        {{ $t('btn.confirm') }}
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
        useProprietaryNamespace: false,
        importRunning: undefined,
        selectedFile: undefined,
        completion: undefined,
        options: {
          selectedFile: undefined,
          selectedNamespace: undefined,
          addOnly: false
        }
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
        this.$emit('kbart', this.options)
        this.close()
      },
      doImport () {
        this.error = undefined
        this.importRunning = true
        this.completion = 0
        this.readerForImport = new FileReader()
        this.readerForImport.onload = this._importCompleted
        this.readerForImport.onprogress = this._importProgress
      },
      async _importCompleted () {
        const csvDataRows = this.readerForImport.result.split(/\r?\n/)
          .filter(row => row.trim())
        if (csvDataRows.length === 0) {
          return
        }
        console.log(csvDataRows.length, csvDataRows[0], csvDataRows[1])
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
