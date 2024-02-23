<template>
  <div>
    <v-snackbars :objects.sync="eventMessages">
      <template #action="{ close }">
        <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbars>
    <gokb-page
      v-if="accessible && !notFound"
      :key="version"
      :title="localTitle"
    >
      <gokb-confirmation-popup
        v-model="showSubmitConfirm"
        :message="submitConfirmationMessage"
        @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
      />
      <gokb-section no-tool-bar>
        <gokb-reviews-header
          v-if="reviewItem?.component"
          :value="error"
          :component="reviewItem.component"
          :editable="!isReadonly"
          :review-component="reviewItem"
          :has-component-cards="showComponentCards"
          :additional-vars="reviewItem.additionalVars"
        />
      </gokb-section>

      <gokb-reviews-components-section
        v-if="finishedLoading && showComponentCards"
        v-for="(wf, i) in workflow"
        :ref="'wf' + i"
        :key="i"
        :value="error"
        :reviewed-component="reviewItem.component"
        :reference-components="reviewItem.otherComponents"
        :review-type="reviewItem.stdDesc?.name"
        :review-status="reviewItem.status.value"
        :more-steps="i+1 < workflow.length"
        :workflow="wf"
        :editable="!isReadonly"
        :additional-vars="reviewItem.additionalVars"
        :expanded="activeStep === i"
        no-tool-bar
        @expand="activateStep(i)"
        @finished-step="changeActiveStep"
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
    </gokb-page>
    <gokb-no-access-field v-else-if="!accessible" />
    <gokb-page
      v-else
      title=""
    >
      <v-card>
        <v-card-text>
          <div class="text-h5 primary--text">
            {{ $t('component.general.notFound', [$tc('component.review.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import 'vue-json-pretty/lib/styles.css'
  import GokbReviewsHeader from '@/shared/components/complex/gokb-reviews-header/gokb-reviews-header.vue'
  import VSnackbars from 'v-snackbars'

  export default {
    name: 'EditReviewView',
    components: {
      GokbReviewsHeader,
      GokbConfirmationPopup,
      VSnackbars
    },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        eventMessages: [],
        submitConfirmationMessage: undefined,
        parameterToConfirm: undefined,
        showSubmitConfirm: false,
        escalatable: false,
        updateUrl: undefined,
        accessible: true,
        deleteUrl: undefined,
        notFound: false,
        deescalatable: false,
        deletedItems: [],
        workflow: [],
        activeStep: 0,
        version: undefined,
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
      cmpType () {
        return this.reviewItem?.component?.type || undefined
      },
      cmpLabel () {
        return (!!this.reviewItem?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewItem.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
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
      closeReviewButtonDisabledText () {
        return this.showComponentCards && this.activeStep != this.workflow.length-1 ? this.$i18n.t('component.review.edit.close.error.moreSteps') : undefined
      }
    },
    created () {
      this.fetchReview()
      this.isEscalatable()
      this.isDeescalatable()
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async fetchReview () {
        const response = await this.catchError({
          promise: reviewServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.mapRecord(response.data)
        } else if (response?.status === 404) {
            this.notFound = true
        } else {
          this.eventMessages.push({
            message: this.$i18n.t('error.general.500'),
            color: 'error',
            timeout: -1
          })
          this.accessible = false
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
          id: (oc.id || parseInt(oc.oid.split(':')[1])),
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
            title: "",
            toDo: (!!this.reviewItem.stdDesc && this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.toDo').length > 0) ? this.$i18n.t('component.review.stdDesc.' + this.reviewItem.stdDesc.name + '.toDo') :  this.$i18n.t('component.review.edit.components.workflow.titleReview.toDo'),
            showReviewed: true,
            components: merge_ids,
            actions: (merge_ids.length > 1 ? ['merge','ids'] : ['ids'])
          })
        }
      },
      async closeReview () {
        const resp = await reviewServices.close(this.id, this.cancelToken.token)

        if (resp.status === 200) {
          this.eventMessages.push({
            message: this.$i18n.t('component.review.edit.success.closed'),
            color: 'success',
            timeout: 4000
          })
          this.mapRecord(resp.data)
        } else {
          this.eventMessages.push({
            message: this.$i18n.t('error.update.400', [this.$i18n.tc('component.review.label')]),
            color: 'error',
            timeout: -1
          })
        }
      },
      async reopenReview () {
        let body = {
          id: this.id,
          status: 'Open'
        }

        const resp = await reviewServices.createOrUpdate(body, this.cancelToken.token)

        if (resp.status === 200) {
          this.eventMessages.push({
            message: this.$i18n.t('component.review.edit.success.reopened'),
            color: 'success',
            timeout: 4000
          })
          this.mapRecord(resp.data)
        } else {
          this.eventMessages.push({
            message: this.$i18n.t('error.update.400', [this.$i18n.tc('component.review.label')]),
            color: 'error',
            timeout: -1
          })
        }
      },
      async addNewComponent (info) {
        if (!this.additionalInfo.otherComponents) {
          this.additionalInfo.otherComponents = []
        }

        if (info.id !== this.reviewItem.component.review && !this.additionalInfo.otherComponents.some(oc => (oc.id === info.id))) {
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

          if (resp.status < 400) {
            this.showResponse({ type: 'success', message: this.$i18n.t('success.add', [this.$i18n.tc('component.title.label'), info.name]) })
          } else {
            this.showResponse({ type: 'error', resp: resp })
          }
          await this.fetchReview()
          this.$refs["wf" + this.activeStep][0].refreshAll()
        } else {
          this.showResponse({ type: 'error', message: this.$i18n.t('component.review.otherComponents.error.duplicate') })
        }
      },
      activateStep (index) {
        if (this.activeStep !== index) {
          this.activeStep = index

          let wfname = "wf" + this.activeStep
          if (!!this.$refs[wfname]) {
            this.$refs[wfname][0].refreshAll()
          }
        } else {
          this.activeStep = undefined
        }
      },
      changeActiveStep (index) {
        if (this.workflow.length > this.activeStep) {
          this.activeStep++
          refreshCurrentComponents()
        }
      },
      refreshCurrentComponents () {
        let wfname = "wf" + this.activeStep

        if (!!this.$refs[wfname]) {
          this.$refs[wfname][0].refreshAll()
        }
      },
      showResponse (response) {
        if (typeof response === 'string' || response instanceof String) {
          this.eventMessages.push({
            message: response,
            color: 'error',
            timeout: -1
          })
        }
        else {
          if (response?.message) {
            if (response.type == 'success') {
              this.eventMessages.push({
                message: this.$i18n.t('success.update', [this.$i18n.tc('component.review.label'), ""]),
                color: 'success',
                timeout: 4000
              })
            } else {
              this.eventMessages.push({
                message: this.$i18n.t('error.update.400', [this.$i18n.tc('component.review.label')]),
                color: 'error',
                timeout: -1
              })
            }
          }
          else {
            this.successMsg = undefined
            this.errors = response?.resp.data?.error

            if (response.resp.status === 403) {
              this.eventMessages.push({
                message: this.$i18n.t('error.update.403', [this.$i18n.tc('component.review.label')]),
                color: 'error',
                timeout: -1
              })
            }
            else if (response.resp.status === 409) {
              this.eventMessages.push({
                message: this.$i18n.t('error.update.409', [this.$i18n.tc('component.review.label')]),
                color: 'error',
                timeout: -1
              })
            }
            else if (response.resp.status === 500) {
              this.eventMessages.push({
                message: this.$i18n.t('error.update.500', [this.$i18n.tc('component.review.label')]),
                color: 'error',
                timeout: -1
              })
            }
            else {
              this.eventMessages.push({
                message: this.$i18n.t('error.update.400', [this.$i18n.tc('component.review.label')]),
                color: 'error',
                timeout: -1
              })
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
      }
    }
  }
</script>