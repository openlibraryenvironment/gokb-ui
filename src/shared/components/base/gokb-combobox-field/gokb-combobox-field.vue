<template>
  <v-combobox v-bind="$props" />
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

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
