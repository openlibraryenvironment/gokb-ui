

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
        console.log("aaaaaaaaaa")

        let structureWarnings = []
        this.loadedFile.warnings.missingColumns.forEach(function(sw) {
          let mc = {}
          mc.column = sw
          mc.row = 'n.a.'
          mc.reason = 'Fehlende Spalte'
          mc.type = 'Dateistruktur-Warnung'
          structureWarnings.push(mc)
        })

        let structureErrors = []
        this.loadedFile.errors.missingColumns.forEach(function(se) {
          let mc = {}
          mc.column = se
          mc.row = 'n.a.'
          mc.reason = 'Fehlende Spalte'
          mc.type = 'Dateistruktur-Fehler'
          structureErrors.push(mc)
        })

        let warnings = this.loadedFile.warnings.single
        warnings.forEach(function(w) {
          w.type = 'Warnung'
        })
        let errors = this.loadedFile.errors.single
        errors.forEach(function(e) {
          e.type = 'Error'
        })

        let errorsAndWarnings = structureErrors.concat(structureWarnings.concat(errors.concat(warnings)))

        exportServices.toTsv([{
            text: 'Zeile',
            value: 'row'
          },
            {
              text: 'Spalte',
              value: 'column'
            },
            {
              text: 'Ursache',
              value: 'reason'
            },
            {
              text: 'Typ',
              value: 'type'
            }],
          errorsAndWarnings,
          {'filename' : 'test.csv'}
        )

      },
    }
  }

</script>

