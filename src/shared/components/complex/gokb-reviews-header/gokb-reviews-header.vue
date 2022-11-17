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
    <v-row dense mt-n2>
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
    <v-row class="mb-5">
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
            />
            <label
              class="v-label"
              style="display:block;font-size:0.9em;"
              for="todo"
            >
              {{ $t('component.review.todo.label') }}
            </label>
            <i18n
              id="todo"
              :style="{ fontSize: '1.2em' }"
              :path="'component.review.stdDesc.' + (reviewComponent.stdDesc.value || reviewComponent.stdDesc.name) + '.toDo'"
            />
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
  import BaseComponent from '@/shared/components/base-component'

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
      }
    },
    data () {
      return {
        error: undefined
      }
    },
    computed: {
      cmpType () {
        return this.reviewComponent?.component?.type || undefined
      },
      cmpLabel () {
        return (this.isEdit && this.reviewComponent?.component ? this.$i18n.t('component.review.componentToReview.label') + ' (' + this.$i18n.tc('component.' + this.reviewComponent.component.type.toLowerCase() + '.label') + ')' : this.$i18n.t('component.review.componentToReview.label'))
      },
      numMessageVars () {
        return this.additionalInfo?.vars ? this.additionalInfo.vars.length : 0
      },
      localAction () {
        return this.reviewItem?.stdDesc ? this.$i18n.t('component.review.stdDesc.' + (this.reviewItem.stdDesc.value || this.reviewItem.stdDesc.name) + '.action') : undefined
      }
    },
    created () {},
    mounted () {},
    watch: {},
    methods: {}
  }
</script>
