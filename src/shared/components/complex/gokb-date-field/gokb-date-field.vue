<template>
  <v-menu
    v-model="menu2"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        clearable
        :label="label"
        :disabled="disabled"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date"
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
    },
    data () {
      return {
        menu2: false,
      }
    }
  }
</script>

<style scoped>
</style>
