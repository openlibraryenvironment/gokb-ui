<template>
  <v-container fluid>
    <v-row>
      <v-col :md="colGridWidth" :cols="colGridWidth" class="pa-1" v-for="i in allComponents" :key="i.id">
        <gokb-reviews-title-card
          :id="i.id.toString()"
          :role="cardRole(i.id)"
          :selected-card="selectedCard"
          :selected-card-ids="selectedCardIds"
          :single-card-review="isSingleCardReview"
          :is-merged="isMerged"
          @keys="addkeyFields"
          @set-active="setSelectedCard"
          @set-selected-ids="setSelectedCardIds"
          @merge="mergeCards"
          @prepare-close="prepareClose"
          @feedback-response="feedbackResponse"
          @reviewed-card-selected-ids="setSelectedIdItems"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbReviewsTitleCard from '@/shared/components/complex/gokb-reviews-title-card'
  import titleServices from '@/shared/services/title-services'

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
        allFieldKeys: new Set(),
        finishedLoading: false,
        selectedCard: undefined,
        selectedCardIds: undefined,
        selectedIdItems: [],
        isMerged: false
      }
    },
    computed: {
      colGridWidth () {
        return 12 / this.allComponents.length > 3 ? 12 / this.allComponents.length : 3
      },
      isSingleCardReview () {
        console.log("this.allComponents.length : " + this.allComponents.length)
        return this.allComponents.length < 2
      }
    },
    mounted () {
      this.allComponents = [this.reviewedComponent]
      this.allComponents.push.apply(this.allComponents, this.referenceComponents)
    },
    watch: {},
    methods: {
      addkeyFields (keys) {
        keys.forEach(key => this.allFieldKeys.add(key))
      },
      cardRole (cardComponentId) {
        if (cardComponentId == this.reviewedComponent.id) {
          return "reviewedComponent"
        }
        return "candidateComponent"
      },
      setSelectedCard (id) {
        this.selectedCard = id
      },
      setSelectedCardIds (ids) {
        this.selectedCardIds = ids
      },
      setSelectedIdItems (ids) {
        this.selectedIdItems = ids
      },
      async mergeCards (targetData) {
        let mergeData = { id: this.reviewedComponent.id, target: targetData.id, ids: this.selectedIdItems }
        const mergeResponse = await this.catchError({
          promise: titleServices.mergeTitle(mergeData, this.cancelToken.token),
          instance: this
        })
        if (typeof mergeResponse == 'undefined') {
          this.feedbackResponse('error.general.500')
        }
        else {
          if (mergeResponse.status < 400) {
            this.isMerged = true
            this.prepareClose()
          }
          this.feedbackResponse(mergeResponse)
        }
      },
      feedbackResponse (response) {
        this.$emit('feedback-response', response)
      },
      prepareClose () {
        this.$emit('close-review')
      }
    }
  }
</script>
