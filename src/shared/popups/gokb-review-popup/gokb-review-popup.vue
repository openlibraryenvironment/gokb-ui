<template>
  <gokb-dialog
    v-model="localValue"
    :title="localTitle"
    :width="1000"
    @submit="save"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert
        type="success"
        dismissible
      >
        {{ localSuccessMessage }}
      </v-alert>
    </span>
    <span v-if="errorMsg">
      <v-alert
        type="error"
        dismissible
      >
        {{ localErrorMessage }}
      </v-alert>
    </span>

    <gokb-reviews-header
      :value="error"
      :reviewComponent="reviewItem"
      :component="reviewItem.component"
    />

    <gokb-reviews-titles-section v-if="finishedLoading"
      :value="error"
      :reviewedComponent="reviewItem.component"
      :referenceComponents="reviewItem.otherComponents"
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
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly"
        :disabled="!isValid"
        default
      >
        {{ isEdit ? $t('btn.update') : $t('btn.create') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'
  import 'vue-json-pretty/lib/styles.css'
  import GokbReviewsHeader from '../../components/complex/gokb-reviews-header/gokb-reviews-header.vue'

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
        errorMsg: undefined,
        escalatable: false,
        deescalatable: false,
        reviewItem: {
          status: undefined,
          stdDesc: undefined,
          request: undefined,
          allocatedGroups: [],
          description: undefined,
          dateCreated: undefined,
          component: undefined,
          otherComponents: []
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
        return !accountModel.loggedIn() || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isEdit () {
        return !!this.id
      },
      isValid () {
        return !!this.reviewItem.component && ((!!this.reviewItem.request && !!this.reviewItem.description) || !!this.reviewItem.stdDesc)
      },
      localTitle () {
        return this.$i18n.tc('component.review.label') + (this.reviewItem?.stdDesc ? (' – ' + this.$i18n.t('component.review.stdDesc.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.label')) : '')
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
        this.reviewItem.component = this.component
        this.finishedLoading = true
      }
      if (this.selectedItem) {
        this.isEscalatable()
        this.isDeescalatable()
      }
    },
    methods: {
      async fetchReview (rid) {
        const {
          data: {
            status,
            stdDesc,
            reviewRequest,
            descriptionOfCause,
            dateCreated,
            version,
            componentToReview,
            allocatedGroups,
            additionalInfo,
            _links
          }
        } = await this.catchError({
          promise: reviewServices.getReview(rid, this.cancelToken.token),
          instance: this
        })
        this.additionalInfo = additionalInfo
        this.reviewItem.status = status
        this.reviewItem.stdDesc = stdDesc
        this.reviewItem.request = reviewRequest
        this.reviewItem.description = descriptionOfCause
        this.reviewItem.dateCreated = dateCreated ? new Date(dateCreated).toLocaleString('sv') : ''
        this.reviewItem.component = componentToReview
        this.reviewItem.allocatedGroups = allocatedGroups
        this.reviewItem.otherComponents = additionalInfo?.otherComponents ? additionalInfo.otherComponents.map(oc => ({
          name: oc.name,
          id: (oc.oid ? oc.oid.split(':')[1] : oc.id),
          type: (oc.type ? oc.type.toLowerCase() : oc.oid.split(':')[0].split('.')[3].toLowerCase()),
          route: this.componentRoutes[(oc.type ? oc.type.toLowerCase() : oc.oid.split(':')[0].split('.')[3].toLowerCase())]
        })) : []
        this.updateUrl = _links?.update?.href || undefined
        this.deleteUrl = _links?.delete?.href || undefined
        this.version = version
        this.finishedLoading = true
      },
      close () {
        this.localValue = false
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
      save () {}
    }
  }
</script>
