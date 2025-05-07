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
        <v-col><h4>Wählen Sie das Paket, dessen Werte Sie übernehmen möchten.</h4></v-col>
      </v-row>

      <v-row v-show="!presetDataIsLoading">
       <v-col cols="8">
        <gokb-search-package-field
          label="Paket-Vorlage"
          v-model="packageId"
        />

       </v-col>

        <v-col>Sie können nach dem Namen des Pakets, oder nach dem exakten Wert eines Paket-Identifikators suchen.</v-col>
      </v-row>

      <div v-if="presetDataIsLoading">
        <v-row justify="end">
          <v-col cols="6">
            <v-progress-circular
              color="primary"
              size="100"
              width="8"
              indeterminate
            />
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-row justify="end">
          <v-col cols="6">
            <span>{{ $t('popups.externalSourceImport.loading') }} </span>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </div>

    </gokb-section>

<!--      <br/><br/><br/> -->


      <div v-if="presetDataLoaded">
        <gokb-section>

          <v-row>
            <v-col cols="9">
              <gokb-text-field
                v-model="packageItem.name"
                :label="$t('popups.externalSourceImport.packageName')"
              />
              <span v-if="!packageNameValid" style="color:red">
              <v-icon class="pb-1" color="error">
                mdi-close-thick
              </v-icon>
              Ändern Sie bitte den Namen des Pakets.
            </span>
            </v-col>
          </v-row>
          <br/>

          <v-row>
            <v-col><h3>Folgende Werte können Sie übernehmen</h3></v-col>
          </v-row>

          <br/>

          <v-table density="compact">
            <thead>
            <tr>
              <th class="text-left">
                Feld
              </th>
              <th class="text-left">
                Wert
              </th>
              <th class="text-left">
               Übernehmen?
              </th>

            </tr>
            </thead>
            <tbody>
            <tr

            >
              <td>Anbieter</td>
              <td>{{ packageTemplate.provider?.name }}</td>
              <td><gokb-checkbox-field
                v-model="acceptProvider"
              /></td>
            </tr>

            <tr>
              <td>Plattform</td>
              <td>{{ packageTemplate.nominalPlatform?.name }}</td>
                <td>
                  <gokb-checkbox-field
                    v-model="acceptPlatform"
                  />
                </td>
            </tr>

            <tr>
              <td>Pakettyp</td>
              <td>{{ packageTemplate.scope?.name }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptScope"
                />
              </td>
            </tr>

            <tr>
              <td>Inhaltstyp</td>
              <td>{{ packageTemplate.contentType?.name }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptContentType"
                />
              </td>
            </tr>

            <tr>
              <td>Gültigkeit</td>
              <td>{{ packageTemplate.global?.name }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptGlobal"
                />
              </td>
            </tr>

            <tr>
              <td>Paketinhalt einheitlich</td>
              <td>{{ packageTemplate.consistent?.name }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptConsistent"
                />
              </td>
            </tr>

            <tr>
              <td>Einzeltitelauswahl möglich</td>
              <td>{{ packageTemplate.fixed?.name }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptFixed"
                />
              </td>
            </tr>

            <tr>
              <td>Paket unveränderbar</td>
              <td>{{ packageTemplate.breakable?.name }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptBreakable"
                />
              </td>
            </tr>

            </tbody>
          </v-table>

          <br/><br/><br/>

          <div v-if="packageTemplate._embedded.ids.length > 0">
            <v-row><v-col><h4>Folgende Identifikatoren können Sie übernehmen</h4></v-col></v-row>
            <br/>
            <v-table density="compact">
              <thead>
              <tr>
                <th class="text-left">
                  Identifikator
                </th>
                <th class="text-left">
                  Wert
                </th>
                <th class="text-left">
                  Übernehmen?
                </th>

              </tr>
              </thead>
              <tbody>
              <tr
                v-for="id in packageTemplate._embedded.ids"
              >
                <td>{{ id.namespace.name }}</td>
                <td>{{ id.value }}</td>
                <td><gokb-checkbox-field
                  v-model="acceptProvider"
                /></td>
              </tr>
              </tbody>
            </v-table>

          </div>
      </gokb-section>
      </div>

    <template #buttons>
      <v-spacer />

      <gokb-button
        v-if="presetDataLoaded"
        :disabled="!packageNameValid"
        is-submit
      >
        {{ $t('btn.submit') }}
      </gokb-button>
    </template>

  </gokb-dialog>
</template>

<script>
import BaseComponent from "@/shared/components/base-component"
import GokbSearchPackageField from "../../components/simple/gokb-search-package-field/gokb-search-package-field.vue";
import packageServices from "@/shared/services/package-services"
import genericServices from "@/shared/services/generic-entity-services"
import GokbSection from "../../components/complex/gokb-section/gokb-section.vue";

export default {
  name: 'GokbCreatePackageWithPresetsPopup',
  components: {GokbSection, GokbSearchPackageField},
  extends: BaseComponent,
  emits: ['update:model-value', 'loadPresets'],
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: undefined,
      messageColor: undefined,
      currentSnackBarTimeout: '-1',
      presetDataLoaded: false,
      presetDataIsLoading: false,
      packageId: undefined,
      packageNameValid: false,
      packageItem: {

      },
      packageTemplate: {

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
    },
    packageName() {
      return this.packageItem.name
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
    },
    packageId () {
      console.log("******** ", this.packageId)
      if (this.packageId) {
        this.loadPackageTemplate()
      } else {
        this.presetDataLoaded = false
        this.packageTemplate = undefined
      }
    },
    packageName (val) {
      if(val) {
        this.checkIfPackageNameIsValid()
      }
    }
  },
  async created () {
    // this.loadPresets()
  },
  methods: {
    async checkIfPackageNameIsValid() {
      let response = await genericServices('rest/entities').checkNewName(
        encodeURIComponent(this.packageItem.name),
        'Package',
        this.cancelToken.token
      )

      if (response?.status < 400) {
        if (response.data.result === 'ERROR') {
          this.packageNameValid = false
          return false
        }
      }

      this.packageNameValid = true
      return true
    },
    async loadPackageTemplate () {
      if (this.packageId) {
        this.presetDataIsLoading = true
        let result = await packageServices.get(this.packageId, this.cancelToken.token)

        if (result?.data) {
          this.packageTemplate = result.data
          console.log("PACKAGE-TEMPLATE: ", this.packageTemplate)
          this.loadPresets()
        }
        this.presetDataIsLoading = false
        this.presetDataLoaded = true
      }
    },
    submit () {
      console.log("+++ submit +++")
      const pckg = {
        presetId: this.packageId,
        provider: this.packageItem.provider,
        platform: this.packageItem.nominalPlatform,
        name: this.packageItem.name,
        scope: this.packageItem.scope,
        contentType: this.packageItem.contentType,
        global: this.packageItem.global,
        consistent: this.packageItem.consistent.name !== 'No' ,
        breakable: this.packageItem.breakable.name !== 'No',
        fixed: this.packageItem.fixed.name !== 'No'
      }

      this.$emit("loadPresets", pckg)

    },
    async loadPresets () {
      console.log("***** CREATED ****** ", this.packageTemplate)
      this.packageItem.name = this.packageTemplate.name
      this.packageItem.provider = this.packageTemplate.provider
      this.packageItem.nominalPlatform = this.packageTemplate.nominalPlatform
      this.packageItem.scope = this.packageTemplate.scope
      this.packageItem.contentType = this.packageTemplate.contentType
      this.packageItem.global = this.packageTemplate.global
      this.packageItem.consistent =  this.packageTemplate.consistent
      this.packageItem.breakable = this.packageTemplate.breakable
      this.packageItem.fixed = this.packageTemplate.fixed
      this.packageItem.ids = this.packageTemplate._embedded.ids

      console.log("****** ", this.packageItem)
    }
  }


}
</script>
