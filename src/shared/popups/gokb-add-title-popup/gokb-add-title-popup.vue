<template>
  <gokb-dialog
    v-model="localValue"
    :title="`${titleType.text} hinzufügen`"
    :width="600"
    @submit="addTitle"
  >
    <gokb-identifier-section
      v-model="identifiers"
    />
    <gokb-section sub-title="Allgemein">
      <gokb-title-field
        v-model="title"
      />
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
        @click="close"
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
  import BaseComponent from '@/shared/components/base-component'
  import GokbIdentifierSection from '@/shared/components/complex/gokb-identifier-section'

  export default {
    name: 'GokbAddTitlePopup',
    components: { GokbIdentifierSection },
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      titleType: {
        type: Object,
        required: true,
      }
    },
    data () {
      return {
        titleItem: {
          name: undefined,
          ids: [],
          publisher: undefined,
          publishedFrom: undefined,
          publishedTo: undefined
        },
        tippItem: {
          titleURL: undefined,
          accessFrom: undefined,
          accessTo: undefined,
          coverage: undefined,
          embargo: undefined,
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
