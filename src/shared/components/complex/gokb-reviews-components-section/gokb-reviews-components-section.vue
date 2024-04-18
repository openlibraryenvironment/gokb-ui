<template>
  <gokb-section
    v-model="innerExpanded"
    :sub-title="workflowTitle"
    :no-tool-bar="noToolBar"
    expandable
  >
    <gokb-confirmation-popup
      v-model="showSubmitConfirm"
      :message="submitConfirmationMessage"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <v-alert v-if="editable && isStatusOpen" type="info"> <span class="font-weight-bold">{{ workflow.toDo }}</span> </v-alert>
    <v-container fluid>
      <v-row>
        <v-col
          v-if="workflow.showReviewed"
          :md="colGridWidth"
          :cols="colGridWidth"
          xl="3"
          class="pa-1"
        >
          <v-row>
            <v-col>
              <h3 class="mb-1">
                <v-icon class="mr-1 mt-n1">
                  {{ reviewedComponent.route === '/title' ? 'mdi-text-box' : 'mdi-folder-file' }}
                </v-icon>
                {{ $t('component.review.edit.componentToReview.label', [reviewedComponent.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label')]) }}
              </h3>
              <gokb-reviews-title-card
                :id="reviewedComponent.id"
                :ref="reviewedComponent.id.toString()"
                role="reviewedComponent"
                :route="reviewedComponent.route"
                :selected-card="selectedCard"
                :selected-card-ids="selectedCardIds"
                :single-card-review="isSingleCardReview"
                :merge-enabled="isMergeEnabled"
                :editable="isIdsEnabled"
                :additional-vars="additionalVars"
                @merge="mergeCards"
                @feedback-response="feedbackResponse"
                @reviewed-card-selected-ids="setSelectedReviewItemIds"
              />
            </v-col>
            <v-col v-if="reviewType === 'Ambiguous Title Matches'" cols="1">
              <v-container fill-height fluid>
                <v-row align="center" justify="space-around">
                  <v-icon> mdi-chevron-right </v-icon>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          :md="colGridWidth"
          :cols="colGridWidth"
          xl="3"
          class="pa-1"
          v-for="i, idx in referenceComponents"
          :key="i.id"
        >
          <v-row>
            <v-col>
              <h3 class="mb-1">
                <v-icon class="mr-1 mt-n1">
                  {{ i.route === '/title' ? 'mdi-text-box' : 'mdi-folder-file' }}
                </v-icon>
                {{ selectedCard === i.id ? $t('component.review.edit.components.merge.selected.label', [i.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label')]) : $t('component.review.edit.components.merge.unselected.label', [i.route === '/title' ? $tc('component.title.label') : $tc('component.tipp.label')]) }}
                <b>#{{ idx + 1 }}</b>
              </h3>
              <gokb-reviews-title-card
                :id="i.id"
                :ref="i.id.toString()"
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
                :editable="isIdsEnabled"
                :additional-vars="additionalVars"
                @loaded="toggleLoaded"
                @set-selected="setSelectedCard"
                @set-selected-ids="setSelectedCardIds"
                @merge="mergeCards"
                @link="linkTitle"
                @feedback-response="feedbackResponse"
              />
            </v-col>
          </v-row>
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
                <v-col>
                  <v-row dense justify="space-around">
                    {{ $t('component.review.edit.components.link.lookup.label') }}
                  </v-row>
                  <v-row dense justify="space-around">

                    <v-col cols="6">
                      <v-row>
                        <v-col>
                          <gokb-title-field
                            v-model="newTitle"
                            :label="$t('header.searchType.label' , [$tc('component.title.label')])"
                            width="50%"
                            return-object
                          />
                        </v-col>
                        <v-col cols="1" v-if="!!newTitle">
                          <v-icon
                            class="mt-4"
                            style="cursor:pointer"
                            :title="$t('btn.add')"
                            @click="confirmAddComponent"
                          >
                            mdi-check-bold
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row dense justify="space-around">
                    {{ $t('component.review.edit.components.link.or.label') }}
                  </v-row>
                  <v-row justify="space-around">
                    <gokb-button @click="showConfirmGenerateTitle">
                      {{ $t('component.review.edit.components.add.label') }}
                    </gokb-button>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="moreSteps" class="pt-3" align="center" justify="space-around">
        <gokb-button @click="nextStep"> {{ $t('btn.next') }}</gokb-button>
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
      },
      noToolBar: {
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
        submitConfirmationMessage: undefined,
        showSubmitConfirm: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        selectedIdItems: [],
        linkedComponents: {},
        activeComponents: undefined,
        newTitle: undefined,
        generatedTitle: undefined
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
      isStatusOpen () {
        return this.reviewStatus === 'Open'
      },
      isMergeEnabled () {
        return this.editable && this.isStatusOpen && this.workflow?.actions?.includes('merge') && this.activeComponents > 1
      },
      isTippReview () {
        return (this.reviewedComponent.route === '/package-title')
      },
      isTitleReview () {
        return (this.reviewedComponent.route === '/title')
      },
      isLinkEnabled () {
        return this.editable && this.isStatusOpen && this.workflow?.actions?.includes('link')
      },
      isIdsEnabled () {
        return this.editable && this.isStatusOpen && this.workflow?.actions?.includes('ids')
      },
      isAddEnabled () {
        return this.editable && this.isStatusOpen && this.workflow?.actions?.includes('add') && !this.generatedTitle
      },
      workflowTitle () {
        return this.editable ? this.workflow.title : ""
      }
    },
    created() {
      if (this.workflow.showReviewed) {
        this.linkedComponents[this.reviewedComponent.id.toString()] = {
          loaded: false,
          active: true,
          role: 'reviewedComponent',
          route: this.reviewedComponent.route
        }
      }
      this.referenceComponents.forEach(rc => {
        this.linkedComponents[rc.id.toString()] = {
          loaded: false,
          active: true,
          role: 'referenceComponent',
          route: rc.route
        }
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
        let mergedId = val
        let mergeParams = { mergeTipps: true }
        let targetId = this.selectedCard
        let mergeData = {
          id: mergedId,
          target: targetId
        }

        if (val === this.reviewedComponent.id) {
          mergeData.ids = this.selectedReviewItemIds
        } else {
          mergeParams.mergeIds = true
        }

        const mergeResponse = await this.catchError({
          promise: titleServices.merge(mergeData, mergeParams, this.cancelToken.token),
          instance: this
        })
        if (typeof mergeResponse == 'undefined') {
          this.feedbackResponse({ type: 'error', message: 'error.general.500' })
        }
        else {
          if (mergeResponse.status < 400) {
            this.linkedComponents[mergedId.toString()].active = false

            if (mergedId === this.reviewedComponent.id) {
              this.$emit('close', true)
            } else {
              this.refreshAll()
              this.feedbackResponse({ type: 'success', message: this.$i18n.t('success.merge', [this.$i18n.tc('component.title.label', 2)]) })
            }
          } else {
            this.feedbackResponse({ type: 'error', resp: mergeResponse })
          }
        }

      },
      refreshItem (id) {
        this.$refs[id.toString()].fetchTitle()
      },
      confirmAddComponent () {
        this.$emit('added', this.newTitle)
      },
      refreshAll () {
        if (this.workflow.showReviewed) {
          let refid = this.reviewedComponent.id.toString()

          if (!!this.$refs[refid]) {
            this.$refs[refid].fetchTitle()
          }
        }

        this.referenceComponents.forEach(rc => {
          let refid = rc.id.toString()

          if (!!this.$refs[refid]) {
            this.$refs[refid][0].fetchTitle()
          }
        })
      },
      showConfirmGenerateTitle () {
        this.showSubmitConfirm = true
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
            ids: tippInfo.data._embedded.ids.map(ido => ({ value: ido.value, type: ido.namespace.value })),
            _checked: true
          }

          const newTitleResponse = await this.catchError({
            promise: titleServices.createOrUpdate(titleData, this.cancelToken.token),
            instance: this
          })

          this.feedbackResponse(newTitleResponse)

          if (newTitleResponse.status === 200) {
            this.generatedTitle = {
              name: newTitleResponse.data.name,
              id: newTitleResponse.data.id,
              type: newTitleResponse.data.type,
              route: '/title'
            }

            this.$emit('added', newTitleResponse.data)
          }
        } else {
          this.feedbackResponse(tippInfo)
        }
      },
      async linkTitle (targetId) {
        const currentTippData = await this.catchError({
          promise: tippServices.get(this.reviewedComponent.id, this.cancelToken.token),
          instance: this
        })

        let linkData = {
          id: currentTippData.data.id,
          version: currentTippData.data.version,
          title: targetId,
          pkg: currentTippData.data.pkg.id,
          hostPlatform: currentTippData.data.hostPlatform.id,
          coverageStatements: currentTippData.data._embedded.coverageStatements
        }
        const updateResponse = await this.catchError({
          promise: tippServices.createOrUpdate(linkData, this.cancelToken.token),
          instance: this
        })
        if (typeof updateResponse == 'undefined') {
          this.feedbackResponse({ type: 'error', message: 'error.general.500' })
        }
        else {
          if (updateResponse.status === 200) {
            this.refreshAll()
            this.feedbackResponse({ type: 'success', message: this.$i18n.t('component.review.edit.components.link.success.label') })
          } else {
            this.feedbackResponse({ type: 'error', code: updateResponse.status, resp: updateResponse })
          }
        }
      },
      feedbackResponse (response) {
        this.$emit('feedback-response', response)
      },
      toggleLoaded (info) {
        if (!this.linkedComponents[info.id.toString()]) {
          this.linkedComponents[info.id.toString()] = {
            loaded: false,
            active: true,
            role: 'referenceComponent',
            route: rc.route
          }
        }

        if (!info.status) {
          this.linkedComponents[info.id.toString()].loaded = false
        } else {
          if (this.linkedComponents[info.id.toString()].loaded === false) {
            this.linkedComponents[info.id.toString()].loaded = info.loaded
          }

          if (info.status === 'Deleted') {
            this.linkedComponents[info.id.toString()].active = false
          }

          this.activeComponents = Object.values(this.linkedComponents).filter(lc => (lc.active === true)).length
        }
      },
      nextStep () {
        this.$emit('finished-step', true)
      }
    }
  }
</script>
