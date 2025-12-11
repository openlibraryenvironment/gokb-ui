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

    <gokb-section v-show="!isFromEditRoute">

      <v-row>
        <v-col><h4>{{ $t('popups.preset.choosePackage.label') }}</h4></v-col>
      </v-row>

      <v-row v-show="!presetDataIsLoading && !isFromEditRoute">
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


      <div v-if="presetDataLoaded">
        <gokb-section>

          <v-row>
            <v-col cols="9">
              <gokb-text-field
                v-model="packageItem.name"
                :label="packageNameValid ? $t('popups.preset.choosePackage.packageName') : ''"
                :style="!packageNameValid ? {'color': 'red'} : {}"
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
            <v-col><span class="text-h5">{{ $t('popups.preset.transferValues.general') }}</span></v-col>
          </v-row>
          <v-row>
            <v-col><span class="text-subtitle-1">{{ $t('popups.preset.transferValues.static') }}</span></v-col>
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
              <th class="text-left" style="width:15px;">
                {{ $t('popups.preset.tableHead.accept') }}
              </th>

            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ $t('component.types.Org', 1) }}</td>
              <td>{{ packageTemplate.provider?.name }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptProvider"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.types.Platform', 1) }}</td>
              <td>{{ packageTemplate.nominalPlatform?.name }}</td>
                <td>
                  <gokb-checkbox-field
                    dense
                    v-model="acceptPlatform"
                    hide-details
                  />
                </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.description') }}</td>
              <td>{{ packageTemplate.description }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptDescription"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.descriptionUrl') }}</td>
              <td>{{ packageTemplate.descriptionURL }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptDescriptionURL"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.startYear.label') }}</td>
              <td>{{ packageTemplate.startYear }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptStartYear"
                  hide-details
                />
              </td>
            </tr>

            <tr v-if="packageTemplate.endYear">
              <td>{{ $t('component.package.endYear.label') }}</td>
              <td>{{ packageTemplate.endYear }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptEndYear"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.scope.label') }}</td>
              <td>{{ packageTemplate.scope?.name ? $t('component.package.scope.' + packageTemplate.scope?.name + '.label') : '' }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptScope"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.contentType.label') }}</td>
              <td>{{ packageTemplate.contentType?.name ? $t('component.package.contentType.' + packageTemplate.contentType?.name + '.label') : '' }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptContentType"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.global.label') }}</td>
              <td>{{ $t('component.package.global.' + packageTemplate.global?.name + '.label') }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptGlobal"
                  hide-details
                />
              </td>
            </tr>

            <tr v-if="packageTemplate.global?.name === 'Consortium'">
              <td>{{ $t('component.package.globalNote.label') }}</td>
              <td>{{ packageTemplate.globalNote }}</td>
              <td>
                <gokb-checkbox-field
                  dense
                  v-model="acceptGlobalNote"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.consistent') }}</td>
              <td>{{ packageTemplate.consistent?.name === 'Yes' ? $t('default.true') : $t('default.false') }}</td>
              <td>
                <gokb-checkbox-field dense
                  v-model="acceptConsistent"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.fixed') }}</td>
              <td>{{ packageTemplate.fixed?.name === 'Yes' ? $t('default.true') : $t('default.false') }}</td>
              <td>
                <gokb-checkbox-field dense
                  v-model="acceptFixed"
                  hide-details
                />
              </td>
            </tr>

            <tr>
              <td>{{ $t('component.package.breakable') }}</td>
              <td>{{ packageTemplate.breakable?.name === 'Yes' ? $t('default.true') : $t('default.false') }}</td>
              <td>
                <gokb-checkbox-field dense
                  v-model="acceptBreakable"
                  hide-details
                />
              </td>
            </tr>

            </tbody>
          </v-table>

          <br/><br/><br/>

          <div>
            <v-row><v-col><span class="text-h5">{{ $t('popups.preset.transferValues.identifiers') }}</span></v-col></v-row>
            <br/>
            <v-table density="compact" >
              <thead>
              <tr>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.identifier') }}
                </th>
                <th class="text-left">
                  {{ $t('popups.preset.tableHead.value') }}
                </th>
                <th class="text-left" style="width:15px;">
                  {{ $t('popups.preset.tableHead.accept') }}
                </th>

              </tr>
              </thead>
              <tbody v-if="packageTemplate._embedded.ids?.length > 0">
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
              <tbody v-else><tr><td/><td>{{ $t('default.table.noData.props') }}</td><td/></tr></tbody>

            </v-table>

          </div>


          <br/><br/><br/>

          <div>
            <v-row>
              <v-col><span class="text-h5">{{ $t('popups.preset.transferValues.ddc') }} </span></v-col>
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
                <th class="text-left" style="width:15px;">
                </th>
              </tr>
              </thead>
              <tbody v-if="packageTemplate._embedded.subjects?.length > 0">
              <tr
                v-for="(subject, index) in packageTemplate._embedded.subjects"
              >
                <td>{{ subject.scheme.name }}</td>
                <td>{{ getLabelForDDC(subject.heading) }}</td>
                <td></td>
              </tr>
              </tbody>
              <tbody v-else><tr><td/><td>{{ $t('default.table.noData.props') }}</td><td/></tr></tbody>
            </v-table>
            <br/>
            <v-row v-if="packageTemplate._embedded.subjects?.length > 0">
              <v-col cols="2"><span >{{ $t('popups.preset.adopt.ddc') }}</span></v-col>
              <v-col>
                <gokb-checkbox-field
                  dense
                  v-model="acceptDDC"
                  />
              </v-col>
            </v-row>
          </div>

              <br/><br/><br/>

              <div>
                <v-row>
                  <v-col><span class="text-h5">{{ $t('popups.preset.transferValues.autoUpdate') }} </span></v-col>
                </v-row>

                <br/>

                <v-row>
                  <v-col>
                    <gokb-text-field
                      v-model="packageItem.source.url"
                      :style="acceptAutoUpdate && !sourceUrlValid ? {'color': 'red'} : {}"
                      :disabled="sourceIsExcluded"
                      label="URL"
                    />

                    <span v-if="acceptAutoUpdate && !sourceUrlValid" style="color:red">
                      <v-icon class="pb-1" color="error">
                        mdi-close-thick
                      </v-icon>
                      {{ $t('popups.preset.warning.urlExists') }}
                    </span>

                  </v-col>
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
                    <th class="text-left" style="width:15px;">
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ $t('component.source.frequency.label') }}</td>
                      <td>{{ packageTemplate._embedded.source.frequency ? $t('component.source.frequency.' + packageTemplate._embedded.source.frequency.name + '.label') : ''}}</td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>{{ $t('kbart.propIdMonograph.label') }}</td>
                      <td>{{  packageTemplate._embedded.source.titleIdMonograph?.name }}</td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>{{ $t('kbart.propIdSerial.label') }}</td>
                      <td>{{ packageTemplate._embedded.source.titleIdSerial?.name }}</td>
                      <td></td>
                    </tr>
                  </tbody>

            </v-table>
            <br/>
            <v-row v-if="sourceIsExcluded">
              <v-col>
                <v-alert
                  type="warning"
                  class="text-body-2"
                >
                  {{ $t('popups.preset.warning.externalSourceExcluded') }}
                </v-alert>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <gokb-checkbox-field
                  v-model="acceptAutoUpdate"
                  :label="$t('popups.preset.adopt.autoUpdate')"
                />
              </v-col>
            </v-row>

          </div>

      </gokb-section>
      </div>

    <template #buttons>
      <v-spacer />
      <gokb-button
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>

      <gokb-button
        v-if="presetDataLoaded"
        :disabled="!isValid"
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
import {CREATE_PACKAGE_ROUTE} from "../../../router/route-paths.js";

export default {
  name: 'GokbCreatePackageWithPresetsPopup',
  components: {GokbTextField, GokbSection, GokbSearchPackageField},
  extends: BaseComponent,
  emits: ['update:model-value', 'loadPresets'],
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    packagePreset: {
      type: Object,
      required: false
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
      acceptDescription: true,
      acceptDescriptionURL: true,
      acceptGlobalNote: true,
      acceptStartYear: false,
      acceptEndYear: false,
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
      isFromEditRoute: false,
      sourceIsExcluded: false
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
      return this.$i18n.t('popups.preset.label')
    },
    packageName() {
      return this.packageItem.name
    },
    sourceUrl() {
      return this.packageItem.source?.url
    },
    sourceUrlVal() {
      return this.sourceUrlValid
    },
    isValid() {
      return this.packageNameValid && (!this.acceptAutoUpdate || this.sourceUrlValid)
    }
  },
  watch: {
    acceptAutoUpdate () {
      this.checkIfSourceUrlIsValid()
    },
    packageId () {
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
    if (!!this.packagePreset?.id) {
      this.packageId = this.packagePreset.id
      this.isFromEditRoute = true
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.localValue = false
    },
    async checkIfSourceUrlIsValid() {
      let valid = true

      let urlToCheck = this.packageItem.source.url
      let oldUrl = this.packageTemplate._embedded?.source?.url

      if (urlToCheck === oldUrl) {
        valid = false
      } else {
        const validationResult = await genericServices('rest/entities').checkUrl(urlToCheck, true, this.cancelToken.token)

        if (validationResult.data?.result === 'ERROR') {
          valid = false
        }
      }

      this.sourceUrlValid = valid

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
          this.loadPresets()
        }
        this.presetDataIsLoading = false
        this.presetDataLoaded = true
      }
    },
    submit () {
      const pckg = {
        provider: this.acceptProvider ? this.packageItem.provider : undefined,
        platform: this.acceptPlatform ? this.packageItem.nominalPlatform : undefined,
        name: this.packageItem.name,
        scope: this.acceptScope ? this.packageItem.scope : undefined,
        contentType: this.acceptContentType ? this.packageItem.contentType : undefined,
        global: this.acceptGlobal ? this.packageItem.global : undefined,
        consistent: this.acceptConsistent ? this.packageItem.consistent.name !== 'No' : undefined,
        breakable: this.acceptBreakable ? this.packageItem.breakable.name !== 'No' : undefined,
        fixed: this.acceptFixed ? this.packageItem.fixed.name !== 'No' : undefined,
        description: this.acceptDescription ? this.packageItem.description : undefined,
        descriptionURL: this.acceptDescriptionURL ? this.packageItem.descriptionURL : undefined,
        startYear: this.acceptStartYear ? this.packageItem.startYear : undefined,
        endYear: this.acceptEndYear ? this.packageItem.endYear : undefined,
        globalNote: this.acceptGlobalNote ? this.packageItem.globalNote : undefined,
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

      let source = undefined
      if(this.acceptAutoUpdate) {
        source = {
          url: this.packageItem.source.url,
          frequency: this.packageItem.source.frequency?.id,
          titleIdMonograph: this.packageItem.source.titleIdMonograph,
          titleIdSerial: this.packageItem.source.titleIdSerial,
          automaticUpdates: true
        }
      }
      pckg.source = source

      if ( this.isFromEditRoute ) {
        localStorage.setItem("PackagePreset", JSON.stringify(pckg))
        this.$router.push({
            name: CREATE_PACKAGE_ROUTE,
            state: {
              loadPresets: 'true'
            }
          })

      } else {
        this.$emit("loadPresets", pckg)
      }
    },
    async loadPresets () {
      this.packageItem.name = this.packageTemplate.name
      this.packageItem.provider = this.packageTemplate.provider
      this.packageItem.nominalPlatform = this.packageTemplate.nominalPlatform
      this.packageItem.description = this.packageTemplate.description
      this.packageItem.descriptionURL = this.packageTemplate.descriptionURL
      this.packageItem.startYear = this.packageTemplate.startYear
      this.packageItem.endYear = this.packageTemplate.endYear
      this.packageItem.globalNote = this.packageTemplate.globalNote
      this.packageItem.scope = this.packageTemplate.scope
      this.packageItem.contentType = this.packageTemplate.contentType
      this.packageItem.global = this.packageTemplate.global
      this.packageItem.consistent =  this.packageTemplate.consistent
      this.packageItem.breakable = this.packageTemplate.breakable
      this.packageItem.fixed = this.packageTemplate.fixed
      this.packageItem.ids = this.packageTemplate._embedded.ids
      this.packageItem.subjects = this.packageTemplate._embedded.subjects

      this.packageItem.source = {}
      this.packageItem.source.url = this.packageTemplate._embedded.source.url
      // assigning object reference is ok here, because title_id objects and
      // frequency object are not going to be manipulated
      this.packageItem.source.titleIdMonograph = this.packageTemplate._embedded.source.titleIdMonograph
      this.packageItem.source.titleIdSerial = this.packageTemplate._embedded.source.titleIdSerial
      this.packageItem.source.frequency = this.packageTemplate._embedded.source.frequency

      // set default to accept all identifiers
      for (var i = 0; i < this.packageItem.ids.length; i++) {
        this.acceptIdentifier[i] = true
      }

      const excludedSources = ["WEKB", "EZB"]
      if ( excludedSources.includes(this.packageTemplate._embedded.source.importConfig?.name)) {
        this.sourceIsExcluded = true
      }

      //remove toggles for not existent and not allowed preset values
      if (this.packageTemplate._embedded.subjects.length === 0) {
        this.acceptDDC = false
      }
      if (!this.packageItem.source.url || this.sourceIsExcluded) {
        this.acceptAutoUpdate = false
      }
      if (!this.packageTemplate.scope?.id) {
        this.acceptScope = false
      }
      if (!this.packageTemplate.contentType?.id) {
        this.acceptContentType = false
      }
      if (!this.packageTemplate.global?.id) {
        this.acceptGlobal = false
      }
      if (!this.packageTemplate.consistent?.id) {
        this.acceptConsistent = false
      }
      if (!this.packageTemplate.breakable?.id) {
        this.acceptBreakable = false
      }
      if (!this.packageTemplate.fixed?.id) {
        this.acceptFixed = false
      }

    }
  }


}
</script>
