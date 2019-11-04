<template>
  <v-select
    :label="label"
    :placeholder="placeholder"
  />
</template>

<script>
  import BaseComponent from '@/shared/base-component'

  export default {
    name: 'GokbSelectField',
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
