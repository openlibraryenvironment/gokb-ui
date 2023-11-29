<template>
  <v-row no-gutters>
    <v-col>
      <v-checkbox
        v-model="localValue"
        :label="label"
        :disabled="disabled"
        :readonly="readonly"
      />
    </v-col>
    <v-col v-if="!!gokbToolTip" cols="1">
      <gokb-tooltip :code="gokbToolTip" />
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'GokbCheckboxField',
    props: {
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      gokbToolTip: {
        type: String,
        required: false,
        default: undefined
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    },
  }
</script>
