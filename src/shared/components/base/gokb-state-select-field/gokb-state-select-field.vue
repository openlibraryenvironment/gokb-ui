<template>
  <div style="margin-top:-17px">
    <div class="text-caption font-weight-regular">{{ label }}</div>
    <gokb-confirmation-popup
      v-model="showSubmitConfirm"
      :message="submitConfirmationMessage"
      @confirmed="toggleDeleted"
    />
    <v-radio-group
      v-model="localValue"
      dense
      inline
    >
      <v-radio
        v-if="editable || localValue == 'Current'"
        value="Current"
        true-icon="mdi-check-circle"
        false-icon="mdi-check-circle-outline"
        :color="current"
        :label="$t('component.general.status.Current.label')"
        :readonly="!editable"
      />
      <v-radio
        v-if="editable || localValue == 'Retired'"
        value="Retired"
        true-icon="mdi-close-circle"
        false-icon="mdi-close"
        :color="retired"
        :label="$t('component.general.status.Retired.label')"
        :readonly="!editable"
      />
      <v-radio
        v-if="editable || localValue == 'Expected'"
        value="Expected"
        true-icon="mdi-clock"
        false-icon="mdi-clock-outline"
        :color="expected"
        :label="$t('component.general.status.Expected.label')"
        :readonly="!editable"
      />
      <v-radio
        v-if="editable || localValue == 'Deleted'"
        ref="del"
        value="Deleted"
        true-icon="mdi-delete"
        false-icon="mdi-delete-outline"
        :color="deleted"
        :label="activeDeletedLabel"
        readonly
        :style="{'paddingRight': '4px', 'border': ((editable || modelValue === 'Deleted') ? '1px solid red' : 'none'), 'borderRadius':'2px'}"
        @click="showConfirm(localValue)"
      />
    </v-radio-group>
  </div>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'

  export default {
    name: 'GokbStateSelectField',
    components: {
      GokbConfirmationPopup
    },
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      },
      modelValue: {
        type: [String, Object],
        required: false,
        default: undefined
      },
      deletable: {
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
    data() {
      return {
        showSubmitConfirm: false,
        submitConfirmationMessage: {
          text: 'component.general.status.edit.delete.confirm',
          vars: []
        },
        current: '#4CAF50',
        retired: '#FFC107',
        expected: '#2196F3',
        deleted: '#FF5252'
      }
    },
    computed: {
      localValue: {
        get () {
          return (typeof this.modelValue === 'object' ? this.modelValue.name : this.modelValue)
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
          this.$emit('delete', (localValue === 'Deleted'))
        }
      },
      activeDeletedLabel () {
        return (this.localValue === 'Deleted' || !this.editable) ? this.$i18n.t('component.general.status.Deleted.label') : this.$i18n.t('btn.delete')
      }
    },
    methods: {
      showConfirm(cv) {
        if (cv !== 'Deleted' && this.deletable) {
          this.showSubmitConfirm = true
        }
      },
      toggleDeleted() {
        this.localValue = 'Deleted'
      }
    }
  }
</script>
<style>
  .status-icon-current > div > i {
    color: v-bind(current) !important;
  }
  .status-icon-retired > div > i {
    color: v-bind(retired) !important;
  }
  .status-icon-expected > div > i {
    color: v-bind(expected) !important;
  }
  .status-icon-deleted > div > i {
    color: v-bind(deleted) !important;
  }
</style>
