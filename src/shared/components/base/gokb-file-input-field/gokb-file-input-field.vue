<template>
  <v-file-input
    v-model="localSelectedFile"
    :label="label"
    prepend-icon="mdi-file-delimited"
    :truncate-length="truncateLength"
    :disabled="disabled"
    accept=".txt,.tsv,.csv"
    show-size
  />
</template>

<script>
  export default {
    name: 'GokbFileInputField',
    props: {
      label: {
        type: String,
        required: false,
        default: 'Datei',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      selectedFile: {
        type: String,
        required: false,
        default: undefined,
      },
      truncateLength: {
        type: Number,
        required: false,
        default: 22
      }
    },
    computed: {
      localSelectedFile: {
        get () {
          return this.selectedFile
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>

<style scoped>
</style>
