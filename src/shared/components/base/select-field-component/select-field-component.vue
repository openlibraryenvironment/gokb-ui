<template>
  <v-select
    :placeholder="placeholder"
  />
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'SearchFieldComponent',
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
