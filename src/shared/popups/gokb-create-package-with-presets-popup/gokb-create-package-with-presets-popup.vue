<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="1000"
    @submit="submit"
  >
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
      </template>
    </v-snackbar>

    <gokb-section>
      <v-row>
        <v-col>Provider: </v-col>
        <v-col>{{ packageTemplate.provider.name }}</v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptProvider"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Plattform: </v-col>
        <v-col>{{ packageTemplate.nominalPlatform.name }}</v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptPlatform"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Pakettyp: </v-col>
        <v-col>{{ packageTemplate.scope.name }}</v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptScope"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Inhaltstyp: </v-col>
        <v-col>{{ packageTemplate.contentType.name }}</v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptContentType"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Gültigkeit: </v-col>
        <v-col>{{ packageTemplate.global }}</v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptGlobal"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Paketinhalt einheitlich: </v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="packageTemplate.consistent"
          />
        </v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptConsistent"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Einzeltitelauswahl möglich: </v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="packageTemplate.fixed"
          />
        </v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptFixed"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>Paket unveränderbar: </v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="packageTemplate.breakable"
          />
        </v-col>
        <v-col>
          <gokb-checkbox-field
            v-model="acceptBreakable"
          />
        </v-col>
      </v-row>

    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button
        is-submit
      >
        {{ $t('btn.submit') }}
      </gokb-button>
    </template>
   <!--  <router-link
      :style="{ color: 'primary' }"
      :to="{ name: '/create-package', state: { 'packagePresets': packageItem } }"
    >
      {{ $t('btn.submit') }}
    </router-link> -->
  </gokb-dialog>
</template>

<script>
import BaseComponent from "@/shared/components/base-component"

export default {
  name: 'GokbCreatePackageWithPresetsPopup',
  extends: BaseComponent,
  emits: ['update:model-value'],
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    packageTemplate: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: undefined,
      messageColor: undefined,
      currentSnackBarTimeout: '-1',
      packageItem: {

      },
      acceptProvider: true,
      acceptPlatform: true,
      acceptContentType: true,
      acceptScope: true,
      acceptGlobal: true,
      acceptBreakable: true,
      acceptConsistent: true,
      acceptFixed: true
    }
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:model-value', val)
      }
    },
    header() {
      //return this.$i18n.t('popups.externalSourceImport.label')
      return 'Erstelle Paket mit Vorgabewerten'
    }
  },
  watch: {
    acceptProvider (acc) {
      if (acc) {
        this.packageItem.provider = this.packageTemplate.provider
      } else {
        this.packageItem.provider = undefined
      }
    },
    acceptPlatform (acc) {
      if (acc) {
        this.packageItem.nominalPlatform = this.packageTemplate.nominalPlatform
      } else {
        this.packageItem.nominalPlatform = undefined
      }
    },
    acceptScope (acc) {
      if (acc) {
        this.packageItem.scope = this.packageTemplate.scope
      } else {
        this.packageItem.scope = undefined
      }
    },
    acceptContentType (acc) {
      if (acc) {
        this.packageItem.contentType = this.packageTemplate.contentType
      } else {
        this.packageItem.contentType = undefined
      }
    },
    acceptGlobal (acc) {
      if (acc) {
        this.packageItem.global = this.packageTemplate.global
      } else {
        this.packageItem.global = undefined
      }
    },
    acceptBreakable (acc) {
      if (acc) {
        this.packageItem.breakable = this.packageTemplate.breakable
      } else {
        this.packageItem.breakable = undefined
      }
    },
    acceptConsistent (acc) {
      if (acc) {
        this.packageItem.consistent = this.packageTemplate.consistent
      } else {
        this.packageItem.consistent = undefined
      }
    },
    acceptFixed (acc) {
      if (acc) {
        this.packageItem.fixed = this.packageTemplate.fixed
      } else {
        this.packageItem.fixed = undefined
      }
    }
  },
  async created () {
    this.loadPresets()
  },
  methods: {
    submit () {
      console.log("+++ submit +++")

      this.$router.push({
        name: '/create-package',
        params: {
          packagePresets: this.packageItem
        }
      })

    },
    async loadPresets () {
      console.log("***** CREATED ****** ", this.packageTemplate.nominalPlatform)
      this.packageItem.provider = this.packageTemplate.provider
      this.packageItem.nominalPlatform = this.packageTemplate.nominalPlatform
      this.packageItem.scope = this.packageTemplate.scope
      this.packageItem.contentType = this.packageTemplate.contentType
      this.packageItem.global = this.packageTemplate.global
      this.packageItem.consistent =  this.packageTemplate.consistent
      this.packageItem.breakable = this.packageTemplate.breakable
      this.packageItem.fixed = this.packageTemplate.fixed

      console.log("****** ", this.packageItem)
    }
  }


}
</script>
