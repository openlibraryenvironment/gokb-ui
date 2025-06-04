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
        <v-col><h4>{{ $t('popups.preset.choosePackage.label') }}</h4></v-col>
      </v-row>

      <v-row v-show="!presetDataIsLoading">
       <v-col cols="8">
        <gokb-search-package-field
          :label="$t('popups.preset.choosePackage.searchFieldLabel')"
          v-model="packageId"
        />

       </v-col>

        <v-col>{{ $t('popups.preset.choosePackage.advice') }}</v-col>
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
            <span>{{ $t('popups.preset.loading') }} </span>
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
              {{ $t('popups.preset.choosePackage.packageExistsMessage') }}
            </span>
            </v-col>
          </v-row>
          <br/>

          <v-row>
            <v-col><h3>{{ $t('popups.preset.transferValues.static') }}</h3></v-col>
          </v-row>

          <br/>

          <v-table density="compact">
            <thead>
            <tr>
              <th class="text-left">
                {{ $t('popups.preset.tableHead.field') }}
              </th>
              <th class="text-left">
                {{ $t('popups.preset.tableHead.value') }}
              </th>
              <th class="text-left">
                {{ $t('popups.preset.tableHead.accept') }}
              </th>

            </tr>
            </thead>
            <tbody>
            <tr

            >
              <td>{{ $t('component.types.Org', 1) }}</td>
              <td>{{ packageTemplate.provider?.name }}</td>
              <td><gokb-checkbox-field
                v-model="acceptProvider"
              /></td>
            </tr>

            <tr>
              <td>{{ $t('component.types.Platform', 1) }}</td>
              <td>{{ packageTemplate.nominalPlatform?.name }}</td>
                <td>
                  <gokb-checkbox-field
                    v-model="acceptPlatform"
                  />
                </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.scope.label') }}</td>
              <td>{{ packageTemplate.scope?.name ? $t('component.package.scope.' + packageTemplate.scope?.name + '.label') : '' }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptScope"
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.contentType.label') }}</td>
              <td>{{ packageTemplate.contentType?.name ? $t('component.package.contentType.' + packageTemplate.contentType?.name + '.label') : '' }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptContentType"
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.global.label') }}</td>
              <td>{{ $t('component.package.global.' + packageTemplate.global?.name + '.label') }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptGlobal"
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.consistent') }}</td>
              <td>{{ packageTemplate.consistent?.name === 'Yes' ? $t('default.true') : $t('default.false') }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptConsistent"
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.fixed') }}</td>
              <td>{{ packageTemplate.fixed?.name === 'Yes' ? $t('default.true') : $t('default.false') }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptFixed"
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.breakable') }}</td>
              <td>{{ packageTemplate.breakable?.name === 'Yes' ? $t('default.true') : $t('default.false') }}</td>
              <td>
                <gokb-checkbox-field
                  v-model="acceptBreakable"
                />
              </td>
            </tr>

            </tbody>
          </v-table>

          <br/><br/><br/>

          <div>
            <!-- v-if="packageTemplate._embedded.ids.length > 0" -->
            <v-row><v-col><h4>{{ $t('popups.preset.transferValues.identifiers') }}</h4></v-col></v-row>
            <br/>
            <v-table density="compact">
              <thead>
              <tr>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.identifier') }}
                </th>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.value') }}
                </th>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.accept') }}
                </th>

              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(id, index) in packageTemplate._embedded.ids"
              >
                <td>{{ id.namespace.name }}</td>
                <td>{{ id.value }}</td>
                <td><gokb-checkbox-field
                  v-model="acceptIdentifier[index]"
                /></td>
              </tr>
              </tbody>
            </v-table>

          </div>


          <br/><br/><br/>

          <div>
            <v-row>
              <v-col><h4>{{ $t('popups.preset.transferValues.ddc') }} </h4></v-col>
              <v-col>
                <gokb-checkbox-field
                dense
                v-model="acceptDDC"
                :disabled="packageTemplate._embedded.subjects.length === 0"/>
              </v-col>
            </v-row>
            <br/>
            <v-table density="compact">
              <thead>
              <tr>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.scheme') }}
                </th>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.value') }}
                </th>

              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(subject, index) in packageTemplate._embedded.subjects"
              >
                <td>{{ subject.scheme.name }}</td>
                <td>{{ getLabelForDDC(subject.heading) }}</td>
                <td></td>
              </tr>
              </tbody>
            </v-table>
          </div>

              <br/><br/><br/>

              <div>
                <v-row>
                  <v-col><h4>{{ $t('popups.preset.transferValues.autoUpdate') }} </h4></v-col>
                  <v-col>
                    <gokb-checkbox-field
                      dense
                      v-model="acceptAutoUpdate"
                    />
                  </v-col>
                </v-row>
                <br/>
                <v-table density="compact">
                  <thead>
                  <tr>
                    <th class="text-left">
                      <!-- {{ $t('popups.preset.tableHead.scheme') }} -->
                      Feld
                    </th>
                    <th class="text-left">
                      <!-- {{ $t('popups.preset.tableHead.value') }} -->
                      Wert
                    </th>

                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>URL</td>
                      <!--
                      <td>{{ packageItem.source.url }}</td>
                      -->
                      <td>
                        <gokb-text-field
                          v-model="packageItem.source.url"
                          :style="!sourceUrlValid ? {'color': '#9c27b0'} : {}"
                        />
                        <!-- :rules="[rules.validSourceUrl]" -->
                      </td>
                    </tr>

                    <tr>
                      <td>Update-Zyklus</td>
                      <td>{{ packageTemplate._embedded.source.frequency.name }}</td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>title_id Monograph</td>
                      <td>{{ packageTemplate._embedded.source.titleIdMonograph }}</td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>title_id Serial</td>
                      <td>{{ packageTemplate._embedded.source.titleIdSerial }}</td>
                      <td></td>
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
import ddcModel from "../../models/ddc-model/index.js";
import GokbTextField from "../../components/base/gokb-text-field/gokb-text-field.vue";

export default {
  name: 'GokbCreatePackageWithPresetsPopup',
  components: {GokbTextField, GokbSection, GokbSearchPackageField},
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
      acceptFixed: true,
      acceptIdentifier: [],
      acceptDDC: true,
      acceptAutoUpdate: true,
      sourceUrlValid: false,
      /* rules: {
        validSourceUrl: [
          (value) => {
            if (value.length > 5) {
              return true
            }
            return "Nope"
          }
        ]
      } */
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
      return this.$i18n.t('popups.preset.label')
    },
    packageName() {
      return this.packageItem.name
    },
    sourceUrl() {
      return this.packageItem.source?.url
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
      if(!!val) {
        this.checkIfPackageNameIsValid()
      }
    },
    sourceUrl (value) {
      if(!!value) {
        this.checkIfSourceUrlIsValid()
      }
    }
  },
  async created () {
    // this.loadPresets()

  },
  methods: {
    async checkIfSourceUrlIsValid() {
      console.log("check Source URL...")
      let valid = true

      /* funktioniert nicht, da im Datenmodell offenbar nicht das Source-Objekt selber,
      * sondern lediglich eine Referenz auf das Source-Obj gespeichert wird */
      let urlToCheck = this.packageItem.source.url
      let oldUrl = this.packageTemplate._embedded?.source?.url

      console.log("new: ", urlToCheck, " old: ", oldUrl)

      if (urlToCheck === oldUrl) {
        console.log("URL not changed")
        valid = false
      } else {
        const validationResult = await genericServices('rest/entities').checkUrl(urlToCheck, true, this.cancelToken.token)

        console.log("URL VALIDATIONSERVICE: ", validationResult)
        if (validationResult.data?.result === 'ERROR') {
          valid = false
        }
      }

      this.sourceUrlValid = valid
      console.log("Source URL ", valid)
    },
    getLabelForDDC(id) {
      return ddcModel.getDdcLabel(id, this.$i18n.locale)
    },
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

      let ids = []
      for(var i = 0; i < this.packageItem.ids.length; i++){
        if(this.acceptIdentifier[i]){
          let id_tmp = this.packageItem.ids[i]
          let identifier = {
            id: id_tmp.id,
            value: id_tmp.value,
            namespace: id_tmp.namespace.value,
            nslabel: id_tmp.namespace.name
          }
          ids.push(identifier)
        }
      }
      pckg.ids = ids

      let subjects = []
      if(this.acceptDDC){
         subjects = this.packageItem.subjects
      }
      pckg.subjects = subjects

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
      this.packageItem.subjects = this.packageTemplate._embedded.subjects
      this.packageItem.source = this.packageTemplate._embedded.source

      console.log("SOURCE: ", this.packageItem.source)

      // set default to accept all identifiers
      for (var i = 0; i < this.packageItem.ids.length; i++) {
        this.acceptIdentifier[i] = true
      }



      console.log("****** ", this.packageItem)
    }
  }


}
</script>
