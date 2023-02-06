<template>
  <v-container fluid>
    <v-row>
      <v-col :md="colGridWidth" :cols="colGridWidth" xl="3">
        <h3 class="mb-1"> {{ $t('component.review.componentToReview.label') }} ({{ reviewedComponent.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label') }})</h3>
        <gokb-reviews-title-card
          :id="reviewedComponent.id"
          role="reviewedComponent"
          :route="reviewedComponent.route"
          :selected-card="selectedCard"
          :selected-card-ids="selectedCardIds"
          :single-card-review="isSingleCardReview"
          :is-merged="isMerged"
          :editable="editable"
          :additional-vars="additionalVars"
          @feedback-response="feedbackResponse"
          @reviewed-card-selected-ids="setSelectedReviewItemIds"
        />
      </v-col>
      <v-col :md="colGridWidth" :cols="colGridWidth" xl="3" class="pa-1" v-for="i, idx in referenceComponents" :key="i.id">
        <h3 class="mb-1">
          {{ selectedCard === i.id ? $t('component.review.edit.components.merge.selected.label') : $t('component.review.edit.components.merge.unselected.label') }}
          ({{ i.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label') }})
          <b>#{{ idx + 1 }}</b>
        </h3>
        <gokb-reviews-title-card
          :id="i.id"
          role="candidateComponent"
          :route="i.route"
          :candidate-index="idx + 1"
          :reviewed-component-name="reviewedComponent.name"
          :selected-card="selectedCard"
          :selected-card-ids="selectedCardIds"
          :single-card-review="isSingleCardReview"
          :merge-enabled="isMergeEnabled"
          :link-enabled="isTippReview"
          :is-merged="isMerged"
          :editable="editable"
          :additional-vars="additionalVars"
          @set-active="setSelectedCard"
          @set-selected-ids="setSelectedCardIds"
          @merge="mergeCards"
          @link="linkTitle"
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
  import tippServices from '@/shared/services/tipp-services'

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
      reviewStatus: {
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
        isMerged: false
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
        return (this.reviewedComponent.route === '/title' || this.referenceComponents.length > 1) && !this.isMerged && this.reviewStatus === 'Open'
      },
      isTippReview () {
        return (this.reviewedComponent.route === '/package-title')
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
        let mergeData = {
          id: selectedCard !== targetId ? this.reviewedComponent.id : targetId,
          target: selectedCard !== targetId ? targetId : selectedCard,
          ids: this.selectedReviewItemIds
        }
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
      async linkTitle (targetId) {
        let linkData = {
          id: this.reviewedComponent.id,
          version: this.reviewedComponent.version,
          title: targetId
        }
        const updateResponse = await this.catchError({
          promise: tippServices.createOrUpdate(linkData, this.cancelToken.token),
          instance: this
        })
        if (typeof updateResponse == 'undefined') {
          this.feedbackResponse('error.general.500')
        }
        else {
          if (updateResponse.status < 400) {
            this.isMerged = true
          }
          this.feedbackResponse(updateResponse)
        }
      },
      feedbackResponse (response) {
        this.$emit('feedback-response', response)
      }
    }
  }
</script>
