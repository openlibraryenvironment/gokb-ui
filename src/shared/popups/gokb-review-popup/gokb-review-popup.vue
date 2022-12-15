<template>
  <gokb-dialog
    v-model="localValue"
    :title="localTitle"
    width="max-width"
  >
    <gokb-error-component :value="error" />
    <v-snackbar v-model="showSuccessMsg" color="success" :timeout="2000"> {{ localSuccessMessage }} </v-snackbar>
    <v-snackbar v-model="showErrorMsg" color="error" :timeout="2000"> {{ localErrorMessage }} </v-snackbar>

    <gokb-reviews-header
      v-if="reviewItem?.component"
      :value="error"
      :component="reviewItem.component"
      :editable="!isReadonly"
      :review-component="reviewItem"
      :additional-vars="reviewItem.additionalVars"
    />

    <gokb-reviews-components-section
      v-if="finishedLoading"
      :value="error"
      :reviewed-component="reviewItem.component"
      :reference-components="reviewItem.otherComponents"
      :review-type="reviewItem.stdDesc?.name"
      :editable="!isReadonly"
      :additional-vars="reviewItem.additionalVars"
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
        {{ isReadonly ? $t('btn.close') : $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly && !reviewItem.isClosed"
        color="primary"
        @click="closeReview"
      >
        {{ $t('component.review.edit.close.label')}}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'
  import 'vue-json-pretty/lib/styles.css'
  import GokbReviewsHeader from '@/shared/components/complex/gokb-reviews-header/gokb-reviews-header.vue'

  export default {
    name: 'GokbReviewPopup',
    components: { GokbReviewsHeader },
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
        escalatable: false,
        updateUrl: undefined,
        deleteUrl: undefined,
        deescalatable: false,
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
        return (this.isEdit && this.reviewItem?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewItem.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      },
      isReadonly () {
        return !this.updateUrl
      },
      isValid () {
        return !!this.reviewItem.component && ((!!this.reviewItem.request && !!this.reviewItem.description) || !!this.reviewItem.stdDesc)
      },
      localTitle () {
        return this.$i18n.tc('component.review.label') + (this.reviewItem?.stdDesc ? (' – ' + this.$i18n.t('component.review.stdDesc.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.label')) : '')
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.review.label')]) : undefined
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.review.label')]) : undefined
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
      async fetchReview (rid) {
        const response = await this.catchError({
          promise: reviewServices.get(rid, this.cancelToken.token),
          instance: this
        })

        if (response.status === 200) {
          this.mapRecord(response.data)
        } else {

        }
        this.finishedLoading = true
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
          id: (oc.oid ? oc.oid.split(':')[1] : oc.id),
          type: (oc.type ? oc.type.toLowerCase() : oc.oid.split(':')[0].split('.')[3].toLowerCase()),
          route: this.componentRoutes[(oc.type ? oc.type.toLowerCase() : oc.oid.split(':')[0].split('.')[3].toLowerCase())]
        })) : []
        this.updateUrl = record._links?.update?.href || undefined
        this.deleteUrl = record._links?.delete?.href || undefined
        this.version = record.version
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
      closePopup () {
        this.localValue = false
      },
      showResponse (response) {
        if (typeof response === 'string' || response instanceof String) {
          this.errorMsg = response
        }
        else {
          if (response.status < 400) {
            this.errorMsg = undefined
            this.showSuccessMsg = true
            this.successMsg = 'component.review.edit.success.edited'
          }
          else {
            this.localSuccessMessage = undefined
            this.errors = response.data.error
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
