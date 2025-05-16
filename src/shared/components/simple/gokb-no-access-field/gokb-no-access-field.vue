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
          <h1 id="title-no-access">{{ $t('default.401.title') }}</h1>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <h3>{{ $t('default.401.text') }}</h3>
        </v-row>
      </v-col>
    </v-row>
  </gokb-page>
</template>

<script>
  export default {
    name: 'GokbNoAccessField',
    computed: {
      logoPath () {
        return this.$vuetify.theme.name === 'dark' ? './img/logo_dark.svg' : './img/logo_light.svg'
      }
    }
  }
</script>
