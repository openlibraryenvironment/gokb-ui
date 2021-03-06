<template>
  <gokb-dialog
    v-model="localValue"
    title="Review-Details"
    :width="1000"
    @submit="save"
  >
    <gokb-error-component :value="error" />
    <v-row>
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
    <v-row align="center">
      <v-col cols="3">
        <gokb-text-field
          v-model="reviewItem.dateCreated"
          disabled
          :label="$t('component.general.dateCreated')"
        />
      </v-col>
      <v-col cols="3">
        <gokb-state-field
          v-model="reviewItem.stdDesc"
          :init-item="stdDesc"
          :readonly="isReadonly"
          return-object
          url="refdata/categories/ReviewRequest.StdDesc"
          message-path="component.review.stdDesc"
          :label="$tc('component.review.stdDesc.label')"
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
        align-self="center"
      >
        <label class="v-label"> {{ $tc('component.curatoryGroup.label', 2) }}: </label>
        <v-chip
          v-for="group in reviewItem.allocatedGroups"
          :key="group.name"
        >
          {{ group.name }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <template>
          <div v-if="reviewItem.stdDesc">
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
                  :style="{ color: '#f2994a' }"
                  :to="{ name: componentRoutes[reviewItem.component.type.toLowerCase()], params: { 'id': additionalInfo.vars[0] } }"
                >
                  {{ reviewItem.component.name }}
                </router-link>
                <b v-else-if="numMessageVars > 0">{{ additionalInfo.vars[0] }}</b>
                <router-link
                  v-else-if="reviewItem.otherComponents && reviewItem.otherComponents.length > 0"
                  :style="{ color: '#f2994a' }"
                  :to="{ name: reviewItem.otherComponents[0].route, params: { 'id': reviewItem.otherComponents[0].id } }"
                >
                  {{ reviewItem.otherComponents[0].name }}
                </router-link>
                <router-link
                  v-else-if="reviewItem.component"
                  :style="{ color: '#f2994a' }"
                  :to="{ name: componentRoutes[reviewItem.component.type.toLowerCase()], params: { 'id': reviewItem.component.id } }"
                >
                  {{ reviewItem.component.name }}
                </router-link>
              </template>
              <template v-slot:1>
                <b v-if="numMessageVars > 1">
                  <span v-if="typeof additionalInfo.vars[1] === 'string'">
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
            v-model="reviewItem.request"
            :disabled="isEdit"
            :label="$i18n.t('component.review.cause')"
          />
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
                  :style="{ color: '#f2994a', fontSize: '1.2em', marginRight: '4px' }"
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
                  :style="{ color: '#f2994a' }"
                  :to="{ name: reviewItem.otherComponents[0].route, params: { 'id': reviewItem.otherComponents[0].id } }"
                >
                  {{ reviewItem.otherComponents[0].name }}
                </router-link>
                <router-link
                  v-else-if="reviewItem.component"
                  :style="{ color: '#f2994a' }"
                  :to="{ name: componentRoutes[reviewItem.component.type.toLowerCase()], params: { 'id': reviewItem.component.id } }"
                >
                  {{ reviewItem.component.name }}
                </router-link>
              </template>
            </i18n>
          </div>
          <gokb-textarea-field
            v-else
            v-model="reviewItem.description"
            :disabled="isEdit"
            :label="$i18n.t('component.review.request')"
          />
        </template>
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
        {{ isEdit ? $t('btn.update') : $t('btn.create') }}
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
        deleteUrl: undefined,
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
      }
    },
    async created () {
      this.selectedItem = this.selected

      if (this.selected) {
        this.id = this.selected.id
        this.fetch(this.id)
      }

      if (this.component) {
        this.reviewItem.component = this.component
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async fetch (rid) {
        const {
          data: {
            status,
            stdDesc,
            reviewRequest,
            descriptionOfCause,
            dateCreated,
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
        this.reviewItem.dateCreated = new Date(dateCreated).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' })
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
      },
      async save () {
        const newReview = {
          id: this.id,
          status: this.reviewItem.status?.id || null,
          stdDesc: this.reviewItem.stdDesc?.id || null,
          reviewRequest: this.reviewItem.request,
          descriptionOfCause: this.reviewItem.description,
          componentToReview: this.reviewItem.component.id,
          additionalInfo: { otherComponents: this.reviewItem.otherComponents }
        }

        const response = await this.catchError({
          promise: reviewServices.createOrUpdateReview(newReview, this.cancelToken.token),
          instance: this
        })

        if (response.status === 200) {
          this.$emit('edit', this.selectedItem)
          this.close()
        } else if (response.status === 201) {
          this.$emit('added', response.data)
          this.close()
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
