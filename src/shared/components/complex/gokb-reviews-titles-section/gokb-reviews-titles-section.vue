<template>

</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbReviewsTitlesSection',
    components: {
      GokbReviewsTitleCard
    },
    extends: BaseComponent,
    props: {
      reviewedComponent: {
        type: Object,
        required: false,
        default: undefined
      },
      referenceComponents: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>
