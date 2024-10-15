<template>
  <gokb-dialog
    v-model="localValue"
    :title="localTitle"
    :width="1000"
    @submit="save"
  >
    <gokb-error-component :value="error" />
    <span v-if="!!successMsg">
      <v-alert
        type="success"
        dismissible
      >
        {{ localSuccessMessage }}
      </v-alert>
    </span>
    <span v-if="!!errorMsg">
      <v-alert
        type="error"
        dismissible
      >
        {{ localErrorMessage }}
      </v-alert>
    </span>
    <v-row dense>
      <v-col md="12">
        <gokb-entity-field
          v-model="reviewItem.component"
          readonly
          :init-item="component"
          :type-filter="cmpType"
          :show-link="true"
          :label="cmpLabel"
          return-object
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <gokb-text-field
          v-model="reviewItem.description"
          required
          :disabled="isEdit"
          :label="$t('component.review.cause.label')"
        />
        <div
          v-if="additionalInfo && additionalInfo.candidates"
          class="pt-3"
        >
          <label
            class="v-label"
            style="display:block;font-size:0.9em;"
            for="otherComponents"
          >
            {{ $t('component.review.candidates.label') }}
          </label>
          <v-row dense>
            <v-col
              v-for="(c, idx) in additionalInfo.candidates"
              :key="idx"
            >
              {{ c.title }} ({{ c.id }})
            </v-col>
          </v-row>
        </div>
        <div class="pt-3">
          <label
            class="v-label"
            style="display:block;font-size:0.9em;"
            for="otherComponents"
          >
            {{ $tc('component.review.otherComponents.label') }}
          </label>
          <v-row
            v-for="(oc, idx) in reviewItem.otherComponents"
            :key="idx"
            dense
          >
            <v-col>
              <router-link
                v-if="oc.route"
                :style="{ color: 'primary', fontSize: '1.2em', marginRight: '4px' }"
                :to="{ name: oc.route, params: { 'id': oc.id } }"
              >
                {{ oc.name }}
              </router-link>
              <span v-else>
                {{ oc.name }} ({{ oc.type }})
              </span>
              <v-icon
                class="mr-3"
                :disabled="isReadonly"
                style="cursor:pointer"
                :title="$t('btn.delete')"
                small
                @click="removeOtherComponent(oc.id)"
              >
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="7">
              <gokb-entity-field
                v-model="newAdditionalComponent"
                :readonly="!!isReadonly"
                :show-link="true"
                :label="$t('component.review.otherComponents.add')"
                return-object
                @update:modelValue="addNewOtherComponent"
              />
              <div
                v-if="ocError"
                class="mb-3 error--text"
              >
                {{ $t('component.review.otherComponents.error.duplicate') }}
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <gokb-textarea-field
          v-model="reviewItem.request"
          required
          :disabled="isEdit"
          :label="$t('component.review.request.label')"
        />
      </v-col>
    </v-row>

    <template #buttons>
      <gokb-button
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly"
        :disabled="!isValid"
        is-submit
      >
        {{ $t('btn.create') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'GokbAddReviewPopup',
    components: { VueJsonPretty },
    extends: BaseComponent,
    emits: ['update:model-value', 'edit'],
    props: {
      modelValue: {
        type: [Boolean, Number],
        required: true
      },
      selected: {
        type: Object,
        required: false,
        default: undefined
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      component: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        config: [],
        id: undefined,
        selectedItem: undefined,
        ocError: false,
        additionalInfo: undefined,
        newAdditionalComponent: undefined,
        updateUrl: undefined,
        successMsg: undefined,
        errorMsg: undefined,
        deleteUrl: undefined,
        escalatable: false,
        deescalatable: false,
        escalationTarget: undefined,
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
        items: [],
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
          return this.modelValue || true
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
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
      stdDesc () {
        return this.selectedItem?.stdDesc || undefined
      },
      numMessageVars () {
        return this.additionalInfo?.vars ? this.additionalInfo.vars.length : 0
      },
      cmpType () {
        return this.reviewItem?.component?.type || undefined
      },
      cmpLabel () {
        return (this.isEdit && this.reviewItem?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewItem.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.review.label')]) : undefined
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.review.label')]) : undefined
      },
      localAction () {
        return this.reviewItem?.stdDesc ? this.$i18n.t('component.review.stdDesc.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.action') : undefined
      },
      localTitle () {
        return this.$i18n.tc('component.review.label') + (this.reviewItem?.stdDesc ? (' – ' + this.$i18n.t('component.review.stdDesc.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.label')) : '')
      }
    },
    created () {
      if (this.component) {
        this.reviewItem.component = this.component
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async save () {
        const activeGroup = accountModel.activeGroup()

        const newReview = {
          status: this.reviewItem.status?.id || null,
          stdDesc: "Manual Request",
          reviewRequest: this.reviewItem.request,
          descriptionOfCause: this.reviewItem.description,
          activeGroup,
          componentToReview: this.reviewItem.component.id,
          additionalInfo: { otherComponents: this.reviewItem.otherComponents }
        }

        const response = await this.catchError({
          promise: reviewServices.createOrUpdate(newReview, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.$emit('edit', 'edited')
          this.close()
        } else if (response?.status === 201) {
          this.$emit('edit', 'created')
          this.close()
        } else {
          if (response.status === 409) {
            this.errorMsg = 'error.update.409'
          } else if (response.status === 500) {
            this.errorMsg = 'error.general.500'
          } else {
            this.errors = response.data.error
          }
        }
      },
      addNewOtherComponent (cmp) {
        if (cmp?.id) {
          if (!this.reviewItem.otherComponents.find(oc => oc.id === cmp.id)) {
            const newComp = { name: cmp.name, id: cmp.id, route: this.componentRoutes[cmp.type.toLowerCase()], type: cmp.type }
            this.reviewItem.otherComponents.push(newComp)
            this.ocError = false
          } else {
            this.ocError = true
          }
          this.newAdditionalComponent = undefined
        }
      },
      removeOtherComponent (cmpId) {
        this.reviewItem.otherComponents = this.reviewItem.otherComponents.filter(({ id }) => id !== cmpId)
      }
    }
  }
</script>

<style scoped>
  .vjs-tree__node.is-highlight, .vjs-tree__node:hover {
    background-color:#9b9b9b
  }
  .vjs-value__string {
    color: #3c804b
  }

  a {
    color: rgba(var(--v-theme-primary))
  }
</style>
