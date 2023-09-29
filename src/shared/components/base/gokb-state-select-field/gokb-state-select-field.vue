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
        value="Current"
        on-icon="mdi-check-circle"
        color="success"
        :label="$t('component.general.status.Current.label')"
        off-icon="mdi-check-circle-outline"
        :readonly="!editable"
      />
      <v-radio
        value="Retired"
        on-icon="mdi-close-circle"
        color="amber"
        :label="$t('component.general.status.Retired.label')"
        :readonly="!editable"
        off-icon="mdi-close"
      />
      <v-radio
        value="Expected"
        on-icon="mdi-clock"
        color="info"
        :label="$t('component.general.status.Expected.label')"
        :readonly="!editable"
        off-icon="mdi-clock-outline"
      />
      <v-radio
        ref="del"
        value="Deleted"
        on-icon="mdi-delete"
        color="red"
        :label="$t('component.general.status.Deleted.label')"
        readonly
        off-icon="mdi-delete-outline"
        style="padding-right:4px;border: 1px solid red;border-radius:2px"
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
        }
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
