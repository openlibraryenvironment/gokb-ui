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
      row
    >
      <v-radio
        v-if="editable || localValue == 'Current'"
        value="Current"
        :class="[(!editable ? 'status-icon-current' : '')]"
        on-icon="mdi-check-circle"
        :color="current"
        :label="$t('component.general.status.Current.label')"
        off-icon="mdi-check-circle-outline"
        :disabled="!editable"
      />
      <v-radio
        v-if="editable || localValue == 'Retired'"
        value="Retired"
        :class="[(!editable ? 'status-icon-retired' : '')]"
        on-icon="mdi-close-circle"
        :color="retired"
        :label="$t('component.general.status.Retired.label')"
        :disabled="!editable"
        off-icon="mdi-close"
      />
      <v-radio
        v-if="editable || localValue == 'Expected'"
        value="Expected"
        :class="[(!editable ? 'status-icon-expected' : '')]"
        on-icon="mdi-clock"
        :color="expected"
        :label="$t('component.general.status.Expected.label')"
        :disabled="!editable"
        off-icon="mdi-clock-outline"
      />
      <v-radio
        v-if="editable || localValue == 'Deleted'"
        ref="del"
        value="Deleted"
        :class="[(!editable ? 'status-icon-deleted' : '')]"
        on-icon="mdi-delete"
        :color="deleted"
        :label="activeDeletedLabel"
        readonly
        :disabled="!editable"
        off-icon="mdi-delete-outline"
        :style="{'paddingRight': '4px', 'border': ((editable || localValue === 'Deleted') ? '1px solid red' : 'none'), 'borderRadius':'2px'}"
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
      value: {
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
          return (typeof this.value === 'object' ? this.value.name : this.value)
        },
        set (localValue) {
          this.$emit('input', localValue)
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
