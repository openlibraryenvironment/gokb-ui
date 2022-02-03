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
      :title="currentRestriction"
      off-icon="check_circle_outline"
      :readonly="!editable"
    >
      <template v-slot:label>
        <span v-if="!editable || !currentRestriction">
          {{ $t('component.general.status.Current.label') }}
        </span>
        <v-tooltip
          v-else
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              :style="{ color: (editable ? ($vuetify.theme.dark ? 'rgb(100, 100, 100)' : 'rgba(0, 0, 0, 0.4)') : '')}"
              v-on="on"
            >
              {{ $t('component.general.status.Current.label') }}
            </span>
          </template>
          <span>{{ currentRestriction }}</span>
        </v-tooltip>
      </template>
    </v-radio>
    <v-radio
      value="Retired"
      on-icon="cancel"
      color="amber"
      :readonly="!editable"
      off-icon="close"
    >
      <template v-slot:label>
        <span v-if="!editable || !retiredRestriction">
          {{ $t('component.general.status.Retired.label') }}
        </span>
        <v-tooltip
          v-else
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              :style="{ color: (editable ? ($vuetify.theme.dark ? 'rgb(100, 100, 100)' : 'rgba(0, 0, 0, 0.4)') : '')}"
              v-on="on"
            >
              {{ $t('component.general.status.Retired.label') }}
            </span>
          </template>
          <span>{{ retiredRestriction }}</span>
        </v-tooltip>
      </template>
    </v-radio>
    <v-radio
      value="Expected"
      on-icon="watch_later"
      color="info"
      :readonly="!editable"
      off-icon="schedule"
    >
      <template v-slot:label>
        <span v-if="!editable || !expectedRestriction">
          {{ $t('component.general.status.Expected.label') }}
        </span>
        <v-tooltip
          v-else
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              :style="{ color: (editable ? ($vuetify.theme.dark ? 'rgb(100, 100, 100)' : 'rgba(0, 0, 0, 0.4)') : '')}"
              v-on="on"
            >
              {{ $t('component.general.status.Expected.label') }}
            </span>
          </template>
          <span>{{ expectedRestriction }}</span>
        </v-tooltip>
      </template>
    </v-radio>
    <v-radio
      value="Deleted"
      on-icon="delete"
      color="red"
      :readonly="!editable || !deletable"
      off-icon="delete_outline"
    >
      <template v-slot:label>
        <span v-if="!editable || !deletedRestriction">
          {{ $t('component.general.status.Deleted.label') }}
        </span>
        <v-tooltip
          v-else
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              :style="{ color: (editable && !deletable ? ($vuetify.theme.dark ? 'rgb(100, 100, 100)' : 'rgba(0, 0, 0, 0.4)') : '')}"
              v-on="on"
            >
              {{ $t('component.general.status.Deleted.label') }}
            </span>
          </template>
          <span>{{ deletedRestriction }}</span>
        </v-tooltip>
      </template>
    </v-radio>
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
      },
      restrictionMessages: {
        type: Object,
        required: false,
        default: undefined
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
      },
      deletedRestriction () {
        return this.restrictionMessages?.deleted ? this.$i18n.t(this.restrictionMessages.deleted) : undefined
      },
      expectedRestriction () {
        return this.restrictionMessages?.expected ? this.$i18n.t(this.restrictionMessages.expected) : undefined
      },
      currentRestriction () {
        return this.restrictionMessages?.current ? this.$i18n.t(this.restrictionMessages.current) : undefined
      },
      retiredRestriction () {
        return this.restrictionMessages?.retired ? this.$i18n.t(this.restrictionMessages.retired) : undefined
      },
    },
    watch: {
      currentState () {
        this.localValue = this.currentState
      }
    },
  }
</script>
