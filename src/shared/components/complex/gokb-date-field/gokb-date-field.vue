<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="localDateFormatted"
        clearable
        hint="DD.MM.YYYY format"
        v-bind="$props"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="localDate"
      :disabled="disabled"
      @input="menu = false"
    />
  </v-menu>
</template>

<script>
  export default {
    name: 'GokbDateField',
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      value: Date
    },
    data () {
      return {
        menu: false,
      }
    },
    computed: {
      localDate: {
        get () {
          return this.value
        },
        set (localDate) {
          this.$emit('input', localDate)
        }
      },
      localDateFormatted () {
        return this.localDate?.toLocaleDateString('de-DE')
      }
    }
  }
</script>
