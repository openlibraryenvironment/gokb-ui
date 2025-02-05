<template>
  <v-menu
    v-model="showPicker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateRangeText"
        :label="label"
        readonly
        :clearable="!disabled"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="dates"
      :disabled="disabled"
      range
    />
  </v-menu>
</template>

<script>
  export default {
    name: 'GokbDateRangeField',
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      modelValue: {
        type: Array,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        showPicker: false,
        dates: []
      }
    },
    computed: {
      dateRangeText: {
        get () {
          // todo: convert to DD.MM.YYYY using .toLocaleDateString('de-DE')
          return this.dates.join(' - ')
        },
        set (value) {
          // we only handle the clear case, because editiong is not possible
          this.dates = []
        }
      },
    },
    watch: {
      dates () {
        this.$emit('update:modelValue', this.dates)
      }
    },
  }
</script>
