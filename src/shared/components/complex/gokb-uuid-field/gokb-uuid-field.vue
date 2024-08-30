<template>
  <v-text-field
    v-model="localValue"
    :label="label"
    :messages="successMessage"
    :density="dense ? 'dense' : 'default'"
    variant="underlined"
    disabled
    persistent-placeholder
  >
    <template
      v-slot:append
      v-if="!!urlBase"
    >
      <v-btn
        id="exturl"
        :title="$t('component.general.uuid.copy.label')"
        base-color="card"
        density="compact"
        icon
        flat
        @click="copyUrl"
      >
        <v-icon color="primary">
          mdi-clipboard-arrow-right
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
  export default {
    name: 'GokbUuidField',
    emits: ['update:model-value'],
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      modelValue: {
        type: String,
        required: false,
        default: undefined
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      path: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        copied: false
      }
    },
    computed: {
      successMessage () {
        return this.copied ? [this.$i18n.t('component.general.uuid.copy.success')] : []
      },
      urlBase () {
        return import.meta.env.VITE_BASE_URL
      },
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        },
      }
    },
    methods: {
      copyUrl () {
        console.log(this.localValue)
        const url = import.meta.env.VITE_BASE_URL + this.path + '/' + this.$attrs.value
        navigator.clipboard.writeText(url)
        this.copied = true
      }
    }
  }
</script>

<style scoped>
  #exturl {
    pointer-events: auto !important;
  }
</style>
