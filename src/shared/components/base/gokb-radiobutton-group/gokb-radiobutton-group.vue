<template>
  <v-radio-group
    :id="id"
    v-model="localValue"
    inline
    :label="label"
    :disabled="disabled"
  >
    <template #label>
      {{ label }}
      <span
        v-if="required"
        style="color:red"
      >
        *
      </span>
    </template>
    <slot />
  </v-radio-group>
</template>

<script>
  export default {
    name: 'GokbRadiobuttonGroup',
    emits: ['update:model-value'],
    props: {
      id: {
        type: String,
        required: false,
        default: undefined
      },
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      modelValue: {
        required: true,
        default: '',
        validator: function (value) {
          return value === undefined || value === null || typeof value === 'string' || typeof value === 'number'
        }
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      required: {
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
          this.$emit('update:model-value', localValue)
        }
      },
    },
  }
</script>

<style scoped>
</style>
