<template>
  <gokb-page
    :title="$t('component.user.register')"
  >
    <iframe
      id="register-embed"
      frameborder="0"
      style="width:1000px;min-height:600px;border:0px"
      :src="link"
    />
  </gokb-page>
</template>

<script>
  export default {
    name: 'RegisterView',
    computed: {
      link () {
        return `${import.meta.env.VITE_API_BASE_URL}/register/start?embed=true&lang=${this.$i18n.locale}`
      }
    }
  }
</script>
