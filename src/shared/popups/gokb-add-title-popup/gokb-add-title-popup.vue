<template>
  <gokb-dialog
    v-model="localValue"
    :title="`${titleType.text} hinzufügen`"
    :width="600"
    @submit="addTitle"
  >
    <gokb-identifier-section
      v-model="titleItem.ids"
    />
    <gokb-section sub-title="Allgemein">
      <gokb-title-field
        v-model="titleItem.title"
        return-object
      />
      <gokb-date-range-field
        v-model="publicationDate"
        label="Veröffentlichungsdatum"
      />
      <gokb-text-field
        v-model="packageTitleItem.url"
        label="Titel URL"
      />
    </gokb-section>
    <gokb-section sub-title="Zugangszeitraum">
      <gokb-date-range-field
        v-model="accessInterval"
        label="Zugangszeitraum"
      />
    </gokb-section>
    <gokb-section sub-title="Abdeckung">
      <gokb-select-field
        v-model="packageTitleItem.coverageStatement.coverageDepth"
        label="Art"
      />
      <gokb-date-range-field
        v-model="converageInterval"
        label="Abdeckungszeitraum"
      />
      <gokb-number-range-field
        model="issueInterval"
        label-from="Ausgaben von"
        label-to="bis"
      />
      <gokb-number-range-field
        v-model="volumeInterval"
        label-from="Bände von"
        label-to="bis"
      />
      <gokb-textarea-field
        v-model="packageTitleItem.coverageStatement.coverageNote"
        label="Notizen"
      />
    </gokb-section>
    <gokb-section sub-title="Embargo">
      <gokb-select-field
        v-model="embargoType"
        label="Typ"
      />
      <v-row>
        <v-col>
          <gokb-number-field
            v-model="embargoDuration"
            label="Dauer"
          />
        </v-col>
        <v-col>
          <gokb-select-field
            v-model="embargoUnit"
            label="Einheit"
          />
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
          title: undefined,
          ids: [],
          publisher: undefined,
          publishedFrom: undefined,
          publishedTo: undefined
        },
        packageTitleItem: {
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          url: undefined,
          accessStartDate: undefined,
          accessEndDate: undefined,
          coverageStatement: { // not for ebooks
            coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
            startDate: undefined,
            endDate: undefined,
            startVolume: undefined, // number
            endVolume: undefined, // number
            startIssue: undefined, // number
            endIssue: undefined, // number
            coverageNote: undefined, // note
            embargo: undefined // embargo code: <Type(P|R)><Duration><Unit(D|M|Y)>
          }
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
      publicationDate: {
        get () {
          return [this.titleItem.publishedFrom, this.titleItem.publishedTo]
        },
        set ([from, to]) {
          this.titleItem.publishedFrom = from
          this.titleItem.publishedTo = to
        }
      },
      accessInterval: {
        get () {
          return [this.packageTitleItem.accessStartDate, this.packageTitleItem.accessEndDate]
        },
        set ([from, to]) {
          this.packageTitleItem.accessStartDate = from
          this.packageTitleItem.accessEndDate = to
        }
      },
      converageInterval: {
        get () {
          return [this.packageTitleItem.coverageStatement.startDate, this.packageTitleItem.coverageStatement.endDate]
        },
        set ([from, to]) {
          this.packageTitleItem.coverageStatement.startDate = from
          this.packageTitleItem.coverageStatement.endDate = to
        }
      },
      issueInterval: {
        get () {
          return [this.packageTitleItem.coverageStatement.startIssue, this.packageTitleItem.coverageStatement.endIssue]
        },
        set ([from, to]) {
          this.packageTitleItem.coverageStatement.startIssue = from
          this.packageTitleItem.coverageStatement.endIssue = to
        }
      },
      volumeInterval: {
        get () {
          return [this.packageTitleItem.coverageStatement.startVolume, this.packageTitleItem.coverageStatement.endVolume]
        },
        set ([from, to]) {
          this.packageTitleItem.coverageStatement.startVolume = from
          this.packageTitleItem.coverageStatement.endVolume = to
        }
      },
      embargoType: {
        get () {
          return this.embargo
        },
        set (value) {
          this.embargo = value
        }
      },
      embargoDuration: {
        get () {
          return this.embargo
        },
        set (value) {
          this.embargo = value
        }
      },
      embargoUnit: {
        get () {
          return this.embargo
        },
        set (value) {
          this.embargo = value
        }
      }
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
