<template>
  <gokb-dialog
    v-model="show"
    title="Datei öffnen"
    :width="800"
  >
    <v-card
      raised
    >
      <v-card-title>Bitte KBart-Datei wählen</v-card-title>
      <br>
      <v-card-text>
        <v-file-input
          accept=".txt,.tsv,.csv"
          label="Hier clicken, um .tsv, .csv or .txt Datei auszuwählen"
          outlined
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          flat
          @click.stop="show=false"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="primary"
          flat
          @click.stop="importTxtFile()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbOpenFilePopup',
    extends: BaseComponent,
    props: {
      value: Boolean
    },
    data () {
      return {
      }
    },
    computed: {
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
      importTxtFile () {
        console.log('TODO: IMPORT FILE')
        // TODO trigger upload and process data
        this.close()
      },
      close () {
        console.log('CLOSE')
        this.show = false
      }
    }
  }

</script>
