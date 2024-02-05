<template>
  <div>
    <label class="text-primary">
      {{ label }}
    </label>
    <v-row>
      <v-col
        v-for="(option, idx) in options"
        :key="idx"
      >
        <v-checkbox
          v-model="localValue"
          color="primary"
          :label="option.label"
          :value="option.key"
          :disabled="disabled"
          :readonly="readonly"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'GokbSearchMultiselectField',
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      },
      modelValue: {
        type: Array,
        required: false,
        default: undefined
      },
      options: {
        type: Array,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
        }
      }
    }
  }
</script>
