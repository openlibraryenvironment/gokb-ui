<template>
  <v-row align="stretch" class="ma-2">
    <v-col md="4" class="pa-3" v-for="i in allComponents" :key="i.id">
      <GokbReviewsTitleCard
        :id="i.id.toString()"
      />
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
        required: true
      },
      referenceComponents: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        allComponents: [],
        finishedLoading: false
      }
    },
    computed: {},
    mounted () {
      this.allComponents = [this.reviewedComponent]
      this.allComponents.push.apply(this.allComponents, this.referenceComponents)
    },
    watch: {},
    methods: {}
  }
</script>
