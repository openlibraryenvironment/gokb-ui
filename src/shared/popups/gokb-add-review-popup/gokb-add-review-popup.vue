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
          :label="$i18n.tc('component.review.stdDesc.label')"
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
          :label="$t('component.general.status.label')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <template>
          <div v-if="reviewItem.stdDesc">
            <label
              class="v-label v-label--active theme--light"
              style="display:block;font-size:0.9em;"
              for="todo"
            >
              {{ $t('component.review.cause') }}
            </label>
            <i18n
              :style="{ fontSize: '1.2em'}"
              :path="'component.review.stdDesc.' + reviewItem.stdDesc.name + '.info'"
            >
              <template v-slot:0>
                <router-link
                  v-if="reviewItem.otherComponents && reviewItem.otherComponents > 0"
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
                <b>{{ message.vars[1] }}</b>
              </template>
            </i18n>
          </div>
          <gokb-text-field
            v-else
            v-model="reviewItem.request"
            :disabled="isEdit"
            :label="$i18n.t('component.review.cause')"
          />
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <template>
          <div v-if="reviewItem.stdDesc">
            <label
              class="v-label v-label--active theme--light"
              style="display:block;font-size:0.9em;"
              for="todo"
            >
              To Do
            </label>
            <i18n
              id="todo"
              :style="{ fontSize: '1.2em'}"
              :path="'component.review.stdDesc.' + reviewItem.stdDesc.name + '.toDo'"
            >
              <template v-slot:0>
                <router-link
                  v-if="reviewItem.otherComponents && reviewItem.otherComponents > 0"
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
                <b>{{ message.vars[1] }}</b>
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
        selectedItem: undefined,
        additionalInfo: undefined,
        updateUrl: undefined,
        deleteUrl: undefined,
        reviewItem: {
          status: undefined,
          stdDesc: undefined,
          request: undefined,
          description: undefined,
          dateCreated: undefined,
          component: undefined,
          otherComponents: undefined
        },
        items: [],
        componentRoutes: {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
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
      }
    },
    async created () {
      this.selectedItem = this.selected

      if (this.selected) {
        this.id = this.selected.id

        const {
          data: {
            status,
            stdDesc,
            reviewRequest,
            descriptionOfCause,
            dateCreated,
            componentToReview,
            additionalInfo,
            _links: {
              update: { href: updateUrl },
              delete: { href: deleteUrl }
            }
          }
        } = await this.catchError({
          promise: reviewServices.getReview(this.id, this.cancelToken.token),
          instance: this
        })
        this.additionalInfo = additionalInfo

        this.reviewItem.status = status
        this.reviewItem.stdDesc = stdDesc
        this.reviewItem.request = reviewRequest
        this.reviewItem.description = descriptionOfCause
        this.reviewItem.dateCreated = dateCreated
        this.reviewItem.component = componentToReview
        this.reviewItem.otherComponents = additionalInfo?.otherComponents ? additionalInfo.otherComponents.map(({ oid, name }) => ({
          name,
          id: oid.split(':')[1],
          route: this.componentRoutes[componentToReview?.type?.toLowerCase()]
        })) : []
        this.updateUrl = updateUrl
        this.deleteUrl = deleteUrl
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
