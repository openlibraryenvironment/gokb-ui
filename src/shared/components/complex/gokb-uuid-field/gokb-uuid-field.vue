<template>
  <v-text-field
    :value="modelValue"
    :label="label"
    :messages="messages"
    :dense="dense"
    disabled
    readonly
  >
    <template
      v-slot:append-outer
      v-if="!!urlBase"
    >
      <v-btn
        :title="$t('component.general.uuid.copy.label')"
        class="mt-n2"
        icon
        @click="copyUrl"
      >
        <v-icon>
          mdi-clipboard-arrow-right
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
  export default {
    name: 'GokbUuidField',
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
      messages () {
        return this.copied ? [this.$i18n.t('component.general.uuid.copy.success')] : []
      },
      urlBase () {
        return process.env.VUE_APP_BASE_URL
      }
    },
    methods: {
      copyUrl () {
        const url = process.env.VUE_APP_BASE_URL + this.path + '/' + this.modelValue
        navigator.clipboard.writeText(url)
        this.copied = true
      }
    }
  }
</script>
