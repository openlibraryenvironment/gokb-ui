<template>
  <v-row align="stretch" class="ma-2">
    <v-col md="4" class="pa-3" v-for="i in allComponents" :key="i.id">
      <GokbReviewsTitle Card :item="i" />
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
      return {
        allComponents: []
      }
    },
    computed: {
      allComponentsOld () {
        var comps = [this.reviewedComponent]
        comps.push.apply(this.referenceComponents)
      }
    },
    mounted () {
      console.log("this.reviewedComponent: " + this.reviewedComponent)
      console.log("this.referenceComponents: " + this.referenceComponents)
      this.allComponents = [this.reviewedComponent]
      this.allComponents.push.apply(this.referenceComponents)
    },
    watch: {},
    methods: {}
  }
</script>
