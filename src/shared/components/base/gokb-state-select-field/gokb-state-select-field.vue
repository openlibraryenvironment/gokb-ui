<template>
  <div style="margin-top:-17px">
    <div class="text-caption font-weight-regular">{{ label }}</div>
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
        value="Deleted"
        on-icon="mdi-delete"
        color="red"
        :label="$t('component.general.status.Deleted.label')"
        :readonly="!deletable"
        off-icon="mdi-delete-outline"
      />
    </v-radio-group>
  </div>
</template>

<script>
  export default {
    name: 'GokbStateSelectField',
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
    computed: {
      localValue: {
        get () {
          return (typeof this.value === 'object' ? this.value.name : this.value)
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      }
    },
    watch: {
      currentState () {
        this.localValue = this.currentState
      }
    },
  }
</script>
