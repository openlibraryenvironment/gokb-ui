<template>
  <gokb-dialog
    v-model="localValue"
    title="Neuer Titel"
    @submit="addTitle"
  >
    <gokb-section sub-title="Identifier">
      <gokb-select-field label="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Allgemein">
      <gokb-text-field label="Titel" />
      <gokb-date-field label="Veröffentlichungsdatum" />
      <gokb-text-field label="Titel URL" />
    </gokb-section>
    <gokb-section sub-title="Zugangszeitraum">
      <gokb-date-range-field label="Zugangszeitraum" />
    </gokb-section>
    <gokb-section sub-title="Abdeckung">
      <gokb-select-field label="Art" />
      <gokb-date-range-field label="Abdeckungszeitraum" />
      <gokb-number-range-field
        label-from="Ausgaben von"
        label-to="bis"
      />
      <gokb-number-range-field
        label-from="Bände von"
        label-to="bis"
      />
      <gokb-textarea-field label="Notizen" />
    </gokb-section>
    <gokb-section sub-title="Embargo">
      <gokb-select-field label="Typ" />
      <v-row>
        <v-col>
          <gokb-number-field label="Dauer" />
        </v-col>
        <v-col>
          <gokb-select-field label="Einheit" />
        </v-col>
      </v-row>
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
        Ok
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/base-component'

  export default {
    name: 'GokbAddTitlePopup',
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
      addTitle () {
        this.$emit('add', '42')
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
