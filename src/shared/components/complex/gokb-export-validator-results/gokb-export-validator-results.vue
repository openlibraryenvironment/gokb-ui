

<template>

  <gokb-button
    :color=color
    :disabled=disabled
    @click="exportResults"
  >
    Ergebnis exportieren
  </gokb-button>


</template>

<script>
  import exportServices from "@/shared/services/export-services";

  export default {
    name: 'GokbExportValidatorResults',
    //emits: ['update:model-value'],
    props: {
      loadedFile: {
        type: Object,
        required: true,
      },
      selectedFile: {
        type: File,
        required: false
      },
      label: {
        type: String,
        required: false,
        default: '',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      color: {
        type: String,
        required: false,
        default: 'green'
      }
    },
    data () {
      return {

      }
    },
    computed: {

    },
    methods: {
      exportResults () {
        let that = this
        let allResults = []
        let structureWarnings = []
        this.loadedFile.warnings.missingColumns.forEach(function(sw) {
          let mc = {}
          mc.column = sw
          mc.row = 'n.a.'
          mc.reason = that.$i18n.t('kbart.errors.missingCols')
          mc.type = that.$i18n.tc('kbart.processing.warning.structure', 1)
          structureWarnings.push(mc)
        })
        allResults.push(...structureWarnings)

        let structureErrors = []
        this.loadedFile.errors.missingColumns.forEach(function(se) {
          let mc = {}
          mc.column = se
          mc.row = 'n.a.'
          mc.reason = that.$i18n.t('kbart.errors.missingCols')
          mc.type = that.$i18n.tc('kbart.processing.error.structure', 1)
          structureErrors.push(mc)
        })
        allResults.push(...structureErrors)

        let warnings = this.loadedFile.warnings.single
        warnings.forEach(function(w) {
          w.type = that.$i18n.tc('kbart.processing.warning.label', 1)
        })
        allResults.push(...warnings)
        let errors = this.loadedFile.errors.single
        errors.forEach(function(e) {
          e.type = that.$i18n.tc('kbart.processing.error.label', 1)
        })
        allResults.push(...errors)

        // let errorsAndWarnings = structureErrors.concat(structureWarnings.concat(errors.concat(warnings)))

        let fileName = 'GOKB-Validation_'.concat(this.selectedFile.name.split('.')[0]).concat('.csv')

        exportServices.toTsv([{
            text: this.$i18n.tc('kbart.row.label', 1),
            value: 'row'
          },
            {
              text: this.$i18n.tc('kbart.column.label', 1),
              value: 'column'
            },
            {
              text: this.$i18n.tc('kbart.errors.reason.label', 1),
              value: 'reason'
            },
            {
              text: this.$i18n.t('kbart.processing.type.label'),
              value: 'type'
            }],
          allResults,
          {'filename' : fileName}
        )

      },
    }
  }

</script>

