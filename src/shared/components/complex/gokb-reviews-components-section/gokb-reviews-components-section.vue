<template>
  <gokb-section
    v-model="innerExpanded"
    :sub-title="workflowTitle"
    expandable
  >
    <gokb-confirmation-popup
      v-model="showSubmitConfirm"
      :message="submitConfirmationMessage"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <v-container fluid>
      <v-row>
        <v-col
          v-if="workflow.showReviewed"
          :md="colGridWidth"
          :cols="colGridWidth"
          xl="3"
        >
          <h3 class="mb-1"> {{ $t('component.review.componentToReview.label') }} ({{ reviewedComponent.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label') }})</h3>
          <gokb-reviews-title-card
            :id="reviewedComponent.id"
            :ref="reviewedComponent.id"
            role="reviewedComponent"
            :route="reviewedComponent.route"
            :selected-card="selectedCard"
            :selected-card-ids="selectedCardIds"
            :single-card-review="isSingleCardReview"
            :merge-enabled="isMergeEnabled"
            :is-merged="isMerged"
            :editable="isIdsEnabled"
            :additional-vars="additionalVars"
            @feedback-response="feedbackResponse"
            @reviewed-card-selected-ids="setSelectedReviewItemIds"
          />
        </v-col>
        <v-col
          :md="colGridWidth"
          :cols="colGridWidth"
          xl="3"
          class="pa-1"
          v-for="i, idx in referenceComponents"
          :key="i.id"
        >
          <div v-if="linkedComponents[i.id].active">
            <h3 class="mb-1">
              {{ selectedCard === i.id ? $t('component.review.edit.components.merge.selected.label') : $t('component.review.edit.components.merge.unselected.label') }}
              ({{ i.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label') }})
              <b>#{{ idx + 1 }}</b>
            </h3>
            <gokb-reviews-title-card

              :id="i.id"
              :ref="i.id"
              role="candidateComponent"
              height="100%"
              :route="i.route"
              :candidate-index="idx + 1"
              :reviewed-component-name="reviewedComponent.name"
              :selected-card="selectedCard"
              :selected-card-ids="selectedCardIds"
              :single-card-review="isSingleCardReview"
              :merge-enabled="isMergeEnabled"
              :link-enabled="isLinkEnabled"
              :is-merged="isMerged"
              :editable="isIdsEnabled"
              :additional-vars="additionalVars"
              @loaded="toggleLoaded"
              @set-active="setSelectedCard"
              @set-selected-ids="setSelectedCardIds"
              @merge="mergeCards"
              @link="linkTitle"
              @feedback-response="feedbackResponse"
            />
          </div>
        </v-col>
        <v-col
          v-if="isAddEnabled"
          :md="colGridWidth"
          :cols="colGridWidth"
          xl="3"
        >
          <v-card class="mt-4 mb-2" height="95%">
            <v-container fill-height fluid>
              <v-row align="center" justify="space-around">
                <gokb-button @click="showConfirmGenerateTitle">
                  {{ $t('component.review.edit.components.add.label') }}
                </gokb-button>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col v-if="!!newTitle">
          <gokb-reviews-title-card
            :id="newTitle.id"
            :ref="newTitle.id"
            route="/title"
            :editable="isIdsEnabled"
            is-merged
          />
        >
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="moreSteps" fluid>
      <v-row>
        <v-row align="center" justify="space-around">
          <gokb-button @click="nextStep"> {{ $t('btn.next') }}</gokb-button>
        </v-row>
      </v-row>
    </v-container>
  </gokb-section>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbReviewsTitleCard from '@/shared/components/complex/gokb-reviews-title-card'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import titleServices from '@/shared/services/title-services'
  import tippServices from '@/shared/services/tipp-services'
  import loading from '@/shared/models/loading'

  export default {
    name: 'GokbReviewsComponentsSection',
    components: {
      GokbReviewsTitleCard,
      GokbConfirmationPopup
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
      candidates: {
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
      },
      moreSteps: {
        type: Boolean,
        required: false,
        default: false
      },
      workflow: {
        type: Object,
        required: false,
        default: undefined
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true,
      }
    },
    data () {
      return {
        finishedLoading: false,
        selectedCard: undefined,
        selectedCardIds: undefined,
        selectedReviewItemIds: [],
        submitConfirmationMessage: undefined,
        showSubmitConfirm: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        selectedIdItems: [],
        linkedComponents: {},
        isMerged: false,
        newTitle: undefined
      }
    },
    computed: {
      innerExpanded: {
        get () {
          return this.expanded
        },
        set (val) {
          this.$emit('expand', val)
        }
      },
      colGridWidth () {
        return 12 / (this.referenceComponents.length + (this.isAddEnabled ? 2 : 1) > 3 ? (12 / this.referenceComponents.length + (this.isAddEnabled ? 2 : 1)) : 3)
      },
      isSingleCardReview () {
        return this.referenceComponents.length === 0
      },
      isMergeEnabled () {
        return !this.isMerged && this.reviewStatus === 'Open' && this.workflow?.actions?.includes('merge')
      },
      isTippReview () {
        return (this.reviewedComponent.route === '/package-title')
      },
      isLinkEnabled () {
        return this.reviewStatus === 'Open' && this.workflow?.actions?.includes('link')
      },
      isIdsEnabled () {
        return this.reviewStatus === 'Open' && this.workflow?.actions?.includes('ids')
      },
      isAddEnabled () {
        return this.reviewStatus === 'Open' && this.workflow?.actions?.includes('add') && !this.newTitle
      },
      workflowTitle () {
        return this.editable ? this.workflow.title : this.$i18n.tc('component.general.label', 3)
      }
    },
    watch: {
      'components': {
        deep: true,
        handler () {
          let loaded = true

          for (const [key, value] of Object.entries(this.activeComponents)) {
            if (!v.loaded) {
              loaded = false
              break
            }
          }

          if (loaded) {
            this.finishedLoading = true
          }
        }
      }
    },
    created() {
      this.linkedComponents[this.reviewedComponent.id.toString()] = { loaded: false, active: true }
      this.referenceComponents.forEach(rc => {
        this.linkedComponents[rc.id.toString()] = { loaded: false, active: true }
      })
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      setSelectedCard (id) {
        this.selectedCard = id
      },
      setSelectedCardIds (ids) {
        this.selectedCardIds = ids
      },
      setSelectedReviewItemIds (ids) {
        this.selectedReviewItemIds = ids
      },
      async mergeCards (val) {
        let mergedId = this.selectedCard !== val ? this.reviewedComponent.id : val
        let targetId = this.selectedCard !== val ? val : this.selectedCard
        let mergeData = {
          id: mergedId,
          target: targetId,
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
            this.linkedComponents[mergedId.toString()].active = false
            this.toggleLoaded (targetId)

            if (mergedId === this.reviewedComponent.id) {
              this.$emit('close', true)
            }
          }
          this.feedbackResponse(mergeResponse)
        }
      },
      showConfirmGenerateTitle () {
        this.actionToConfirm = "generateTippTitle"
        this.parameterToConfirm = undefined
        this.submitConfirmationMessage = { text: 'component.review.edit.components.add.message', vars: [] }
      },
      async generateTippTitle () {
        const tippInfo = await this.catchError({
          promise: tippServices.get(this.reviewedComponent.id, this.cancelToken.token),
          instance: this
        })

        if (tippInfo.status === 200) {
          let titleData = {
            name: tippInfo.data.name,
            type: tippInfo.data.publicationType.name,
            ids: tippInfo.data._embedded.ids,
            _checked: true
          }

          const newTitleResponse = await this.catchError({
            promise: titleServices.createOrUpdate(titleData, this.cancelToken.token),
            instance: this
          })

          this.feedbackResponse(newTitleResponse)

          if (newTitleResponse.status === 200) {
            this.newTitle = {
              name: newTitleResponse.data.name,
              id: newTitleResponse.data.id,
              type: newTitleResponse.data.type,
              route: '/title'
            }
          }
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
          this.feedbackResponse(updateResponse)
        }
      },
      feedbackResponse (response) {
        this.$emit('feedback-response', response)
      },
      toggleLoaded (cardId) {
        if (this.linkedComponents[cardId.toString()]) {
          this.linkedComponents[cardId.toString()].loaded = !this.linkedComponents[cardId.toString()].loaded
        }
      },
      nextStep () {
        this.$emit('finished', true)
      }
    }
  }
</script>
