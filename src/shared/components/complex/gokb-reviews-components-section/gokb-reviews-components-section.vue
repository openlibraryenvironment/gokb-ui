<template>
  <v-container fluid>
    <v-row v-if="isTitleReview">
      <v-col :md="colGridWidth" :cols="colGridWidth" xl="3" class="pa-1 mr-3">
        <h3 class="mb-1"> {{ $t('component.review.componentToReview.label') }}</h3>
        <gokb-reviews-title-card
          :id="reviewedComponent.id.toString()"
          role="reviewedComponent"
          :route="reviewedComponent.route"
          :selected-card="selectedCard"
          :selected-card-ids="selectedCardIds"
          :single-card-review="isSingleCardReview"
          :merge-enabled="isMergeEnabled"
          :is-merged="isMerged"
          :editable="editable"
          :fields-to-be-edited="fieldsPerType[reviewType]"
          :additional-vars="additionalVars"
          @feedback-response="feedbackResponse"
          @reviewed-card-selected-ids="setSelectedReviewItemIds"
        />
      </v-col>
      <v-col :md="colGridWidth" :cols="colGridWidth" xl="3" class="pa-1" v-for="i in referenceComponents" :key="i.id">
        <h3 class="mb-1">{{ selectedCard === i.id ? $t('component.review.edit.components.merge.selected.label') : $t('component.review.edit.components.merge.unselected.label') }}</h3>
        <gokb-reviews-title-card
          :id="i.id.toString()"
          role="candidateComponent"
          :route="i.route"
          :selected-card="selectedCard"
          :selected-card-ids="selectedCardIds"
          :single-card-review="isSingleCardReview"
          :merge-enabled="isMergeEnabled"
          :is-merged="isMerged"
          :editable="editable"
          :fields-to-be-edited="fieldsPerType[reviewType]"
          :additional-vars="additionalVars"
          @set-active="setSelectedCard"
          @set-selected-ids="setSelectedCardIds"
          @merge="mergeCards"
          @feedback-response="feedbackResponse"
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
    name: 'GokbReviewsComponentsSection',
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
      },
      reviewType: {
        type: String,
        required: false,
        default: undefined
      },
      additionalVars: {
        type: Array,
        required: false,
        default: undefined
      },
      editable: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        finishedLoading: false,
        selectedCard: undefined,
        selectedCardIds: undefined,
        selectedReviewItemIds: [],
        selectedIdItems: [],
        isMerged: false,
        fieldsPerType: {
          "Invalid Name": ["name"],
          "Minor Identifier Mismatch": ["ids"],
          "Major Identifier Mismatch": ["ids"],
          "Critical Identifier Conflict": ["ids"],
          "Ambiguous Title Matches": ["ids"]
        }
      }
    },
    computed: {
      colGridWidth () {
        return 12 / (this.referenceComponents.length + 1 > 3 ? (12 / this.referenceComponents.length + 1) : 3)
      },
      isSingleCardReview () {
        return this.referenceComponents.length === 0
      },
      isMergeEnabled () {
        return (this.reviewedComponent.route === '/title')
      },
      isTitleReview () {
        return (this.reviewedComponent.route === '/title' || this.reviewedComponent.route === '/package-title')
      }
    },
    methods: {
      setSelectedCard (id) {
        this.selectedCard = id
      },
      setSelectedCardIds (ids) {
        this.selectedCardIds = ids
      },
      setSelectedReviewItemIds (ids) {
        this.selectedReviewItemIds = ids
      },
      async mergeCards (targetId) {
        let mergeData = { id: this.reviewedComponent.id, target: targetId, ids: this.selectedReviewItemIds }
        const mergeResponse = await this.catchError({
          promise: titleServices.merge(mergeData, this.cancelToken.token),
          instance: this
        })
        if (typeof mergeResponse == 'undefined') {
          this.feedbackResponse('error.general.500')
        }
        else {
          if (mergeResponse.status < 400) {
            this.isMerged = true
          }
          this.feedbackResponse(mergeResponse)
        }
      },
      feedbackResponse (response) {
        this.$emit('feedback-response', response)
      }
    }
  }
</script>
