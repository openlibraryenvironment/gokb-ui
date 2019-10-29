<template>
  <v-combobox
    :placeholder="placeholder"
  />
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'ComboboxFieldComponent',
    extends: BaseComponent,
    props: {
      placeholder: {
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
