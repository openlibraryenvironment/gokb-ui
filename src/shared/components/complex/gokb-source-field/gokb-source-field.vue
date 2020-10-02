<template>
  <div>
    <gokb-url-field
      v-model="url"
      :label="$t('component.source.url')"
      :readonly="readonly"
    />
    <v-row>
      <v-col>
        <gokb-number-field
          v-model="cycleDuration"
          :disabled="readonly"
          :rules="[durationRules]"
          :label="$t('component.tipp.embargo.duration')"
        />
      </v-col>
      <v-col>
        <gokb-time-period-field
          v-model="cycleUnit"
          :label="$t('component.tipp.embargo.unit.label')"
          :items="allUnits"
          return-object
          :rules="[unitRules]"
          :readonly="readonly"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import sourceServices from '@/shared/services/source-services'
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbSourceField',
    extends: BaseComponent,
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      value: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        id: undefined,
        name: undefined,
        menu: false,
        url: undefined,
        duration: undefined,
        unit: undefined,
        cycleUnitField: undefined,
        cycleDurationField: undefined,
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
      cycleDuration: {
        get () {
          const duration = this.duration
          return parseInt(duration, 10) || duration
        },
        set (duration) {
          const unit = this.unit.id
          this.localValue = { url: this.url, id: this.id, name: this.name, frequency: `${duration || ''}${unit || ''}` }
        }
      },
      cycleUnit: {
        get () {
          const unit = this.unit
          return unit
        },
        set (unit) {
          const duration = this.duration
          this.localValue = { url: this.url, id: this.id, name: this.name, frequency: `${duration || ''}${unit || ''}` }
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
    async mounted () {
      if (this.value?.id) {
        const result = await this.catchError({
          promise: sourceServices.getSource(this.value.id, this.cancelToken.token),
          instance: this
        })

        if (result?.status === 200) {
          const duration = result.data.frequency ? parseInt(result.data.frequency?.match(/[0-9]/)[0]) : undefined
          const unit = result.data.frequency?.match(/[D,M,Y]/)[0]

          this.id = result.data.id
          this.duration = duration
          this.unit = unit ? { id: unit, name: this.allUnits.find(unit => unit.id === unit) } : undefined
          this.name = result.data.name
          this.url = result.data.url

          this.localValue = { url: this.url, id: this.id, name: this.name, frequency: `${this.duration || ''}${this.unit?.id || ''}` }

          console.log(this.value)
        }
      } else {
        console.log('No Source')
      }
    },
    methods: {
      decodeCycle () {
        const matches = this.value?.frequency?.match(/^([0-9]*)([D,M,Y]?)$/)
        const [, duration, unit] = matches || []
        return { duration, unit }
      },
      durationRules () {
        return !!this.cycleDuration || (!this.cycleDuration && !this.cycleUnit)
      },
      unitRules () {
        return !!this.cycleUnit || (!this.cycleUnit && !this.cycleDuration)
      }
    }
  }
</script>
