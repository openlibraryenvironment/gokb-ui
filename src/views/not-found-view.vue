<template>
  <v-row>
    <v-col cols="12">
      <v-row
        align="center"
        justify="center"
      >
        <h1>{{ $t('default.404.title') }}</h1>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <h3>{{ $t('default.404.text') }}</h3>
      </v-row>
      <v-row
        align="center"
        justify="center"
        class="ma-5"
      >
        <router-link to="/">
          <v-img
            src="img/logo.png"
            width="300"
          />
        </router-link>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'NotFoundView',
    extends: BaseComponent
  }
</script>
