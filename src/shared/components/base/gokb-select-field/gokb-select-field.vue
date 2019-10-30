<template>
  <v-select
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
