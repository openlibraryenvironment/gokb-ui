<template>
  <v-row align="stretch" class="ma-2">
    <v-col md="4" class="pa-3" v-for="i in allComponents" :key="i.id">
      <GokbReviewsTitlesCard :item="i" />
    </v-col>
  </v-row>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbReviewsTitleCard from '@/shared/components/complex/gokb-reviews-title-card'

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
    computed: {
      allComponents () {
        var comps = [this.reviewedComponent]
        comps.push.apply(this.referenceComponents)
        return comps 
      }
    },
    watch: {},
    methods: {}
  }
</script>
