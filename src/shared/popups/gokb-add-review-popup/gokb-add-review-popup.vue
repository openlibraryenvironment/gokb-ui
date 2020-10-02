<template>
  <gokb-dialog
    v-model="localValue"
    title="Review-Details"
    width="50%"
    @submit="save"
  >
    <gokb-error-component :value="error" />
    <v-row>
      <v-col md="12">
        <gokb-entity-field
          v-model="reviewItem.component"
          :readonly="isEdit || isReadonly"
          :label="$i18n.t('component.review.componentToReview')"
          return-object
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <gokb-text-field
          v-model="reviewItem.dateCreated"
          disabled
          :label="$i18n.t('component.general.dateCreated')"
        />
      </v-col>
      <v-col md="4">
        <gokb-state-field
          v-model="reviewItem.stdDesc"
          :init-item="selectedItem.stdDesc"
          :readonly="isReadonly"
          return-object
          url="refdata/categories/ReviewRequest.StdDesc"
          message-path="component.review.stdDesc"
          :label="$i18n.t('component.review.type')"
        />
      </v-col>
      <v-col md="4">
        <gokb-state-field
          v-model="reviewItem.status"
          :init-item="reviewItem.status"
          :clearable="false"
          :readonly="isReadonly"
          return-object
          message-path="component.review.status"
          url="refdata/categories/ReviewRequest.Status"
          :label="$t('component.general.status')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <gokb-text-field
          v-model="reviewItem.request"
          :disabled="isEdit"
          :label="$i18n.t('component.review.cause')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <gokb-textarea-field
          v-model="reviewItem.description"
          :disabled="isEdit"
          :label="$i18n.t('component.review.request')"
        />
      </v-col>
    </v-row>

    <template #buttons>
      <v-spacer />
      <gokb-button
        @click="close"
      >
        {{ $t('btn.close') }}
      </gokb-button>
      <gokb-button
        :disabled="isReadonly"
        default
      >
        {{ $t('btn.submit') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'

  export default {
    name: 'GokbAddReviewPopup',
    extends: BaseComponent,
    props: {
      selected: {
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
        config: [],
        id: undefined,
        descName: undefined,
        selectedItem: undefined,
        updateUrl: undefined,
        reviewItem: {
          status: undefined,
          stdDesc: undefined,
          request: undefined,
          description: undefined,
          dateCreated: undefined,
          component: undefined
        },
        items: []
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
      isReadonly () {
        return !accountModel.loggedIn() || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isEdit () {
        return !!this.id
      }
    },
    async created () {
      this.selectedItem = this.selected

      if (this.selected) {
        this.id = this.selected.id
        this.reviewItem.status = this.selectedItem.status
        this.reviewItem.stdDesc = this.selectedItem.stdDesc
        this.reviewItem.request = this.selectedItem.request
        this.reviewItem.description = this.selectedItem.description
        this.reviewItem.dateCreated = this.selectedItem.dateCreated
        this.reviewItem.component = this.selectedItem.component
        this.updateUrl = this.selectedItem.updateUrl

        this.descName = this.selectedItem.stdDesc?.name
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async save () {
        const newReview = {
          id: this.id,
          status: this.reviewItem.status.id,
          stdDesc: this.reviewItem.stdDesc?.id || null,
          reviewRequest: this.reviewItem.request,
          descriptionOfCause: this.reviewItem.description,
          componentToReview: this.reviewItem.component.id
        }

        const response = await this.catchError({
          promise: reviewServices.createOrUpdateReview(newReview, this.cancelToken.token),
          instance: this
        })

        if (response.status === 200) {
          this.$emit('edit', this.selectedItem)
          this.close()
        } else {
          console.log(newReview.status)
        }
      }
    }
  }
</script>
