<template>
  <v-radio-group
    v-model="localValue"
    dense
    row
  >
    <template v-slot:label>
      <span>{{ label }}:</span>
    </template>
    <v-radio
      value="Current"
      on-icon="check_circle"
      color="success"
      :label="$t('component.general.status.Current.label')"
      off-icon="check_circle_outline"
      :readonly="!editable"
    />
    <v-radio
      value="Retired"
      on-icon="cancel"
      color="amber"
      :label="$t('component.general.status.Retired.label')"
      :readonly="!editable"
      off-icon="close"
    />
    <v-radio
      value="Expected"
      on-icon="watch_later"
      color="info"
      :label="$t('component.general.status.Expected.label')"
      :readonly="!editable"
      off-icon="schedule"
    />
    <v-radio
      value="Deleted"
      on-icon="delete"
      color="red"
      :label="$t('component.general.status.Deleted.label')"
      :readonly="!deletable"
      off-icon="delete_outline"
    />
  </v-radio-group>
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
