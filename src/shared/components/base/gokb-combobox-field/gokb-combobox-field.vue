<template>
  <v-combobox
    :label="label"
    :placeholder="placeholder"
  />
</template>

<script>
  import BaseComponent from '@/shared/base-component'

  export default {
    name: 'GokbComboboxField',
    extends: BaseComponent,
    props: {
      placeholder: {
        type: String,
        required: false,
        default: '',
      },
      label: {
        type: String,
        required: false,
        default: '',
      }
    },
    data () {
      return {
      }
    },
    computed: {
    },
  }
</script>
