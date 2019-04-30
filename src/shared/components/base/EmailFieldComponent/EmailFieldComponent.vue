<template>
  <v-text-field label="E-Mail" v-model="value" type="text" required/>
</template>

<script>
export default {
  name: 'EmailFieldComponent',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
  },
}
</script>

<style scoped>
</style>
