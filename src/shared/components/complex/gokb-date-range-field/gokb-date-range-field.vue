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
        clearable
        :label="label"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="dates"
      range
      @input="handleVisibility"
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
    },
    data () {
      return {
        dates: [],
        showPicker: false,
      }
    },
    computed: {
      dateRangeText () {
        return this.dates.join(' - ')
      },
    },
    methods: {
      handleVisibility () {
        this.showPicker = this.dates.length !== 2
      }
    },
  }
</script>

<style scoped>
</style>
