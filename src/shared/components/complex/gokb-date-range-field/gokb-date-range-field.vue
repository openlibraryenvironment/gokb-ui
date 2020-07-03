<template>
  <v-menu
    v-model="showPicker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateRangeText"
        :label="label"
        readonly
        clearable
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="dates"
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
      value: {
        type: Array,
        required: true
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
        this.$emit('input', this.dates)
      }
    },
  }
</script>
