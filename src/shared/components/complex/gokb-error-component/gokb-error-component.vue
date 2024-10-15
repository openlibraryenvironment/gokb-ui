<template>
  <span v-if="modelValue && showDetails">
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
          <v-toolbar-title>{{ $tc('error.label') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div class="my-6">
            <vue-json-pretty :data="response.data" />
          </div>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="text-h6">Details</div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <div class="text-h6">Request</div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <vue-json-pretty :data="request" />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <div class="text-h6">Response</div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <vue-json-pretty :data="response" />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
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
  import accountModel from '@/shared/models/account-model'

  export default {
    name: 'GokbErrorComponent',
    components: { VueJsonPretty },
    props: {
      modelValue: {
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
        return this.modelValue?.config
      },
      request () {
        return this.modelValue?.toJSON()
      },
      response () {
        return this.modelValue?.response
      },
      message () {
        return this.modelValue?.response?.data?.ExceptionMessage || this.modelValue?.stack
      },
      stack () {
        return this.modelValue?.response?.data?.StackTrace || this.modelValue?.stack
      },
      showDetails() {
        return accountModel.loggedIn() && accountModel.hasRole('ROLE_SUPERUSER')
      }
    },
    methods: {
      toggleShow () {
        this.show = !this.show
      }
    }
  }
</script>
