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
        <v-row >
          <v-col>
            <gokb-state-field
              v-model="externalSourceType"
              :label="$t('popups.externalSourceImport.selectLabel')"
              message-path="component.source.importConfig"
              url="refdata/categories/Source.ImportConfig"
              init-item="WEKB"
              return-object
              required
            />
          </v-col>
          <v-col>
            <gokb-text-field
              :label="$t('popups.externalSourceImport.uuidFieldLabel', [sourceLabel])"
              v-model="external_package_uuid"
              required
            />
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-col cols="2">
            <gokb-button
              v-if="!externalDataLoaded"
              :disabled="externalDataLoaded || !external_package_uuid || externalDataIsLoading"
              @click="fetchExternalSourcePackageData"
            >
              {{ $t('btn.submit') }}
            </gokb-button>
          </v-col>
        </v-row>
      <div v-if="externalDataIsLoading">
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

    <div v-if="externalDataLoaded">
      <v-row>
        <v-col cols="5"><h3>{{ $t('popups.externalSourceImport.columnHeaderExternal') }} </h3></v-col>
        <v-col cols="5"><h3>{{ $t('popups.externalSourceImport.columnHeaderInternal') }}</h3></v-col>
      </v-row>

      <v-row>
        <v-col><h4>{{ $t('component.general.name') }}: </h4></v-col>
      </v-row>

      <v-row>
        <v-col cols="5"><span>{{ externalPackageName }}</span></v-col>
        <v-col cols="5">
          <gokb-text-field
            v-model="packageName"
            :label="$t('popups.externalSourceImport.packageName')"
          />
          <span v-if="packageAlreadyExists" style="color:red">
            <v-icon class="pb-1" color="error">
              mdi-close-thick
            </v-icon>
            {{ $t('popups.externalSourceImport.error.packageExists') }}
          </span>
        </v-col>

        <v-col cols="2"></v-col>
      </v-row>

      <v-row>
        <v-col><h4>{{ $t('component.types.Platform') }}: </h4></v-col>
      </v-row>

      <v-row>
        <v-col cols="5"><span>{{ externalPlatformName }}</span><br/><span>{{ externalPlatformURL }}</span></v-col>
        <v-col cols="5" v-if="platformAlreadyExists">
          <gokb-text-field
            v-model="platformDisplay"
            :label="$t('component.types.Platform')"
            disabled
          />
          <span>
            <v-icon color="success">
              mdi-check-circle
            </v-icon>
          </span>
        </v-col>

        <v-col cols="5" v-else>
          <gokb-search-platform-field
            :label="$t('popups.externalSourceImport.searchPlatform')"
            v-model="platformObject"
            :readonly="false"
            return-object
            only-current
          />
        </v-col>
        <v-col cols="2">
          <gokb-checkbox-field
            v-if="!platformAlreadyExists"
            v-model="adaptPlatformData"
            :label="$t('popups.externalSourceImport.adaptSource')"
          />
        </v-col>
        <v-alert
          v-if="!platformAlreadyExists"
          type="info"
          class="text-body-2"
        >
          {{ $t('popups.externalSourceImport.error.platformExists') }}
        </v-alert>
      </v-row>

      <v-row>
        <v-col><span class="text-h4">{{ $t('component.types.Org') }}: </span></v-col>
      </v-row>
      <v-row>
        <v-col cols="5"><span>{{ externalProviderName }}</span></v-col>
        <v-col cols="5" v-if="providerAlreadyExists">
          <gokb-text-field
            v-model="providerName"
            :label="$t('component.types.Org')"
            :disabled="providerAlreadyExists"
          />
          <span>
            <v-icon color="success">
              mdi-check-circle
            </v-icon>
          </span>
        </v-col>

          <v-col cols="5" v-else>
            <gokb-search-organisation-field
              :label="$t('popups.externalSourceImport.searchProvider')"
              v-model="providerObject"
              :show-link="true"
              :readonly="false"
              return-object
            />
          </v-col>

          <v-col cols="2">
            <gokb-checkbox-field
              v-if="!providerAlreadyExists"
              v-model="adaptProviderData"
              :label="$t('popups.externalSourceImport.adaptSource')"
            />
          </v-col>
        <v-alert
          v-if="!providerAlreadyExists"
          type="info"
          class="text-body-2"
        >
          {{ $t('popups.externalSourceImport.error.providerExists') }}
        </v-alert>
      </v-row>

      <v-row>
        <v-col><span class="text-h4">{{ $t('popups.externalSourceImport.packageIdentifier') }}: </span></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span v-if="packageIdentifierExists">{{ $t('popups.externalSourceImport.packageIdentifierYes') }} <strong>{{ packageIdentifierValue }}</strong></span>
          <span v-else>{{ $t('popups.externalSourceImport.packageIdentifierNo') }}</span>
        </v-col>
      </v-row>

      <v-row v-if="packageIdentifierExists">
        <v-col cols="6">
          <span>
            {{ $t('popups.externalSourceImport.packageIdentifierSelect') }}
          </span>
        </v-col>
        <v-col cols="6" >
          <gokb-namespace-field
            v-model="packageIdentifier"
            target-type="Package"
            :label="$t('popups.externalSourceImport.packageIdentifier', 2)"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col><h3>{{ $t('popups.externalSourceImport.titleIdentifier') }}: </h3></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span>{{ $t('popups.externalSourceImport.titleIdentifierInfo') }}:</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" v-for="pubtype in identifierExamples"
          :data="pubtype"
          :key="pubtype.publicationType"
        >
          <v-row>
            <v-col cols="12">
              <h4> {{ pubtype.publicationType }} </h4>
            </v-col>
          </v-row>
          <v-row v-for="id in pubtype.identifiers"
            :data="id"
            :key="id.namespace"
          >
            <v-col cols="4">{{ id.namespace }}: </v-col>
            <v-col cols="8">{{ id.value }}</v-col>
          </v-row>
        </v-col>

      </v-row>
      <br/><br/>
      <v-row>
        <v-col cols="4">
          <span>{{ $t('popups.externalSourceImport.contentTypeInfo') }} <strong>{{ contentTypeOfTipps }}</strong>. <br/>
            {{ $t('popups.externalSourceImport.titleIdentifierInfoSelect') }}
          </span>
        </v-col>
        <v-col cols="4" v-if="showMonographNamespaceSelect">
          <gokb-namespace-field
            v-model="namespaceMonograph"
            target-type="Book"
            :label="$t('popups.externalSourceImport.titleIdNamespace', [$t('popups.externalSourceImport.monographs')])"
            exclude-isxn
            gokb-tooltip="kbart.propIdMonograph.tooltip"
          />
        </v-col>
        <v-col cols="4" v-if="showJournalNamespaceSelect">
          <gokb-namespace-field
            v-model="namespaceJournal"
            target-type="Journal"
            :label="$t('popups.externalSourceImport.titleIdNamespace', [$t('popups.externalSourceImport.serials')])"
            exclude-isxn
            gokb-tooltip="kbart.propIdSerial.tooltip"
          />
        </v-col>
      </v-row>
    </div>
    <template #buttons>
      <v-spacer />
      <gokb-button
        v-if="externalDataLoaded"
        :disabled="!valid"
        is-submit
      >
        {{ $t('btn.submit') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from "@/shared/components/base-component"
  import externalSourceImportServices from "@/shared/services/external-source-import-services"
  import platformServices from "@/shared/services/platform-services"
  import genericServices from "@/shared/services/generic-entity-services"
  import providerServices from "@/shared/services/provider-services"
  import genericEntityServices from "@/shared/services/generic-entity-services"
  import states from '@/shared/models/states-model'


  export default {
    name: 'GokbImportExternalSourcePackagePopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'import'],
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      importData: {
        type: Object,
        required: false,
      }
    },
    data () {
      return {
        providerObject: undefined,
        platformObject: undefined,
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1',
        external_package_uuid: undefined,
        externalDataLoaded: false,
        externalDataIsLoading: false,
        externalSourceType: undefined,
        adaptPlatformData: false,
        adaptProviderData: false,
        externalPackageName: "",
        packageName: "",
        externalPlatformName: "",
        externalPlatformURL: "",
        platformName: "",
        platformURL: "",
        internalPlatformId: undefined,
        externalProviderName: "",
        externalProviderHomepage: "",
        externalProviderUuid: "",
        providerName: "",
        internalProviderId: undefined,
        externalPlatformUuid: "",
        contentTypeOfTipps: "",
        contentTypeOfTippsCode: undefined,
        packageScope: undefined,
        packageDescription: undefined,
        packageDescriptionURL: undefined,
        packageGlobal: undefined,
        namespaceMonograph: undefined,
        namespaceJournal: undefined,
        titleCount: undefined,
        platformAlreadyExists: undefined,
        providerAlreadyExists: undefined,
        externalSourceInfo: {},
        packageAlreadyExists: false,
        identifierExamples: [],
        errors: {},
        errorMessages: [],
        packageIdentifierExists: false,
        packageIdentifier: undefined,
        packageIdentifierValue: undefined
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
        return this.$i18n.t('popups.externalSourceImport.label')
      },
      showMonographNamespaceSelect() {
        return (this.contentTypeOfTipps === "Book" || this.contentTypeOfTipps === "Mixed")
      },
      showJournalNamespaceSelect() {
        return (this.contentTypeOfTipps === "Journal" || this.contentTypeOfTipps === "Mixed")
      },
      valid() {
        return ( (this.providerAlreadyExists || (this.adaptProviderData || this.providerObject))
          && (this.platformAlreadyExists || (this.adaptPlatformData || this.platformObject))
          && this.externalDataLoaded && !this.packageAlreadyExists)
      },
      sourceLabel() {
        return this.externalSourceType ? this.$i18n.t('component.source.importConfig.' + this.externalSourceType?.value + '.label') : '...'
      },
      platformDisplay() {
        return this.platformName + ' (' + this.platformURL + ')'
      }
    },
    watch: {
      packageName (val) {
        if(val) {
          this.checkIfPackageExists()
        }
      }
    },
    methods: {
      async checkIfPackageExists() {

          let response = await genericServices('rest/entities').checkNewName(
            encodeURIComponent(this.packageName),
            'Package',
            this.cancelToken.token
          )

          if (response?.status < 400) {
            if (response.data.result === 'ERROR') {
              this.packageAlreadyExists = true
              return true
            }
          }

          this.packageAlreadyExists = false
          return false
      },
      async fetchExternalSourcePackageData() {
        this.externalDataIsLoading = true
        let result = null
        if (this.validatePackageUUID()) {
          try {
            const response = await this.catchError({
              promise: externalSourceImportServices.getPackageMetaData({
                type: this.externalSourceType.id,
                uuid: this.external_package_uuid
              }, this.cancelToken.token),
              instance: this
            })

            if (response?.status === 200 && response.data?.length) {
              result = response.data[0]
              this.externalPackageName = result?.name
              this.packageName = this.externalPackageName
              this.packageDescription = result?.description
              this.packageDescriptionURL = result?.descriptionURL
              this.packageGlobal = result?.scope
              this.externalPlatformName = result?.nominalPlatformName
              this.platformName = this.externalPlatformName
              this.externalProviderName = result?.providerName
              this.providerName = this.externalProviderName
              this.externalPlatformUuid = result?.nominalPlatformUuid
              this.contentTypeOfTipps = result?.contentType
              this.titleCount = result?.titleCount
              this.externalProviderUuid = result?.providerUuid

              // Package Identifier
              if(result?.identifiers?.length > 0){
                let idNs = result.identifiers.filter(a => a.value !== "Unknown")[0]
                if(idNs){
                  this.packageIdentifierValue = idNs.value
                  this.packageIdentifierExists = true
                }
              }

              // Plattform
              let platformResult = await this.fetchExternalPlatformData()
              this.externalPlatformURL = platformResult?.primaryUrl
              this.platformAlreadyExists = await this.platformExists()

              //Provider
              const providerResult = await this.providerExists()
              this.externalProviderHomepage = providerResult?.data?.providerHomepage
              this.providerAlreadyExists = providerResult?.data?.providerExists

              if(this.providerAlreadyExists) {
                this.internalProviderId = providerResult?.data?.providerId
                this.providerName = this.externalProviderName

                const provRes = await this.catchError({
                  promise: providerServices.get(this.internalProviderId, this.cancelToken.token),
                  instance: this
                })

                // Default Package Identifier of specified Provider
                if (provRes?.data?.packageNamespace) {
                  this.packageIdentifier = provRes.data.packageNamespace
                }
              }

              // get Code for updateFrequency
              // Check cached categories like in gokb-select-field

              let frequencyValues = states.getCategory('Source.Frequency')

              if (!frequencyValues) {
                let entityService = genericEntityServices('refdata/categories/Source.Frequency')
                const responseSourceFrequency = await this.catchError({
                  promise: entityService.get({}, this.cancelToken.token),
                  instance: this
                })

                frequencyValues = responseSourceFrequency?.data?._embedded.values

                states.addCategory('Source.Frequency', frequencyValues)
              }

              let frequencyCode = frequencyValues.filter(a => a.value === "Daily")[0].id

              // SOURCE
              let source = {
                importConfig: this.externalSourceType,
                url: 'https://wekb.hbz-nrw.de/api2/searchApi?componentType=package&uuid='.concat(this.external_package_uuid.replaceAll(" ", "")),
                frequency: frequencyCode,
                targetNamespace: undefined,
                automaticUpdates: true,
                update: true
              }

              this.externalSourceInfo = source

              if (!!result?.file) {
                // get Code for packagetype

                let scopeValues = states.getCategory('Package.Scope')

                if (!scopeValues) {

                  let entityService = genericEntityServices('refdata/categories/Package.Scope')

                  const responseScope = await this.catchError({
                    promise: entityService.get({}, this.cancelToken.token),
                    instance: this
                  })

                  scopeValues = responseScope?.data?._embedded.values

                  states.addCategory('Package.Scope', scopeValues)
                }

                this.packageScope = scopeValues.filter(a => a.value == result.file)[0]?.id
              }

              // get Title Data to provide identifier examples
              // Batch-Verarbeitung: Titel-Zählung beginnt bei offset := 0
              const max = 500
              const publicationTypes = new Set()
              const titleExamples = []
              const titleData = []

              for(var offset = 0; offset < this.titleCount; offset = offset + max) {
                let responseTitleData = await this.getTippsOfPackage(max, offset)

                if (responseTitleData && responseTitleData.length > 0) {
                  titleData.push(responseTitleData)
                  for (var i = 0; i < responseTitleData.length; i++) {
                    if (responseTitleData[i].publicationType && responseTitleData[i].status !== 'Deleted') {
                      publicationTypes.add(responseTitleData[i].publicationType)
                    }
                  }
                }
                if (publicationTypes.size >= 2) {
                  break
                }
              }

              // auch wenn nur Titel mit einem Contenttype im Paket sind, muss zu diesem Type ein Beispiel gefunden werden
              if (publicationTypes.size > 0) {
                for(var i = 0; i < titleData.length; i++){
                  publicationTypes.forEach(pub => {
                    let titleByPubType = titleData[i].find(x => x.publicationType === pub)

                    if(titleByPubType) {
                      titleExamples.push(titleByPubType)
                      publicationTypes.delete(pub)
                    }
                  })

                  if(publicationTypes.size === 0){
                    break
                  }
                }
              }

              titleExamples.forEach(title => {
                let identifiers = []

                for (var i = 0; i < title.identifiers?.length; i++) {
                  var tipp_id = title.identifiers[i]

                  identifiers.push({
                    namespace: this.mapIdentifierNames(tipp_id.namespaceName),
                    value: tipp_id.value
                  })
                }

                this.identifierExamples.push({
                  publicationType: title.publicationType,
                  identifiers: identifiers
                })
              })


              // set contenttype according to containing tipps and get GOKB code for it
              if (titleExamples.length > 1) {
                this.contentTypeOfTipps = 'Mixed'
              } else {
                switch (titleExamples[0].publicationType) {
                  case 'Monograph':
                    this.contentTypeOfTipps = 'Book'
                    break
                  case 'Serial':
                    this.contentTypeOfTipps = 'Journal'
                    break
                  default:
                    this.contentTypeOfTipps = 'Database'
                    break
                }
              }

              let contentTypes = states.getCategory('Package.ContentType')

              if (!contentTypes) {
                let entityService = genericEntityServices('refdata/categories/Package.ContentType')

                const responseContentType = await this.catchError({
                  promise: entityService.get({}, this.cancelToken.token),
                  instance: this
                })

                contentTypes = responseContentType?.data?._embedded.values
              }

              this.contentTypeOfTippsCode = contentTypes.filter(a => a.value == this.contentTypeOfTipps)[0].id

            } else {
              this.showSnackbarError(this.$i18n.t('popups.externalSourceImport.error.packageNotExist'))
            }

          } catch (error) {
            if (error.response) {
              // The request was made and the server responded with a status code > 2xx
              console.log(error.response.data)
              console.log(error.response.status)
              console.log(error.response.headers)
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request)
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message)
            }

          }
        } else {
          this.showSnackbarError(this.$i18n.t('popups.externalSourceImport.error.uuidNotValid'))
        }
        if (result) {
          //console.log("result: ", result)
          this.externalDataLoaded = true
        }

        this.externalDataIsLoading = false

      },
      showSnackbarError(msg) {
        this.errors.uuid = true
        this.messageColor = 'error'
        this.snackbarMessage = msg
        this.currentSnackBarTimeout = 8000
        this.showSnackbar = true
      },
      mapIdentifierNames (externalName) {
        var identifierName

        if (this.externalSourceType?.value === 'WEKB') {
          switch (externalName) {
            case "eISBN":
              identifierName = "ISBN"
              break
            case "ISBN":
              identifierName = "p-ISBN"
              break
            /*case "Title_ID":
              break*/
            default:
              identifierName = externalName
          }
        }
        else {
          return externalName
        }

        return identifierName
      },
      async fetchExternalPlatformData() {
        let result = null

        try {
          const response = await this.catchError({
            promise: externalSourceImportServices.getPlatformMetadata({
              'type': this.externalSourceType.id,
              'uuid': this.externalPlatformUuid
            }, this.cancelToken.token),
            instance: this
          })

          if (response?.status === 200 && response.data?.length) {
            result = response.data[0]
          }

        } catch (error) {
          console.log(error)
        }
        return result
      },
      validatePackageUUID() {
        if (this.external_package_uuid) {
          this.external_package_uuid = this.external_package_uuid.replaceAll(" ", "")
          //lax validation
          return /^([a-zA-Z0-9\-]{6,40})$/.test(this.external_package_uuid)
        }
        return false
      },
      async platformExists() {
        const externalPlatform = {
          name: this.externalPlatformName,
          primaryUrl: this.externalPlatformURL,
        }

        const response = await this.catchError({
          promise: platformServices.check(externalPlatform, this.cancelToken.token),
          instance: this
        })

        if (response?.data) {
          if (!response.data.to_create) {

            //console.log("Platform already exists - set existing")
            let platformId = null
            if (response.data.conflicts) {
              if (response.data.conflicts.primaryUrl) {
                platformId = response.data.conflicts?.primaryUrl[0]?.matches
              } else if (response.data.conflicts.name[0]) {
                platformId = response.data.conflicts?.name[0]?.matches
              }
            }
            const platform = await this.catchError({
              promise: platformServices.get(platformId, this.cancelToken.token),
              instance: this
            })

            this.internalPlatformId = platformId
            this.platformName = this.externalPlatformName
            this.platformURL = this.externalPlatformURL
            return true
          }
        }
        //console.log("Platform not exists - create it")
        return false
      },
      async getTippsOfPackage(max, offset) {
        let result = null

        try {
          const response = await this.catchError({
            promise: externalSourceImportServices.getTippsOfPackage({
              'type': this.externalSourceType.id,
              'uuid': this.external_package_uuid,
              'max': max ? max : 10,
              'offset': offset ? offset : 0
            }, this.cancelToken.token),
            instance: this
          })

          if (response?.status === 200 && response.data?.length) {
            result = response.data
          }

        } catch (error) {
          console.log(error)
        }

        return result
      },
      async providerExists() {

        const response = await this.catchError({
          promise: externalSourceImportServices.getProviderData({
            'type': this.externalSourceType.id,
            'uuid': this.externalProviderUuid
          }, this.cancelToken.token),
          instance: this
        })

        return response
      },
      async submit() {

        if (this.valid) {
          let platformObject = undefined
          let platfResponse = undefined

          if (this.platformAlreadyExists) {
            platfResponse = await this.catchError({
              promise: platformServices.get(this.internalPlatformId, this.cancelToken.token),
              instance: this
            })

            platformObject = platfResponse?.data
          } else {
            if(this.adaptPlatformData) {
              // create new Plattform and retrieve object
              const newPlatform = {
                name: this.externalPlatformName,
                primaryUrl: this.externalPlatformURL,
              }
              platfResponse = await this.catchError({
                promise: platformServices.createOrUpdate(newPlatform, this.cancelToken.token),
                instance: this
              })

              platformObject = platfResponse?.data
            } else {
              platformObject = this.platformObject
            }

          }

          let providerObject = undefined

          if (this.providerAlreadyExists) {
            const provResponse = await this.catchError({
              promise: providerServices.get(this.internalProviderId, this.cancelToken.token),
              instance: this
            })

            providerObject = provResponse?.data
          } else {
            if(this.adaptProviderData) {
              // create new Provider and retrieve the Object
              const newProvider = {
                id: undefined,
                ids: [],
                status: undefined,
                source: undefined,
                titleNamespace: undefined,
                packageNamespace: undefined,
                homepage: this.externalProviderHomepage[0],
                name: this.externalProviderName,
                providedPlatforms: [
                  {
                    name: this.platformName,
                    primaryUrl: this.platformURL,
                    id: this.internalPlatformId
                  }
                ]
              }

              // add Platform Provider role to Provider
              let roles = []
              let entityService = genericEntityServices('refdata/categories/Org.Role')
              const responseOrgRole = await this.catchError({
                promise: entityService.get({}, this.cancelToken.token),
                instance: this
              })

              let roleValues = responseOrgRole?.data?._embedded.values
              let roleCode = roleValues.filter(a => a.value === "Platform Provider")[0].id
              if (!!roleCode) {
                roles.push(roleCode)
              }
              newProvider.roles = roles

              const provResponse = await this.catchError({
                promise: providerServices.createOrUpdate(newProvider, this.cancelToken.token),
                instance: this
              })

              providerObject = provResponse?.data

            } else {
              providerObject = this.providerObject
            }
          }

          const pckg = {
            id: undefined,
            name: this.packageName,
            source: undefined,
            type: 'package',
            status: undefined,
            descriptionURL: this.packageDescriptionURL,
            description: this.packageDescription,
            scope: this.packageScope,
            global: this.packageGlobal,
            globalNote: undefined,
            contentType: this.contentTypeOfTippsCode,
            consistent: undefined,
            breakable: undefined,
            fixed: undefined,
            subjects: [],
            listStatus: undefined,
            editStatus: undefined,
            ids: [],

          }

          if (this.packageIdentifierExists && this.packageIdentifier) {
            let id = {
              value: this.packageIdentifierValue,
              namespace: this.packageIdentifier.value,
              nslabel: this.packageIdentifier.name
            }
            pckg.ids.push(id)
          }

          this.externalSourceInfo.titleIdMonograph = this.namespaceMonograph
          this.externalSourceInfo.titleIdSerial = this.namespaceJournal

          const allData = {
            platform: platformObject,
            provider: providerObject,
            source: this.externalSourceInfo,
            sourceType: this.externalSourceType,
            package: pckg

          }

          this.$emit("import", allData)
        }
      }
    }
  }
</script>
