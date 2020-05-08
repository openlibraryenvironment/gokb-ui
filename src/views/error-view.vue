<template>
  <v-row>
    <v-col cols="12">
      <v-row
        align="center"
        justify="center"
      >
        <h1>Fehler</h1>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <h3>{{ errorModel || 'Unbekannter Fehler aufgetreten.' }}</h3>
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
  import errorModel from '@/shared/models/error-model'

  export default {
    extends: BaseComponent,
    data () {
      return {
        errorModel: errorModel.get(),
      }
    }
  }
</script>
