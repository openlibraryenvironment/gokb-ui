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
        value="Current"
        true-icon="mdi-check-circle"
        false-icon="mdi-check-circle-outline"
        color="success"
        :label="$t('component.general.status.Current.label')"
        :readonly="!editable"
      />
      <v-radio
        value="Retired"
        true-icon="mdi-close-circle"
        false-icon="mdi-close"
        color="amber"
        :label="$t('component.general.status.Retired.label')"
        :readonly="!editable"
      />
      <v-radio
        value="Expected"
        true-icon="mdi-clock"
        false-icon="mdi-clock-outline"
        color="info"
        :label="$t('component.general.status.Expected.label')"
        :readonly="!editable"
      />
      <v-radio
        ref="del"
        value="Deleted"
        true-icon="mdi-delete"
        false-icon="mdi-delete-outline"
        color="red"
        :label="$t('component.general.status.Deleted.label')"
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
        }
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
