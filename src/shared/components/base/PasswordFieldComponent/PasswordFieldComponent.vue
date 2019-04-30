<template>
  <v-text-field :label="label" v-model="value" type="password" required/>
</template>

<script>
export default {
  name: 'PasswordFieldComponent',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: 'Kennwort',
    },
  },
}
</script>

<style scoped>
</style>
