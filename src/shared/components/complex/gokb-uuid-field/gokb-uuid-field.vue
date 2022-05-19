<template>
  <v-text-field
    :value="value"
    :label="label"
    :messages="messages"
    :dense="dense"
    disabled
    readonly
  >
    <template v-slot:append-outer>
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
      value: {
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
      }
    },
    methods: {
      copyUrl () {
        const url = process.env.VUE_APP_API_BASE_URL + this.path + '/' + this.value
        navigator.clipboard.writeText(url)
        this.copied = true
      }
    }
  }
</script>
