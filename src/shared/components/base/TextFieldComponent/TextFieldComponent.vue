<template>
  <v-text-field :label="label" v-model="localValue" :type="type" required/>
</template>

<script>
export default {
  name: 'TextFieldComponent',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    label: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
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
  },
}
</script>

<style scoped>
</style>
