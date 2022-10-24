<template>
  <v-row align="stretch" class="ma-2">
    <v-col md="4" class="pa-3" v-for="i in allComponents" :key="i.id">
      <gokb-reviews-title-card
        :id="i.id.toString()"
        @keys="addkeyFields"
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
        allHtmlClasses: [],
        allFieldKeys: new Set(),
        finishedLoading: false
      }
    },
    computed: {},
    mounted () {
      this.allComponents = [this.reviewedComponent]
      this.allComponents.push.apply(this.allComponents, this.referenceComponents)
      this.allHtmlClasses = this.getAllHtmlClasses()
    },
    watch: {},
    methods: {
      getAllHtmlClasses () {
        this.allHtmlClasses.push("titlecard-headline")
        for (const component of this.allComponents) {
          for (const [fieldKey, fieldValue] of Object.entries(component)) {
            if (!(fieldKey in ["name", "identifiers"])) {
              this.allHtmlClasses.push("titlecard-" + fieldKey)
            }
          }
        }
      },
      addkeyFields (keys) {
        keys.forEach(key => this.allFieldKeys.add(key))
      }
    }
  }
</script>
