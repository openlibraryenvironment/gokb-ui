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
        cols="3"
      >
        <gokb-curatory-group-popup
          v-if="showGroupInfo"
          v-model="showGroupInfo"
          :selected="selectedGroup"
        />
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
              @click="triggerSelectedGroup(group)"
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
        <div v-if="!!reviewComponent.stdDesc && reviewComponent.stdDesc.name != 'Manual Request'">
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
                <v-row class="mb-3">
                  <v-col>
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
                <i18n-t
                  id="stdDesc"
                  scope="global"
                  :keypath="'component.review.stdDesc.' + (reviewComponent.stdDesc.value || reviewComponent.stdDesc.name) + '.info'"
                >
                  <template v-slot:firstOtherLink>
                    <router-link
                        :to="{ name: reviewComponent.otherComponents[0].route, params: { 'id': reviewComponent.otherComponents[0].id } }"
                        class="text-primary font-weight-bold"
                        target="_blank"
                    >
                      {{ reviewComponent.otherComponents[0].name}}
                    </router-link>
                  </template>
                  <template v-slot:firstInfo>
                    {{ !!additionalVars && additionalVars[0] }}
                  </template>
                  <template v-slot:secondInfo>
                    {{ !!additionalVars && additionalVars[1] }}
                  </template>
                  <template v-slot:secondLink>
                    <router-link
                        v-if="!!additionalVars"
                        :to="{ name: componentRoutes[reviewComponent.component.type.toLowerCase()], params: { 'id': additionalVars[1] } }"
                        class="text-primary"
                        target="_blank"
                    >
                      {{ additionalVars[1] === reviewComponent.component.id ? reviewComponent.component.name : additionalVars[0] }}
                    </router-link>
                  </template>
                  <template v-slot:secondArray>
                    <span v-if="!!additionalVars">
                      [
                        <span
                          v-for="(entry, idx) in additionalVars[1]"
                          :key="idx"
                        >
                          <span v-if="typeof entry === 'string' || typeof entry === 'number'">
                            {{ entry }}
                          </span>
                          <span v-else>
                            <span
                              v-for="(value, namespace) in entry"
                              :key="namespace + '_' + value"
                            >
                              {{namespace}}: {{value}}
                            </span>
                          </span>
                        </span>
                      ]
                    </span>
                  </template>
                  <template v-slot:thirdInfo>
                    {{ !!additionalVars && additionalVars[2] }}
                  </template>
                </i18n-t>
              </div>
              <div
                v-if="!hasComponentCards && !!reviewComponent.additionalInfo && !!reviewComponent.additionalInfo.candidates"
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
          <v-row v-if="editable && !!reviewComponent.stdDesc && !hasComponentCards">
            <v-col>
              <div>
                <label
                  class="v-label"
                  style="display:block;font-size:0.9em;"
                  for="todo"
                >
                  {{ $t('component.review.todo.label') }}
                </label>
                <i18n-t
                  id="todo"
                  scope="global"
                  :keypath="'component.review.stdDesc.' + (reviewComponent.stdDesc.value || reviewComponent.stdDesc.name) + '.toDo'"
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
                </i18n-t>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label
                class="v-label"
                style="display:block;font-size:0.9em;"
                for="more-info"
              >
                {{ $t('component.review.referenceBase.label') }}
              </label>
              <a id="more-info" :href="moreInfoLink" class="text-primary" target="_blank">
                {{ $t('component.review.referenceBase.message', [typeLabel]) }}
                <v-icon size="small" class="ml-1 mt-n1"> mdi-open-in-new </v-icon>
              </a>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <gokb-text-field
            v-model="reviewComponent.description"
            required
            disabled
            :label="$t('component.review.cause.label')"
          />
          <gokb-textarea-field
            v-model="reviewComponent.request"
            required
            disabled
            :label="$t('component.review.request.label')"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="reviewComponent.additionalInfo">
      <v-col md="12">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-title>{{ $t('component.review.additionalInfo.label') }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <vue-json-pretty :data="reviewComponent.additionalInfo" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import GokbCuratoryGroupPopup from '@/shared/popups/gokb-curatory-group-popup'

  export default {
    name: 'GokbReviewsHeader',
    components: { GokbCuratoryGroupPopup },
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
      },
      editable: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        error: undefined,
        showGroupInfo: false,
        selectedGroup: undefined,
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
        return !!this.reviewComponent?.component?.type || undefined
      },
      cmpLabel () {
        return (!!this.reviewComponent?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewComponent.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      },
      numMessageVars () {
        return !!this.additionalVars ? this.additionalVars.length : 0
      },
      localAction () {
        return !!this.reviewComponent?.stdDesc ? this.$i18n.t('component.review.stdDesc.' + (this.reviewComponent.stdDesc.value || this.reviewComponent.stdDesc.name) + '.action') : undefined
      },
      typeLabel () {
        return !!this.reviewComponent?.stdDesc ? this.$i18n.t('component.review.stdDesc.' + (this.reviewComponent.stdDesc.value || this.reviewComponent.stdDesc.name) + '.label') : undefined
      },
      moreInfoLink () {
        return !!this.reviewComponent.stdDesc ? this.$i18n.t('component.review.referenceBase.urlBase') + '#' + this.reviewComponent.stdDesc.name.replace(/\s/g, '_').toLowerCase() : undefined
      },
      darkMode () {
        return this.$vuetify.theme.global.current.dark
      },
    },
    methods: {
      triggerSelectedGroup(groupInfo) {
        this.selectedGroup = groupInfo
        this.showGroupInfo = true
      },
    }
  }
</script>
