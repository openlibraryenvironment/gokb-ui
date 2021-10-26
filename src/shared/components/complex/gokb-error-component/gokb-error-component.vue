<template>
  <span v-if="value">
    <v-btn
      absolute
      color="error"
      fab
      right
      small
      @click="toggleShow"
    >
      <v-icon>mdi-alert-circle</v-icon>
    </v-btn>
    <v-dialog v-model="show">
      <v-card class="elevation-12">
        <v-toolbar color="error">
          <v-toolbar-title>Fehler</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="text-h6">Message</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <code>{{ message }}</code>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="text-h6">Stack</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <code>{{ stack }}</code>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="text-h6">Config</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <vue-json-pretty :data="config" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="text-h6">Request</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <vue-json-pretty :data="request" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="text-h6">Response</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <vue-json-pretty :data="response" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="error"
            @click="toggleShow"
          >
            {{ $t('btn.close') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'GokbErrorComponent',
    components: { VueJsonPretty },
    props: {
      value: {
        type: Error,
        required: false,
        default: undefined,
      },
    },
    data () {
      return {
        show: false,
      }
    },
    computed: {
      config () {
        return this.value?.config
      },
      request () {
        return this.value?.toJSON()
      },
      response () {
        return this.value?.response
      },
      message () {
        return this.value?.response?.data?.ExceptionMessage || this.value?.stack
      },
      stack () {
        return this.value?.response?.data?.StackTrace || this.value?.stack
      }
    },
    methods: {
      toggleShow () {
        this.show = !this.show
      }
    }
  }
</script>
