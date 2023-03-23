<template>
  <gokb-dialog
    v-model="localValue"
    :title="localTitle"
    width="max-width"
    fullscreen
  >
    <gokb-error-component :value="error" />
    <v-snackbar v-model="showSuccessMsg" color="success" :timeout="2000"> {{ localSuccessMessage }} </v-snackbar>
    <v-snackbar v-model="showErrorMsg" color="error" :timeout="2000"> {{ localErrorMessage }} </v-snackbar>

    <gokb-confirmation-popup
      v-model="showSubmitConfirm"
      :message="submitConfirmationMessage"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />

    <gokb-reviews-header
      v-if="reviewItem?.component"
      :value="error"
      :component="reviewItem.component"
      :editable="!isReadonly"
      :review-component="reviewItem"
      :has-component-cards="showComponentCards"
      :additional-vars="reviewItem.additionalVars"
    />

    <gokb-reviews-components-section
      v-if="finishedLoading && showComponentCards"
      v-for="(wf, i) in workflow"
      :ref="'wf' + i"
      :key="i"
      :value="error"
      :reviewed-component="reviewItem.component"
      :candidates="reviewItem.candidates"
      :reference-components="reviewItem.otherComponents"
      :review-type="reviewItem.stdDesc?.name"
      :review-status="reviewItem.status.value"
      :more-steps="i+1 < workflow.length"
      :workflow="wf"
      :editable="!isReadonly"
      :additional-vars="reviewItem.additionalVars"
      :expanded="activeStep === i"
      @expand="activateStep(i)"
      @finished-step="changeActiveStep"
      @merge="processMerge"
      @added="addNewComponent"
      @close="closeReview"
      @feedback-response="showResponse"
    />

    <template #buttons>
      <gokb-button
        v-if="escalatable"
        @click="escalate"
      >
        {{ $t('btn.escalate') }} {{ !!escalationTarget ? '(-> ' + escalationTarget.name + ')' : '' }}
      </gokb-button>
      <gokb-button
        v-if="deescalatable"
        @click="deescalate"
      >
        {{ $t('btn.deescalate') }} {{ !!escalationTarget ? '(-> ' + escalationTarget.name + ')' : '' }}
      </gokb-button>
      <v-spacer />
      <gokb-button
        @click="closePopup"
      >
        {{ (isReadonly || reviewItem.isClosed) ? $t('btn.close') : $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly && !reviewItem.isClosed && showComponentCards && activeStep != workflow.length-1"
        @click="activeStep++"
      >
        {{ $t('component.review.edit.next.label') }}
      </gokb-button>
      <gokb-button
        v-else-if="!isReadonly && !reviewItem.isClosed"
        class="ml-2"
        color="primary"
        @click="showConfirmCloseReview"
      >
        {{ $t('component.review.edit.close.label')}}
      </gokb-button>
      <gokb-button
        v-else-if="!isReadonly && reviewItem.isClosed"
        @click="showConfirmReopenReview"
      >
        {{ $t('component.review.edit.open.label')}}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import 'vue-json-pretty/lib/styles.css'
  import GokbReviewsHeader from '@/shared/components/complex/gokb-reviews-header/gokb-reviews-header.vue'

  export default {
    name: 'GokbReviewPopup',
    components: {
      GokbReviewsHeader,
      GokbConfirmationPopup
    },
    extends: BaseComponent,
    props: {
      selected: {
        type: Object,
        required: false,
        default: undefined
      },
      component: {
        type: Object,
        required: false,
        default: undefined
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        successMsg: undefined,
        showSuccessMsg: false,
        showErrorMsg: false,
        errorMsg: undefined,
        submitConfirmationMessage: undefined,
        parameterToConfirm: undefined,
        showSubmitConfirm: false,
        escalatable: false,
        updateUrl: undefined,
        deleteUrl: undefined,
        deescalatable: false,
        deletedItems: [],
        workflow: [],
        activeStep: 0,
        reviewItem: {
          status: undefined,
          stdDesc: undefined,
          request: undefined,
          allocatedGroups: [],
          description: undefined,
          dateCreated: undefined,
          component: undefined,
          otherComponents: [],
          isClosed: false,
          additionalVars: undefined
        },
        finishedLoading: false,
        componentRoutes: {
          package: '/package',
          org: '/provider',
          organization: '/provider',
          tipp: '/package-title',
          titleinstancepackageplatform: '/package-title',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title',
          titleinstance: '/title',
          journalinstance: '/title',
          bookinstance: '/title',
          databaseinstance: '/title',
          otherinstance: '/title'
        }
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value || true
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
      cmpType () {
        return this.reviewItem?.component?.type || undefined
      },
      cmpLabel () {
        return (this.isEdit && !!this.reviewItem?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewItem.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      },
      isReadonly () {
        return !this.updateUrl
      },
      showComponentCards () {
        return this.reviewItem.component.route === '/title' || this.reviewItem.component.route === '/package-title'
      },
      isValid () {
        return !!this.reviewItem.component && ((!!this.reviewItem.request && !!this.reviewItem.description) || !!this.reviewItem.stdDesc)
      },
      localTitle () {
        return this.$i18n.tc('component.review.label') + (!!this.reviewItem?.stdDesc ? (' – ' + this.$i18n.t('component.review.stdDesc.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.label')) : '')
      },
      localErrorMessage () {
        return !!this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.review.label')]) : undefined
      },
      localSuccessMessage () {
        return !!this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.review.label')]) : undefined
      },
      closeReviewButtonDisabledText () {
        return this.showComponentCards && this.activeStep != this.workflow.length-1 ? this.$i18n.t('component.review.edit.close.error.moreSteps') : undefined
      }
    },
    created () {
      this.selectedItem = this.selected
      if (this.selected) {
        this.finishedLoading = false
        this.id = this.selected.id
        this.fetchReview(this.id)
      }
      else if (this.component) {
        this.reviewItem.component = {
          name: this.component.name,
          id: this.component.id,
          type: this.component.type.toLowerCase(),
          route: this.componentRoutes[this.component.type.toLowerCase()]
        }
        this.finishedLoading = true
      }
      if (this.selectedItem) {
        this.isEscalatable()
        this.isDeescalatable()
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async fetchReview (rid) {
        const response = await this.catchError({
          promise: reviewServices.get(rid, this.cancelToken.token),
          instance: this
        })

        if (response.status === 200) {
          this.mapRecord(response.data)
        } else {
          this.errorMsg = 'error.general.500'
          this.showErrorMsg = true
        }
        this.finishedLoading = true
      },
      showConfirmCloseReview () {
        this.showSubmitConfirm = true
        this.actionToConfirm = "closeReview"
        this.parameterToConfirm = undefined
        this.submitConfirmationMessage = { text: 'component.review.edit.confirm.close', vars: [] }
      },
      showConfirmReopenReview () {
        this.showSubmitConfirm = true
        this.actionToConfirm = "reopenReview"
        this.parameterToConfirm = undefined
        this.submitConfirmationMessage = { text: 'component.review.edit.confirm.reopen', vars: [] }
      },
      mapRecord (record) {
        this.additionalInfo = record.additionalInfo
        this.reviewItem.status = record.status
        this.reviewItem.stdDesc = record.stdDesc
        this.reviewItem.request = record.reviewRequest
        this.reviewItem.description = record.descriptionOfCause
        this.reviewItem.dateCreated = record.dateCreated ? new Date(record.dateCreated).toLocaleString('sv') : ''
        this.reviewItem.component = {
          ...record.componentToReview,
          route: this.componentRoutes[record.componentToReview.type.toLowerCase()]
        }
        this.reviewItem.isClosed = record.status.name === 'Closed'
        this.reviewItem.allocatedGroups = record.allocatedGroups
        this.reviewItem.additionalVars = record.additionalInfo?.vars
        this.reviewItem.otherComponents = record.additionalInfo?.otherComponents ? record.additionalInfo.otherComponents.map(oc => ({
          name: oc.name,
          id: (!!oc.oid ? parseInt(oc.oid.split(':')[1]) : oc.id),
          type: (oc.type ? oc.type.toLowerCase() : oc.oid.split(':')[0].split('.')[3].toLowerCase()),
          route: this.componentRoutes[(oc.type ? oc.type.toLowerCase() : oc.oid.split(':')[0].split('.')[3].toLowerCase())],
        })) : []
        this.reviewItem.candidates = record.additionalInfo?.candidates
        this.updateUrl = record._links?.update?.href || undefined
        this.deleteUrl = record._links?.delete?.href || undefined
        this.version = record.version

        let merge_ids = this.reviewItem.otherComponents.filter(c => (c.route === '/title')).map(c => (c.id))

        if (this.reviewItem.component.route === '/title') {
          merge_ids.push(this.reviewItem.component.id)
        }

        this.workflow = []

        if (this.isReadonly) {
          this.workflow.push({
            title: "",
            toDo: (!!this.reviewItem.stdDesc && this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.toDo').length > 0) ? this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.toDo') :  this.$i18n.t('component.review.edit.components.workflow.titleReview.toDo'),
            showReviewed: true,
            components: merge_ids,
            actions: []
          })
        } else if (this.reviewItem.component.route === '/package-title' && merge_ids.length > 1) {
          this.workflow.push({
            title: this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.workflow.step1.label'),
            toDo: this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.workflow.step1.toDo'),
            showReviewed: false,
            components: merge_ids,
            actions: ['merge', 'ids']
          })
          this.workflow.push({
            title: this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.workflow.step2.label'),
            toDo: this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.workflow.step2.toDo'),
            showReviewed: true,
            components: merge_ids,
            actions: ['link', 'add']
          })
        } else {
          this.workflow.push({
            title: this.$i18n.t('component.review.edit.components.workflow.titleReview.label'),
            toDo: (!!this.reviewItem.stdDesc && this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.toDo').length > 0) ? this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.toDo') :  this.$i18n.t('component.review.edit.components.workflow.titleReview.toDo'),
            showReviewed: true,
            components: merge_ids,
            actions: ['merge','ids']
          })
        }
      },
      processMerge (id) {
        if (this.workflow.length === 2) {
          this.$refs.wf1.refreshItem(id)
        }
      },
      async closeReview () {
        const resp = await reviewServices.close(this.id, this.cancelToken.token)

        if (resp.status === 200) {
          this.$emit('edit', 'closed')
          this.closePopup()
        } else {
          this.errorMsg = 'error.update.400'
        }
      },
      async reopenReview () {
        let body = {
          id: this.id,
          status: 'Open'
        }

        const resp = await reviewServices.createOrUpdate(body, this.cancelToken.token)

        if (resp.status === 200) {
          this.$emit('edit', 'reopened')
          this.mapRecord(resp.data)
        } else {
          this.errorMsg = 'error.update.400'
        }
      },
      async addNewComponent (info) {
        if (!this.additionalInfo.otherComponents) {
          this.additionalInfo.otherComponents = []
        }

        this.additionalInfo.otherComponents.push({
          name: info.name,
          id: info.id,
          oid: 'org.gokb.cred.' + info.componentType + ':' + info.id,
          type: info.componentType,
          uuid: info.uuid
        })

        let body = {
          id: this.id,
          additionalInfo: this.additionalInfo
        }

        const resp = await reviewServices.createOrUpdate(body, this.cancelToken.token)

        this.showResponse(resp)
        this.fetchReview(this.id)
      },
      closePopup () {
        this.localValue = false
      },
      activateStep (index) {
        if (this.activeStep !== index) {
          this.activeStep = index
        } else {
          this.activeStep = undefined
        }
      },
      changeActiveStep (index) {
        if (this.workflow.length > this.activeStep) {
          this.activeStep++
        }
      },
      showResponse (response) {
        if (typeof response === 'string' || response instanceof String) {
          this.errorMsg = response
        }
        else {
          if (response?.status < 400) {
            this.errorMsg = undefined
            this.showSuccessMsg = true
            this.successMsg = 'component.review.edit.success.edited'
          }
          else {
            this.localSuccessMessage = undefined
            this.errors = response?.data?.error

            if (response.status === 403) {
              this.errorMsg = 'error.update.403'
              this.showErrorMsg = true
            }
            else if (response.status === 409) {
              this.errorMsg = 'error.update.409'
              this.showErrorMsg = true
            }
            else if (response.status === 500) {
              this.errorMsg = 'error.general.500'
              this.showErrorMsg = true
            }
            else {
              this.errorMsg = 'error.update.400'
              this.showErrorMsg = true
            }
          }
        }
      },
      async isEscalatable () {
        await this.catchError({
          promise: reviewServices.escalatable(this.id, accountModel.activeGroup().id),
          instance: this
        })
          .then(response => {
            this.escalatable = response.data.isEscalatable
            this.escalationTarget = response.data.escalationTargetGroup
          })
      },
      async isDeescalatable () {
        await this.catchError({
          promise: reviewServices.deescalatable(this.id, accountModel.activeGroup().id),
          instance: this
        })
          .then(response => {
            this.deescalatable = response.data.isDeescalatable
            this.escalationTarget = response.data.escalationTargetGroup
          })
      },
      save () {
        this.$emit('edit', 'edited')
      }
    }
  }
</script>
