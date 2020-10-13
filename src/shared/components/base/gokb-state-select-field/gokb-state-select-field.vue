<template>
  <v-radio-group
    v-model="localValue"
    row
  >
    <v-radio
      value="Current"
      on-icon="check_circle"
      color="success"
      :label="$t('component.general.status.Current')"
      off-icon="check_circle_outline"
      :readonly="!editable"
    />
    <v-radio
      value="Retired"
      on-icon="cancel"
      color="amber"
      :label="$t('component.general.status.Retired')"
      :readonly="!editable"
      off-icon="close"
    />
    <v-radio
      value="Expected"
      on-icon="watch_later"
      color="info"
      :label="$t('component.general.status.Expected')"
      :readonly="!editable"
      off-icon="schedule"
    />
    <v-radio
      value="Deleted"
      on-icon="delete"
      color="red"
      :label="$t('component.general.status.Deleted')"
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
        default: undefined,
      },
      value: {
        type: [String, Object],
        required: true,
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
          return (typeof this.value === 'string' ? this.value : this.value.name)
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
