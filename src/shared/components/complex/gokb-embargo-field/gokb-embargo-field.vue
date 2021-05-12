<template>
  <div>
    <div class="text-h6">
      Embargo
    </div>
    <v-row>
      <v-col>
        <gokb-embargo-type-field
          v-model="embargoType"
          :label="$t('component.tipp.embargo.type')"
          :rules="[typeRules]"
          :readonly="readonly"
        />
      </v-col>
      <v-col>
        <gokb-number-field
          v-model="embargoDuration"
          :disabled="readonly"
          :rules="[durationRules]"
          :label="$t('component.tipp.embargo.duration')"
        />
      </v-col>
      <v-col>
        <gokb-time-period-field
          v-model="embargoUnit"
          :label="$t('component.tipp.embargo.unit.label')"
          :items="allUnits"
          :rules="[unitRules]"
          :readonly="readonly"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'GokbEmbargoField',
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      value: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        menu: false,
        type: undefined,
        duration: undefined,
        unit: undefined,
        embargoTypeField: undefined,
        embargoUnitField: undefined,
        embargoDurationField: undefined,
        errors: []
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
      embargoType: {
        get () {
          const { type } = this.decodeEmbargo()
          return type
        },
        set (type) {
          const { duration, unit } = this.decodeEmbargo()
          this.localValue = `${type || ''}${duration || ''}${unit || ''}`
        }
      },
      embargoDuration: {
        get () {
          const { duration } = this.decodeEmbargo()
          return parseInt(duration, 10) || duration
        },
        set (duration) {
          const { type, unit } = this.decodeEmbargo()
          this.localValue = `${type || ''}${duration || ''}${unit || ''}`
        }
      },
      embargoUnit: {
        get () {
          const { unit } = this.decodeEmbargo()
          return unit
        },
        set (unit) {
          const { type, duration } = this.decodeEmbargo()
          this.localValue = `${type || ''}${duration || ''}${unit || ''}`
        }
      },
      allUnits () {
        return [
          {
            id: 'D',
            name: this.$i18n.t('component.tipp.embargo.unit.day')
          },
          {
            id: 'M',
            name: this.$i18n.t('component.tipp.embargo.unit.month')
          },
          {
            id: 'Y',
            name: this.$i18n.t('component.tipp.embargo.unit.year')
          }
        ]
      }
    },
    methods: {
      decodeEmbargo () {
        const matches = this.value?.match(/^([P,R]?)([0-9]*)([D,M,Y]?)$/)
        const [, type, duration, unit] = matches || []
        return { type, duration, unit }
      },
      typeRules () {
        return !!this.embargoType || (!this.embargoType && !this.embargoDuration && !this.embargoUnit)
      },
      durationRules () {
        return !!this.embargoDuration || (!this.embargoDuration && !this.embargoType && !this.embargoUnit)
      },
      unitRules () {
        return !!this.embargoUnit || (!this.embargoUnit && !this.embargoDuration && !this.embargoType)
      }
    }
  }
</script>
