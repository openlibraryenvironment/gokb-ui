<template>
  <div>
    <div class="text-h6">
      {{ $t('component.tipp.embargo.label') }}
    </div>
    <v-row>
      <v-col cols="4">
        <gokb-select-field
          v-model="embargoType"
          :label="$t('component.tipp.embargo.type.label')"
          :static-items="embargoTypes"
          :rules="[typeRules]"
          :readonly="readonly"
          return-object
        />
      </v-col>
      <v-col cols="4">
        <gokb-number-field
          v-model="embargoDuration"
          :disabled="readonly"
          :rules="[durationRules]"
          :label="$t('component.tipp.embargo.duration')"
        />
      </v-col>
      <v-col cols="4">
        <gokb-select-field
          v-model="embargoUnit"
          :label="$t('component.tipp.embargo.unit.label')"
          :static-items="embargoPeriods"
          :rules="[unitRules]"
          :readonly="readonly"
          return-object
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'GokbEmbargoField',
    emits: ['update:model-value', 'valid'],
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
      modelValue: {
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
        embargoType: undefined,
        embargoUnit: undefined,
        embargoDuration: undefined,
        errors: [],
        embargoTypes:  [
          {
            id: 'R',
            name: this.$i18n.t('component.tipp.embargo.type.rolling')
          },
          {
            id: 'P',
            name: this.$i18n.t('component.tipp.embargo.type.period')
          }
        ],
        embargoPeriods: [
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
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
          this.$emit('valid', (!localValue || localValue?.length === 0 || !!localValue.match(/^[P,R][0-9]*[D,M,Y]$/)))
        }
      },
      typeRules () {
        return !!this.embargoType || (!this.embargoType && !this.embargoDuration && !this.embargoUnit) || this.$i18n.t('component.tipp.embargo.error.missingPart')
      },
      durationRules () {
        return !!this.embargoDuration || (!this.embargoDuration && !this.embargoType && !this.embargoUnit) || this.$i18n.t('component.tipp.embargo.error.missingPart')
      },
      unitRules () {
        return !!this.embargoUnit || (!this.embargoUnit && !this.embargoDuration && !this.embargoType) || this.$i18n.t('component.tipp.embargo.error.missingPart')
      }
    },
    watch: {
      embargoType(val) {
        this.localValue = this.buildNewVal()
      },
      embargoDuration(val) {
        this.localValue = this.buildNewVal()
      },
      embargoUnit(val) {
        this.localValue = this.buildNewVal()
      }
    },
    created () {
      if (!!this.modelValue) {
        const initParts = this.decodeEmbargo()

        this.embargoType = initParts['type'] === 'R' ? this.embargoTypes[0] : this.embargoTypes[1]

        this.embargoDuration = initParts['duration']

        if (initParts['unit'] === 'D') {
          this.embargoUnit = this.embargoPeriods[0]
        } else if (initParts['unit'] === 'M') {
          this.embargoUnit = this.embargoPeriods[1]
        } else if (initParts['unit'] === 'Y') {
          this.embargoUnit = this.embargoPeriods[2]
        }
      }
    },
    methods: {
      decodeEmbargo () {
        const matches = this.modelValue?.match(/^([P,R]?)([0-9]*)([D,M,Y]?)$/)
        const [, type, duration, unit] = matches || []
        return { type, duration, unit }
      },
      buildNewVal () {
        return `${!!this.embargoType ? this.embargoType.id : ''}${this.embargoDuration}${!!this.embargoUnit ? this.embargoUnit.id : ''}`
      }
    }
  }
</script>
