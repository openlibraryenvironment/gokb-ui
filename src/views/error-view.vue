<template>
  <gokb-page title="">
    <v-row>
      <v-col cols="12">
        <v-row
          align="center"
          justify="center"
          class="ma-5"
        >
          <router-link to="/">
            <v-img
              :src="logoPath"
              max-height="350"
              class="my-8"
              contain
            />
          </router-link>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <h1>{{ $t('error.general.500') }}</h1>
        </v-row>
      </v-col>
    </v-row>
  </gokb-page>
</template>

<script>
  export default {
    name: 'ErrorView',
    computed: {
      logoPath () {
        return this.$vuetify.theme.name === 'dark' ? './img/logo_dark.svg' : './img/logo_light.svg'
      }
    }
  }
</script>
