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
      <!-- <v-card :loading="wekbDataIsLoading"/> -->

        <v-row >
          <v-col>
            <!-- <gokb-state-field
              label="Quelle"
              v-model="import_sources"
              init-item="WEKB"
            /> -->
            <span><b>Import-Quelle</b></span><br/>
            <span>WE:KB</span>
          </v-col>
          <v-col>
            <gokb-text-field
              label="UUID des zu importierenden Pakets in der WEKB"
              v-model="wekb_package_uuid"
              required
            />

          </v-col>
        </v-row>

        <v-row justify="end">
          <v-col cols="2">
            <gokb-button
              v-if="!wekbDataLoaded"
              :disabled="wekbDataLoaded || !wekb_package_uuid || wekbDataIsLoading"
              @click="fetchWekbPackageData"
            >
              Abschicken
            </gokb-button>
          </v-col>
        </v-row>
      <div v-if="wekbDataIsLoading">
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
            <span>Die Daten werden geladen - je nach Größe des angeforderten Pakets kann das einige Zeit dauern. </span>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </div>
    </gokb-section>

    <div v-if="wekbDataLoaded">
      <v-row>
        <v-col cols="5"><h3> Paket aus der externen Quelle </h3></v-col>
        <v-col cols="5"><h3>Paket in der GOKB</h3></v-col>
      </v-row>

      <v-row>
        <v-col><h4>Name: </h4></v-col>
      </v-row>

      <v-row>
        <v-col cols="5"><span>{{ externalPackageName }}</span></v-col>
        <v-col cols="5">
          <gokb-text-field
            v-model="packageName"
            label="Paketname"
          />
          <span v-if="packageAlreadyExists" style="color:red">
            <v-icon class="pb-1" color="error">
              mdi-close-thick
            </v-icon>
            Ein Paket mit diesem Namen existiert bereits in der GOKB. Prüfen Sie bitte, ob es sich um das selbe Paket handelt.
          </span>
        </v-col>

        <v-col cols="2"></v-col>
      </v-row>

      <v-row>
        <v-col><h4>Plattform: </h4></v-col>
      </v-row>

      <v-row>
        <v-col cols="5"><span>{{ externalPlatformName }}</span><br/><span>{{ externalPlatformURL }}</span></v-col>
        <v-col cols="5" v-if="platformAlreadyExists">
          <gokb-text-field
            v-model="platformName"
            label="Plattform"
            :disabled="true"
          />
          <span>
            <v-icon color="success">
              mdi-check-circle
            </v-icon>
          </span>
        </v-col>

        <v-col cols="5" v-else>
          <gokb-search-platform-field
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
            label="Quelle übernehmen"
          />
        </v-col>
        <span v-if="!platformAlreadyExists">Wählen Sie entweder eine schon existierende Plattform oder übernehmen Sie die Plattform der Importquelle.</span>
      </v-row>

      <v-row>
        <v-col><h4>Anbieter: </h4></v-col>
      </v-row>
      <v-row>
        <v-col cols="5"><span>{{ externalProviderName }}</span></v-col>
        <v-col cols="5" v-if="providerAlreadyExists">
          <gokb-text-field
            v-model="providerName"
            label="Anbieter"
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
              label="Quelle übernehmen"
            />
          </v-col>
        <span v-if="!providerAlreadyExists">Wählen Sie entweder einen schon existierenden Anbieter oder übernehmen Sie den Anbieter der Importquelle.</span>
      </v-row>

      <v-row>
        <v-col><h3>Titelidentifikatoren: </h3></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span>Folgende exemplarische Identifikatoren pro unterschiedlichem Inhaltstyp befinden sich innerhalb des Pakets:</span>
        </v-col>
      </v-row>
      <!-- <v-row>
         <v-col cols="4">Name: </v-col>
        <v-col cols="4">Wert: </v-col>
      </v-row> -->
      <!-- <v-row v-for="id in identifierExamples"
             :data="id"
             :key="id.namespace"
      >
        <v-col cols="4">{{ id.namespace }} </v-col>
        <v-col cols="4">{{ id.value }}</v-col>
      </v-row> -->
      <v-row>
       <!-- <v-col cols="4">
          <span>Beispielhafte Identifikatoren des Pakets: </span>
        </v-col> -->

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

          <!-- <v-col cols="4">{{ id.value }}</v-col> -->
        </v-col>

      </v-row>
      <br/><br/>
      <v-row>
        <v-col cols="4">
          <span>Im Paket befinden sich Medien vom Inhaltstyp <strong>{{ contentTypeOfTipps }}</strong>. <br/>
            Welcher Identifikatoren-Namensraum soll für das Feld "title_id" verwendet werden (Angabe optional)?
          </span>
        </v-col>
        <v-col cols="4" v-if="showJournalNamespaceSelect">
          <gokb-namespace-field
            v-model="namespaceJournal"
            target-type="Journal"
            label="title_id Namensraum für Journals"
            :exclude-isxn="true"
          />
          <!-- :label="$t('kbart.propId.label')" -->

        </v-col>
        <v-col cols="4" v-if="showMonographNamespaceSelect">
          <gokb-namespace-field
            v-model="namespaceMonograph"
            target-type="Book"
            label="title_id Namensraum für Monographien"
            :exclude-isxn="true"
          />
          <!-- :label="$t('kbart.propId.label')" -->
        </v-col>
      </v-row>

      <v-row>
        <v-spacer />
        <gokb-button
          :disabled="!valid"
          is-submit
        >
          Abschicken
        </gokb-button>
      </v-row>
    </div>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from "@/shared/components/base-component"
  import GokbSection from "@/shared/components/complex/gokb-section/gokb-section.vue"
  import GokbStateField from "@/shared/components/simple/gokb-state-field/gokb-state-field.vue"
  import GokbTextField from "@/shared/components/base/gokb-text-field/gokb-text-field.vue"
  import GokbButton from "@/shared/components/base/gokb-button/gokb-button.vue"
  import GokbCheckboxField from "@/shared/components/base/gokb-checkbox-field/gokb-checkbox-field.vue"
  import GokbTable from "@/shared/components/complex/gokb-table/gokb-table.vue"
  import wekbImportServices from "@/shared/services/wekb-import-services"
  import platformServices from "@/shared/services/platform-services"
  import GokbNamespaceField from "@/shared/components/simple/gokb-namespace-field"
  import genericServices from "@/shared/services/generic-entity-services"
  import GokbSearchOrganisationField from "@/shared/components/simple/gokb-search-organisation-field"
  import providerServices from "@/shared/services/provider-services"
  import genericEntityServices from "@/shared/services/generic-entity-services"
  import GokbSearchPlatformField from "../../components/simple/gokb-search-platform-field/index.js";


  export default {
    name: 'GokbImportWekbPackagePopup',
    components: {
      GokbSearchPlatformField,
      GokbSearchOrganisationField,
      GokbNamespaceField, GokbTable, GokbCheckboxField, GokbButton, GokbTextField, GokbStateField, GokbSection },
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
        wekb_package_uuid: undefined,
        import_sources: ["WE:KB"],
        wekbDataLoaded: false,
        wekbDataIsLoading: false,
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
        externalPlatformUuidWekb: "",
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
        //valid: false,
        localPackageItem: {},
        externalSource: {},
        packageAlreadyExists: false,
        identifierExamples: [],
        errors: {},
        errorMessages: []
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
        return "Ein Paket aus einer externen Quelle importieren"
      },
      /*tableHeaders() {
        return [
          {text: "aaa"}, {text: "bbb"}, {text: "ccc"}
        ]
      },*/
      showMonographNamespaceSelect() {
        return (this.contentTypeOfTipps === "Book" || this.contentTypeOfTipps === "Mixed")
      },
      showJournalNamespaceSelect() {
        return (this.contentTypeOfTipps === "Journal" || this.contentTypeOfTipps === "Mixed")
      },
      valid() {
        return ( (this.providerAlreadyExists || (this.adaptProviderData || this.providerObject))
          && (this.platformAlreadyExists || (this.adaptPlatformData || this.platformObject))
          && this.wekbDataLoaded && !this.packageAlreadyExists)
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

          console.log("CHECK PCKAGENAME EXISTS: ", response)

          if (response?.status < 400) {
            if (response.data.result === 'ERROR') {
              this.packageAlreadyExists = true

              return true
            }
          }

          this.packageAlreadyExists = false

          return false
      },
      async fetchWekbPackageData() {
        this.wekbDataIsLoading = true
        let result = null
        if (this.validatePackageUUID()) {
          try {
            const response = await this.catchError({
              promise: wekbImportServices.getPackageMetaData({'uuid': this.wekb_package_uuid}, this.cancelToken.token),
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
              this.externalPlatformUuidWekb = result?.nominalPlatformUuid
              this.contentTypeOfTipps = result?.contentType
              this.titleCount = result?.titleCount
              this.externalProviderUuid = result?.providerUuid

              // check if Package already exists --> executed by implicitly changed packagename variable

              // Plattform
              let platformResult = await this.fetchWekbPlatformData()
              this.externalPlatformURL = platformResult?.primaryUrl

              this.platformAlreadyExists = await this.platformExists()
              /*if (!this.platformAlreadyExists) {

                console.log("### Plattform muss zunächst angelegt werden")
              } else {

              } */
              //Provider
              const providerResult = await this.providerExists()
              this.externalProviderHomepage = providerResult?.data?.providerHomepage
              this.providerAlreadyExists = providerResult?.data?.providerExists

              if(this.providerAlreadyExists) {
                this.internalProviderId = providerResult?.data?.providerId
                this.providerName = this.externalProviderName
              }

              // get Code for updateFrequency
              let entityService = genericEntityServices('refdata/categories/Source.Frequency')
              const responseSourceFrequency = await this.catchError({
                promise: entityService.get({}, this.cancelToken.token),
                instance: this
              })

              console.log("Source Frequency: ", responseSourceFrequency)
              let frequencyCode = responseSourceFrequency?.data?._embedded.values.filter(a => a.value === "Daily")[0].id
              console.log("Frequency Code: ", frequencyCode)

              // SOURCE
              let source = {
                type: 'WEKB',
                url: 'https://wekb.hbz-nrw.de/api2/searchApi?componentType=package&uuid='.concat(this.wekb_package_uuid.replaceAll(" ", "")),
                frequency: frequencyCode,
                targetNamespace: {},
                automaticUpdates: true,
                update: true
              }

              this.externalSource = source

              // get Code for packagetype
              entityService = genericEntityServices('refdata/categories/Package.Scope')

              if (result?.file) {
                const responseScope = await this.catchError({
                  promise: entityService.get({}, this.cancelToken.token),
                  instance: this
                })

                console.log("resonseScope: ", responseScope)
                this.packageScope = responseScope?.data?._embedded.values.filter(a => a.value == result.file)[0].id
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

              console.log("### PUBLICATIONTYPES IN PACKAGE: ", publicationTypes)
              // auch wenn nur Titel mit einem Contenttype im Paket sind, muss zu diesem Type ein Beispiel gefunden werden
              if (publicationTypes.size > 0) {
                for(var i = 0; i < titleData.length; i++){
                  publicationTypes.forEach(function (pub) {
                    let titleByPubType = titleData[i].find(x => x.publicationType === pub)
                    console.log("FOUND for pubtype: ", pub, titleByPubType)
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


                var that = this

                titleExamples.forEach(function (title) {
                  let identifiers = []
                  /*title.identifiers?.forEach(function(id){
                    identifiers.push( {namespace: that.mapIdentifierNames(id.namespaceName), value: id.value} )
                  })*/
                  for (var i = 0; i < title.identifiers?.length; i++) {
                    var id = title.identifiers[i]
                    identifiers.push({namespace: that.mapIdentifierNames(id.namespaceName), value: id.value})
                  }
                  that.identifierExamples.push({publicationType: title.publicationType, identifiers: identifiers})
                })

                console.log("IDENTIFIERS: ", this.identifierExamples)


              // set contenttype according to containing tipps and get GOKB code for it
              if(titleExamples.length > 1) {
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

              entityService = genericEntityServices('refdata/categories/Package.ContentType')

              const responseContentType = await this.catchError({
                promise: entityService.get({}, this.cancelToken.token),
                instance: this
              })

              console.log("responseContentType: ", responseContentType)
              this.contentTypeOfTippsCode = responseContentType?.data?._embedded.values.filter(a => a.value == this.contentTypeOfTipps)[0].id
              console.log("responseContentType ", this.contentTypeOfTippsCode)




            } else {
                console.log("UUID der Form nach korrekt, aber existiert anscheinend nicht in der WEKB")
                this.errors.uuid = true
                this.messageColor = 'error'
                this.snackbarMessage = 'Ein Paket mit dieser UUID existiert anscheinend nicht in der we:kb'
                this.currentSnackBarTimeout = 3000
                this.showSnackbar = true
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
        }
        if (result) {
          console.log("result: ", result)
          this.wekbDataLoaded = true
        }

        this.wekbDataIsLoading = false

        //TODO: zu Testzwecken
        //this.wekbDataLoaded = true

      },
      mapIdentifierNames (wekbName) {
        var identifierName

        switch (wekbName) {
          case "eISBN":
            identifierName = "ISBN"
            break
          case "ISBN":
            identifierName = "p-ISBN"
            break
          /*case "Title_ID":
            break*/
          default:
            identifierName = wekbName
        }

        return identifierName
      },
      async fetchWekbPlatformData() {
        let result = null

        try {
          const response = await this.catchError({
            promise: wekbImportServices.getPlatformMetadata({'uuid': this.externalPlatformUuidWekb}, this.cancelToken.token),
            instance: this
          })

          //TODO: handle Response Status
          if (response?.status === 200 && response.data?.length) {
            result = response.data[0]
            console.log("+++ ", result)
          }

        } catch (error) {
          console.log(error)
        }

        return result
      },
      validatePackageUUID() {
        return true
      },
      async platformExists() {
        const wekbPlatform = {
          name: this.externalPlatformName,
          primaryUrl: this.externalPlatformURL,
        }

        const response = await this.catchError({
          promise: platformServices.check(wekbPlatform, this.cancelToken.token),
          instance: this
        })

        // console.log("#### ", response)

        if (response?.data) {
          if (!response.data.to_create) {

            console.log("Platform already exists - set existing")
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
            // console.log("PLATTFORM: ", platform)
            this.internalPlatformId = platformId
            this.platformName = this.externalPlatformName
            this.platformURL = this.externalPlatformURL
            return true
          }
        }

        console.log("Platform not exists - create it")

        return false
      },
      async getTippsOfPackage(max, offset) {
        let result = null

        try {
          const response = await this.catchError({
            promise: wekbImportServices.getTippsOfPackage({
              'uuid': this.wekb_package_uuid,
              'max': max ? max : 10,
              'offset': offset ? offset : 0
            }, this.cancelToken.token),
            instance: this
          })

          //TODO: handle Response Status
          if (response?.status === 200 && response.data?.length) {
            result = response.data
            // console.log("+++ ", result)
          }

        } catch (error) {
          console.log(error)
        }

        return result
      },
      async providerExists() {

        const response = await this.catchError({
          promise: wekbImportServices.getProviderData({'uuid': this.externalProviderUuid}, this.cancelToken.token),
          instance: this
        })

        console.log("+++ check PROVIDER: ", response)

        return response
      },
      async submit() {

        // console.log("SUBMIT")

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
                homepage: this.externalProviderHomepage[0], //TODO: ARRAY!!!????
                name: this.externalProviderName,
                providedPlatforms: [
                  {
                    name: this.platformName,
                    primaryUrl: this.platformURL,
                    id: this.internalPlatformId
                  }
                ]
              }

              const provResponse = await this.catchError({
                promise: providerServices.createOrUpdate(newProvider, this.cancelToken.token),
                instance: this
              })

              providerObject = provResponse?.data
              console.log("NEW PROVIDEROBJECT: " + providerObject)
              console.log("NEW PROVIDER: " + provResponse)
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

          // TODO: Übergangslösung bis wir 2 Felder für Title-Namespaces haben
          if (this.contentTypeOfTipps === "Book" || this.contentTypeOfTipps === "Mixed") {
            this.externalSource.targetNamespace = this.namespaceMonograph
          } else {
            this.externalSource.targetNamespace = this.namespaceJournal
          }

          const allData = {
            platform: platformObject,
            provider: providerObject,
            source: this.externalSource,
            package: pckg

          }

          this.$emit("import", allData)
        }
      }
    }
  }
</script>
