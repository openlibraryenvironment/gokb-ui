<template>
  <gokb-dialog
    v-model="localValue"
    width="700"
    :title="$t('component.user.register')"
  >
    <v-alert type="info">
      <i18n v-if="!!mail" path="popups.register.info">
        <template slot:0>
          <a :href="'mailto:' + mail">{{ mail }}</a>
        </template>
      </i18n>
      <i18n v-else path="popups.register.nomail" />
    </v-alert>
    <iframe
      id="register-embed"
      frameborder="0"
      style="width:100%;min-height:600px;border:0px"
      :src="link"
    />
    <template #buttons>
      <v-spacer />
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
      value: {
        type: Boolean,
        required: true,
        default: false
      },
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
      link () {
        return `${process.env.VUE_APP_API_BASE_URL}/register/start?embed=true&lang=${this.$i18n.locale}`
      },
      mail () {
        return process.env.VUE_APP_CONTACT_EMAIL
      }
    },
    methods: {
      close () {
        this.localValue = false
      }
    }
  }
</script>
