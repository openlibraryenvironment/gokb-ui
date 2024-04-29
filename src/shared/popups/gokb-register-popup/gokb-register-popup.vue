<template>
  <gokb-dialog
    v-model="localValue"
    width="500"
    :title="$t('component.user.register')"
  >
    <v-alert type="info">
      <i18n-t keypath="popups.register.info">
        <template #mail>
          <a href="mailto:info@gokb.org">info@gokb.org</a>
        </template>
      </i18n-t>
    </v-alert>
    <iframe
      id="register-embed"
      frameborder="0"
      style="width:100%;min-height:600px;border:0px"
      :src="link"
    />
    <v-spacer />
    <div>
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.close') }}
      </gokb-button>
    </div>
  </gokb-dialog>
</template>

<script>
  export default {
    name: 'GokbRegisterPopup',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
        default: false
      },
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
      link () {
        return `${import.meta.env.VITE_API_BASE_URL}/register/start?embed=true&lang=${this.$i18n.locale}`
      }
    },
    methods: {
      close () {
        this.localValue = false
      }
    }
  }
</script>
