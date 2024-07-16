<template>
  <v-file-input
    ref="input"
    v-model="localSelectedFile"
    :label="label"
    prepend-icon="mdi-file-delimited"
    :truncate-length="truncateLength"
    :disabled="disabled"
    accept=".txt,.tsv,.csv"
    show-size
    @update:model-value="truncateFileName"
  >
    <template #selection>
      {{ truncatedFileName }}
    </template>
  </v-file-input>
</template>

<script>
  export default {
    name: 'GokbFileInputField',
    emits: ['update:model-value'],
    data () {
      return {
        truncatedFileName: undefined
      }
    },
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
      modelValue: {
        type: [File, Array],
        required: false,
        default: null,
      },
      truncateLength: {
        type: Number,
        required: false,
        default: 30
      }
    },
    computed: {
      localSelectedFile: {
        get () {
          return this.modelValue
        },
        set (value) {
          this.$emit('update:model-value', value)
        }
      }
    },
    methods: {
      truncateFileName(file) {
        if (!!file) {
          if (file.name?.length < Number(this.truncateLength)) {
            this.truncatedFileName = str
          }

          const charsKeepOneSide = Math.floor((Number(this.truncateLength) - 1) / 2)
          this.truncatedFileName = `${file.name?.slice(0, charsKeepOneSide)}…${file.name?.slice(file.name?.length - charsKeepOneSide)}`
        }
      }
    }
  }
</script>

<style scoped>
</style>
