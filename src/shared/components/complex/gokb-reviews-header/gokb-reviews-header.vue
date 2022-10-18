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
          :readonly="true"
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
    <v-row dense style="margin-top:-8px">
      <v-col md="12">
        <gokb-entity-field
          v-model="reviewComponent.component"
          :readonly="!!component"
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
          <div v-if="reviewComponent.stdDesc">
            <v-row dense>
              <v-col cols="6">
                <gokb-text-field
                  v-model="localAction"
                  :label="$t('component.review.action.label')"
                  disabled
                />
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
                  v-if="numMessageVars > 0 && typeof additionalInfo.vars[0] === 'number'"
                  :to="{ name: componentRoutes[reviewComponent.component.type.toLowerCase()], params: { 'id': additionalInfo.vars[0] } }"
                  :style="{ color: 'primary' }"
                >
                  {{ additionalInfo.vars[0] === reviewComponent.component.id ? reviewComponent.component.name : additionalInfo.vars[1] }}
                </router-link>
                <b v-else-if="numMessageVars > 0">{{ additionalInfo.vars[0] }}</b>
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
            v-model="reviewComponent.description"
            required
            :disabled="true"
            :label="$i18n.t('component.review.cause.label')"
          />
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import reviewServices from '@/shared/services/review-services'
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbReviewsHeader',
    components: {},
    extends: BaseComponent,
    props: {
      component: {
        type: Object,
        required: false,
        default: undefined
      },
      reviewComponent: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    computed: {
      cmpType () {
        return this.reviewComponent?.component?.type || undefined
      },
      cmpLabel () {
        return (this.isEdit && this.reviewComponent?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewComponent.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      }
    },
    created: {},
    watch: {},
    methods: {}
  }
</script>
