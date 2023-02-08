<template>
  <v-textarea
    v-model="localValue"
    v-bind="$props"
    :readonly="readonly"
    :rows="defaultRows"
    :prepend-icon-id="hideIcon ? '' : prependIcon"
    :required="required"
    validate-on-blur
    auto-grow
    clearable
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
  </v-textarea>
</template>

<script>
  export default {
    name: 'GokbTextareaField',
    props: {
      value: {
        required: true,
        validator: value => {
          return value === null || typeof value === 'string'
        },
        default: '',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      placeholder: {
        type: String,
        required: false,
        default: '',
      },
      label: {
        type: String,
        required: false,
        default: undefined,
      },
      type: {
        type: String,
        required: false,
        default: 'text',
      },
      required: {
        type: Boolean,
        required: false,
        default: false,
      },
      hideIcon: {
        type: Boolean,
        required: false,
        default: false,
      },
      prependIcon: {
        type: String,
        required: false,
        default: undefined,
      },
      autocomplete: {
        type: String,
        required: false,
        default: undefined,
      },
      rules: {
        type: Array,
        required: false,
        default: undefined,
      },
    },
    data () {
      return {
        defaultRows: 1
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
    watch: {
      value () {
        this.setDefRows()
      }
    },
    mounted() {
      this.setDefRows()
    },
    methods: {
      setDefRows() {
        let newRows = this.localValue?.match(/\n/g)?.length || 0
        this.defaultRows = newRows > 0 ? newRows + 2 : 1
      }
    }
  }
</script>

<style scoped>
</style>
