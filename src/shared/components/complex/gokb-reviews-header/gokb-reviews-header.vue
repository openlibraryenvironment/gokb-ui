<template>
  <div>
    <v-row
      align="center"
    >
      <v-col cols="3">
        <gokb-text-field
          v-model="reviewComponent.dateCreated"
          disabled
          :label="$t('component.general.dateCreated')"
        />
      </v-col>
      <v-col cols="3">
        <gokb-state-field
          v-model="reviewComponent.status"
          :init-item="reviewComponent.status"
          :clearable="false"
          readonly
          return-object
          message-path="component.review.status"
          url="refdata/categories/ReviewRequest.Status"
          :label="$t('component.general.status.label')"
        />
      </v-col>
      <v-col
        v-if="reviewComponent.allocatedGroups.length > 0"
        cols="3"
      >
        <div
          class="v-select__slot mt-n2"
        >
          <label
            class="v-label"
            style="display:block;font-size:0.9em;"
          > {{ $tc('component.curatoryGroup.label', 2) }}: </label>
        </div>
        <div style="margin-top:-6px">
          <v-chip-group>
            <v-chip
              v-for="group in reviewComponent.allocatedGroups"
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
    <v-row
      v-if="!hasComponentCards"
      dense
      mt-n2
    >
      <v-col md="12">
        <gokb-entity-field
          v-model="reviewComponent.component"
          :init-item="component"
          :type-filter="cmpType"
          :label="cmpLabel"
          return-object
          show-link
          readonly
        />
      </v-col>
    </v-row>
    <v-row
      class="mb-5"
      dense
    >
      <v-col md="12">
        <div v-if="reviewComponent.stdDesc && reviewComponent.stdDesc.name != 'Manual Request'">
          <v-row>
            <v-col md="12">
              <div>
                <label
                  class="v-label"
                  style="display:block;font-size:0.9em;"
                  for="localAction"
                >
                  {{ $t('component.review.action.label') }}
                </label>
                <v-row class="mb-3  ">
                  <v-col :style="{ fontSize: '1.2em'}">
                    {{ localAction }}
                  </v-col>
                </v-row>
                <label
                  class="v-label"
                  style="display:block;font-size:0.9em;"
                  for="stdDesc"
                >
                  {{ $t('component.review.cause.label') }}
                </label>
                <i18n
                  id="stdDesc"
                  :style="{ fontSize: '1.2em' }"
                  :path="'component.review.stdDesc.' + (reviewComponent.stdDesc.value || reviewComponent.stdDesc.name) + '.info'"
                >
                  <template v-slot:0>
                    <router-link
                      v-if="numMessageVars > 0 && typeof additionalVars[0] === 'number'"
                      :to="{ name: componentRoutes[reviewComponent.component.type.toLowerCase()], params: { 'id': additionalVars[0] } }"
                      :style="{ color: 'primary' }"
                    >
                      {{ additionalVars[0] === reviewComponent.component.id ? reviewComponent.component.name : additionalVars[1] }}
                    </router-link>
                    <b v-else-if="numMessageVars > 0">{{ additionalVars[0] }}</b>
                    <router-link
                      v-else-if="reviewComponent.otherComponents && reviewComponent.otherComponents.length > 0"
                      :to="{ name: reviewComponent.otherComponents[0].route, params: { 'id': reviewComponent.otherComponents[0].id } }"
                      :style="{ color: 'primary' }"
                    >
                      {{ reviewComponent.otherComponents[0].name }}
                    </router-link>
                    <router-link
                      v-else-if="reviewComponent.component"
                      :to="{ name: componentRoutes[reviewComponent.component.type.toLowerCase()], params: { 'id': reviewComponent.component.id } }"
                      :style="{ color: 'primary' }"
                    >
                      {{ reviewComponent.component.name }}
                    </router-link>
                  </template>
                  <template v-slot:1>
                    <b v-if="numMessageVars > 1">
                      <span v-if="typeof additionalVars[1] === 'string' || typeof additionalVars[1] === 'number'">
                        {{ additionalVars[1] }}
                      </span>
                      <span v-else-if="Array.isArray(additionalVars[1])">
                        (
                        <span
                          v-for="(entry, idx) in additionalVars[1]"
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
                    <b v-if="numMessageVars > 2">{{ additionalVars[2] }}</b>
                  </template>
                </i18n>
              </div>
              <div
                v-if="!hasComponentCards && reviewComponent.additionalInfo && reviewComponent.additionalInfo.candidates"
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
                    v-for="(c, idx) in reviewComponent.additionalInfo.candidates"
                    :key="idx"
                  >
                    {{ c.title }} ({{ c.id }})
                  </v-col>
                </v-row>
              </div>
              <div
                v-if="!hasComponentCards"
                class="pt-3"
              >
                <label
                  class="v-label"
                  style="display:block;font-size:0.9em;"
                  for="otherComponents"
                >
                  {{ $tc('component.review.otherComponents.label') }}
                </label>
                <v-row
                  v-for="(oc, idx) in reviewComponent.otherComponents"
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
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="reviewComponent.stdDesc && !hasComponentCards">
            <v-col>
              <div>
                <label
                  class="v-label"
                  style="display:block;font-size:0.9em;"
                  for="todo"
                >
                  {{ $t('component.review.todo.label') }}
                </label>
                <i18n
                  id="todo"
                  :style="{ fontSize: '1.2em'}"
                  :path="'component.review.stdDesc.' + (reviewComponent.stdDesc.value || reviewComponent.stdDesc.name) + '.toDo'"
                >
                  <template v-slot:0>
                    <router-link
                      v-if="reviewComponent.otherComponents && reviewComponent.otherComponents.size > 0"
                      :style="{ color: 'primary' }"
                      :to="{ name: reviewComponent.otherComponents[0].route, params: { 'id': reviewComponent.otherComponents[0].id } }"
                      color="primary"
                    >
                      {{ reviewComponent.otherComponents[0].name }}
                    </router-link>
                    <router-link
                      v-else-if="reviewComponent.component"
                      :to="{ name: componentRoutes[reviewComponent.component.type.toLowerCase()], params: { 'id': reviewComponent.component.id } }"
                      :style="{ color: 'primary' }"
                    >
                      {{ reviewComponent.component.name }}
                    </router-link>
                  </template>
                </i18n>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <gokb-text-field
            v-model="reviewComponent.description"
            required
            disabled
            :label="$i18n.t('component.review.cause.label')"
          />
          <gokb-textarea-field
            v-model="reviewComponent.request"
            required
            disabled
            :label="$i18n.t('component.review.request.label')"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="reviewComponent.additionalInfo">
      <v-col md="12">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $t('component.review.additionalInfo.label') }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <vue-json-pretty :data="reviewComponent.additionalInfo" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'

  export default {
    name: 'GokbReviewsHeader',
    components: {},
    extends: BaseComponent,
    props: {
      component: {
        type: Object,
        required: true
      },
      reviewComponent: {
        type: Object,
        required: true
      },
      additionalVars: {
        type: Array,
        required: false,
        default: undefined
      },
      hasComponentCards: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        error: undefined,
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
        return this.reviewComponent?.component?.type || undefined
      },
      cmpLabel () {
        return (this.reviewComponent?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewComponent.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      },
      numMessageVars () {
        return this.additionalVars ? this.additionalVars.length : 0
      },
      localAction () {
        return this.reviewComponent?.stdDesc ? this.$i18n.t('component.review.stdDesc.' + (this.reviewComponent.stdDesc.value || this.reviewComponent.stdDesc.name) + '.action') : undefined
      }
    }
  }
</script>
