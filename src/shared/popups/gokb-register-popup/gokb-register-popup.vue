<template>
  <gokb-dialog
    v-model="localValue"
    width="700"
    :title="$t('component.user.register')"
  >
    <v-alert type="info">
      <i18n-t v-if="!!mail" keypath="popups.register.info">
          <a :href="'mailto:' + mail" class="text-primary">{{ mail }}</a>
      </i18n-t>

      <i18n-t v-else path="popups.register.nomail" />
    </v-alert>
    <iframe
      id="register-embed"
      frameborder="0"
      style="width:100%;min-height:650px;border:0px"
      :src="link"
    />
    <v-spacer />
    <template #buttons>
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.close') }}
      </gokb-button>
    </template>
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
      },
      mail () {
        return import.meta.env.VITE_CONTACT_EMAIL
      }
    },
    methods: {
      close () {
        this.localValue = false
      }
    }
  }
</script>
