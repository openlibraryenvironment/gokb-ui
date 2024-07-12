<template>
  <div>
    <v-row v-if="!readonly">
      <v-col
        cols="10"
        class="pr-0"
      >
        <v-text-field
          v-model="displayDate"
          :clearable="clearable"
          :label="label"
          :hint="$t('default.ISOdateHint')"
          :rules="combinedRules"
          :required="required"
          :density="dense ? 'compact' : 'default'"
          variant="underlined"
        />
      </v-col>
      <v-col
        align-self="center"
        cols="2"
      >
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
        >
          <template v-slot:activator="{ props }">
            <v-icon
              :class="dense ? 'pb-5' : 'pb-1'"
              v-bind="props"
              color="primary"
            >
              mdi-calendar
            </v-icon>
          </template>
          <v-date-picker
            v-if="!readonly"
            v-model="pickerDateValue"
            @input="menu = false"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-text-field
      v-else
      :model-value="displayDate"
      class="gokb-date-field-disabled"
      v-bind="$props"
      :density="dense ? 'compact' : 'default'"
      variant="underlined"
      disabled
    />
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbDateField',
    extends: BaseComponent,
    emits: ['update:model-value'],
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
      clearable: {
        type: Boolean,
        required: false,
        default: true,
      },
      modelValue: {
        type: String,
        required: false,
        default: undefined
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      rules: {
        type: Array,
        required: false,
        default: undefined
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        menu: false,
        displayDate: undefined
      }
    },
    computed: {
      pickerDateValue: {
        get () {
          return new Date(this.displayDate || this.modelValue)
        },
        set (localDate) {
          this.displayDate = localDate?.toISOString().substring(0, 10) || undefined
        }
      },
      combinedRules () {
        return this.rules || [
          value => !this.required || !!value || this.$i18n.t('validation.missingValue'),
          value => !value || (/^([12][0-9]{3})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/.test(value) && !isNaN(new Date(value))) || this.$i18n.t('validation.dateFormat')
        ]
      }
    },
    watch: {
      displayDate (date) {
        this.$emit('update:model-value', date)
      }
    },
    mounted () {
      this.displayDate = this.modelValue
    }
  }
</script>
