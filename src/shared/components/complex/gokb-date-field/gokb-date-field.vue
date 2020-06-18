<template>
  <v-menu
    v-model="menu2"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="localDate"
        clearable
        v-bind="$props"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="localDate"
      :disabled="disabled"
      @input="menu2 = false"
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
      value: {
        type: Date,
        required: true
      }
    },
    data () {
      return {
        menu2: false,
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
      }
    }
  }
</script>

<style scoped>
</style>
