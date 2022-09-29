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

    <gokb-reviews-header :value="error" />

    <gokb-reviews-titles-section :value="error" />

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
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'
import GokbReviewsHeader from '../../components/complex/gokb-reviews-header/gokb-reviews-header.vue'

  export default {
    name: 'GokbReviewPopup',
    components: { VueJsonPrettyGokbReviewsHeader },
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
      reviewedComponent: {
        type: Object,
        required: false,
        default: undefined
      },
      referenceComponents: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {}
    },
    computed: {},
    created () {},
    methods: {}
  }
</script>
