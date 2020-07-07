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
      <gokb-url-field
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
      <gokb-embargo-type-field
        v-model="embargoType"
      />
      <v-row>
        <v-col>
          <gokb-number-field
            v-model="embargoDuration"
            label="Dauer"
          />
        </v-col>
        <v-col>
          <gokb-time-period-field
            v-model="embargoUnit"
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
          id: undefined,
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
            embargo: undefined
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
          const { type } = this.decodeEmbargo()
          return type
        },
        set (type) {
          const { duration, unit } = this.decodeEmbargo()
          this.packageTitleItem.coverageStatement.embargo = `${type || ''}${duration || ''}${unit || ''}`
        }
      },
      embargoDuration: {
        get () {
          const { duration } = this.decodeEmbargo()
          return parseInt(duration, 10) || duration
        },
        set (duration) {
          const { type, unit } = this.decodeEmbargo()
          this.packageTitleItem.coverageStatement.embargo = `${type || ''}${duration || ''}${unit || ''}`
        }
      },
      embargoUnit: {
        get () {
          const { unit } = this.decodeEmbargo()
          return unit
        },
        set (unit) {
          const { type, duration } = this.decodeEmbargo()
          this.packageTitleItem.coverageStatement.embargo = `${type || ''}${duration || ''}${unit || ''}`
        }
      }
    },
    watch: {
      'titleItem.title': {
        handler () {
          console.log('titleItem.title', this.titleItem.title)
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
      },
      decodeEmbargo () {
        const matches = this.packageTitleItem.coverageStatement.embargo?.match(/^([P,R]?)([0-9]*)([D,M,Y]?)$/)
        const [, type, duration, unit] = matches || []
        return { type, duration, unit }
      }
    }
  }
</script>
