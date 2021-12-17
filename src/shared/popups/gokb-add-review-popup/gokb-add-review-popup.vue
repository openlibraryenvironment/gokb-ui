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
    <v-row
      v-if="isEdit"
      align="center"
    >
      <v-col cols="3">
        <gokb-text-field
          v-model="reviewItem.dateCreated"
          disabled
          :label="$t('component.general.dateCreated')"
        />
      </v-col>
      <v-col cols="3">
        <gokb-state-field
          v-model="reviewItem.status"
          :init-item="reviewItem.status"
          :clearable="false"
          :readonly="isReadonly"
          return-object
          message-path="component.review.status"
          url="refdata/categories/ReviewRequest.Status"
          :label="$t('component.general.status.label')"
        />
      </v-col>
      <v-col
        v-if="reviewItem.allocatedGroups.length > 0"
        cols="3"
      >
        <div
          class="v-select__slot"
          style="margin-top:-8px"
        >
          <label
            class="v-label"
            style="display:block;font-size:0.9em;"
          > {{ $tc('component.curatoryGroup.label', 2) }}: </label>
        </div>
        <div style="margin-top:-6px">
          <v-chip-group>
            <v-chip
              v-for="group in reviewItem.allocatedGroups"
              :key="group.name"
              class="font-weight-medium"
              pill
            >
              {{ group.name }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col md="12">
        <gokb-entity-field
          v-model="reviewItem.component"
          :readonly="isEdit || isReadonly || !!component"
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
        <template>
          <div v-if="reviewItem.stdDesc">
            <v-row dense>
              <v-col cols="6">
                <gokb-text-field
                  v-model="localAction"
                  :label="$t('component.review.action')"
                  disabled
                />
              </v-col>
            </v-row>
            <label
              class="v-label"
              style="display:block;font-size:0.9em;"
              for="stdDesc"
            >
              {{ $t('component.review.cause') }}
            </label>
            <i18n
              id="stdDesc"
              :style="{ fontSize: '1.2em' }"
              :path="'component.review.stdDesc.' + (reviewItem.stdDesc.value || reviewItem.stdDesc.name) + '.info'"
            >
              <template v-slot:0>
                <router-link
                  v-if="numMessageVars > 0 && typeof additionalInfo.vars[0] === 'number'"
                  :to="{ name: componentRoutes[reviewItem.component.type.toLowerCase()], params: { 'id': additionalInfo.vars[0] } }"
                  :style="{ color: 'primary' }"
                >
                  {{ additionalInfo.vars[0] === reviewItem.component.id ? reviewItem.component.name : additionalInfo.vars[1] }}
                </router-link>
                <b v-else-if="numMessageVars > 0">{{ additionalInfo.vars[0] }}</b>
                <router-link
                  v-else-if="reviewItem.otherComponents && reviewItem.otherComponents.length > 0"
                  :to="{ name: reviewItem.otherComponents[0].route, params: { 'id': reviewItem.otherComponents[0].id } }"
                  :style="{ color: 'primary' }"
                >
                  {{ reviewItem.otherComponents[0].name }}
                </router-link>
                <router-link
                  v-else-if="reviewItem.component"
                  :to="{ name: componentRoutes[reviewItem.component.type.toLowerCase()], params: { 'id': reviewItem.component.id } }"
                  :style="{ color: 'primary' }"
                >
                  {{ reviewItem.component.name }}
                </router-link>
              </template>
              <template v-slot:1>
                <b v-if="numMessageVars > 1">
                  <span v-if="typeof additionalInfo.vars[1] === 'string' || typeof additionalInfo.vars[1] === 'number'">
                    {{ additionalInfo.vars[1] }}
                  </span>
                  <span v-else-if="Array.isArray(additionalInfo.vars[1])">
                    (
                    <span
                      v-for="(entry, idx) in additionalInfo.vars[1]"
                      :key="idx"
                    >
                      <span v-if="typeof entry === 'string'">
                        {{ entry }}
                      </span>
                      <span v-else>
                        <span
                          v-for="(value, namespace) in entry"
                          :key="namespace + '_' + value"
                        >
                          {{ namespace }}:{{ value }}
                        </span>
                      </span>
                    </span>
                    )
                  </span>
                </b>
              </template>
              <template v-slot:2>
                <b v-if="numMessageVars > 2">{{ additionalInfo.vars[2] }}</b>
              </template>
            </i18n>
          </div>
          <gokb-text-field
            v-else
            v-model="reviewItem.description"
            required
            :disabled="isEdit"
            :label="$i18n.t('component.review.cause')"
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
                  close
                </v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <gokb-entity-field
                  v-model="newAdditionalComponent"
                  :readonly="!!isReadonly"
                  :show-link="true"
                  :label="$t('component.review.otherComponents.add')"
                  return-object
                  @input="addNewOtherComponent"
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
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <template>
          <div v-if="reviewItem.stdDesc">
            <label
              class="v-label"
              style="display:block;font-size:0.9em;"
              for="todo"
            >
              To Do
            </label>
            <i18n
              id="todo"
              :style="{ fontSize: '1.2em'}"
              :path="'component.review.stdDesc.' + (reviewItem.stdDesc.value || reviewItem.stdDesc.name) + '.toDo'"
            >
              <template v-slot:0>
                <router-link
                  v-if="reviewItem.otherComponents && reviewItem.otherComponents.size > 0"
                  :style="{ color: 'primary' }"
                  :to="{ name: reviewItem.otherComponents[0].route, params: { 'id': reviewItem.otherComponents[0].id } }"
                  color="primary"
                >
                  {{ reviewItem.otherComponents[0].name }}
                </router-link>
                <router-link
                  v-else-if="reviewItem.component"
                  :to="{ name: componentRoutes[reviewItem.component.type.toLowerCase()], params: { 'id': reviewItem.component.id } }"
                  :style="{ color: 'primary' }"
                >
                  {{ reviewItem.component.name }}
                </router-link>
              </template>
            </i18n>
          </div>
          <gokb-textarea-field
            v-else
            v-model="reviewItem.request"
            required
            :disabled="isEdit"
            :label="$i18n.t('component.review.request')"
          />
        </template>
      </v-col>
    </v-row>
    <v-row v-if="additionalInfo">
      <v-col md="12">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $t('component.review.additionalInfo.label') }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <vue-json-pretty :data="additionalInfo" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <template #buttons>
      <gokb-button
        v-if="escalatable"
        @click="escalate"
      >
        {{ $t('btn.escalate') }}
      </gokb-button>
      <gokb-button
        v-if="deescalatable"
        @click="deescalate"
      >
        {{ $t('btn.deescalate') }}
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
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'GokbAddReviewPopup',
    components: { VueJsonPretty },
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
        return (this.isEdit && this.reviewItem?.component ? this.$i18n.t('component.review.componentToReview') + ' (' + this.$i18n.tc('component.' + this.reviewItem.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview'))
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
      this.selectedItem = this.selected

      if (this.selected) {
        this.id = this.selected.id
        this.fetch(this.id)
      }

      if (this.component) {
        this.reviewItem.component = this.component
      }

      if (this.selectedItem) {
        this.isEscalatable()
        this.isDeescalatable()
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async isEscalatable () {
        await this.catchError({
          promise: reviewServices.escalatable(this.id, accountModel.activeGroup().id),
          instance: this
        })
          .then(response => {
            console.log(response)
            this.escalatable = response.data.isEscalatable
          })
      },
      async isDeescalatable () {
        await this.catchError({
          promise: reviewServices.deescalatable(this.id, accountModel.activeGroup().id),
          instance: this
        })
          .then(response => {
            console.log(response)
            this.deescalatable = response.data.isDeescalatable
          })
      },
      async escalate () {
        const response = await this.catchError({
          promise: reviewServices.escalate(this.id, accountModel.activeGroup().id),
          instance: this
        })
        if (response.status === 200) {
          this.$emit('paginate', response.data)
          this.close()
        }
      },
      async deescalate () {
        const response = await this.catchError({
          promise: reviewServices.deescalate(this.id, accountModel.activeGroup().id),
          instance: this
        })
        if (response.status === 200) {
          this.$emit('paginate', response.data)
          this.close()
        }
      },
      async fetch (rid) {
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
      },
      async save () {
        const activeGroup = accountModel.activeGroup()

        const newReview = {
          id: this.id,
          status: this.reviewItem.status?.id || null,
          stdDesc: this.reviewItem.stdDesc?.id || null,
          version: this.version,
          reviewRequest: this.reviewItem.request || this.$i18n.t('component.review.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.action'),
          descriptionOfCause: this.reviewItem.description || this.$i18n.t('component.review.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.info'),
          activeGroup,
          componentToReview: this.reviewItem.component.id,
          additionalInfo: { otherComponents: this.reviewItem.otherComponents }
        }

        const response = await this.catchError({
          promise: reviewServices.createOrUpdateReview(newReview, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.$emit('edit', this.selectedItem)
          this.close()
        } else if (response?.status === 201) {
          this.$emit('added', response.data)
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

<style>
  .vjs-tree__node.is-highlight, .vjs-tree__node:hover {background-color:#9b9b9b }
  .vjs-value__string { color: #3c804b }
</style>
