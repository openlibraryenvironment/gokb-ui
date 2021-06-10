<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="1800"
    @submit="submitTipp"
  >
    <gokb-error-component :value="error" />
    <v-row dense>
      <v-col md="6">
        <v-row dense>
          <v-col>
            <gokb-section :sub-title="$t('component.general.general')">
              <v-row dense>
                <v-col>
                  <gokb-state-select-field
                    v-if="status"
                    v-model="packageTitleItem.status"
                    :deletable="!!deleteUrl"
                    :editable="!!updateUrl"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-name-field
                    v-model="allNames"
                    :disabled="isReadonly"
                    dense
                    :label="$tc('component.tipp.name')"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-title-field
                    v-model="packageTitleItem.title"
                    :type-filter="title.type.id"
                    :label="$tc('component.title.label')"
                    dense
                    :readonly="isEdit || isReadonly"
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-search-package-field
                    v-if="packageTitleItem.title"
                    v-model="packageTitleItem.pkg"
                    :label="$tc('component.package.label')"
                    dense
                    :readonly="true"
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.publisherName"
                    :disabled="isReadonly"
                    dense
                    :label="$tc('component.title.publisher.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.series"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.tipp.series.label')"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.subjectArea"
                    :disabled="isReadonly"
                    :label="$t('component.tipp.subjectArea.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-state-field
                    v-model="packageTitleItem.medium"
                    :init-item="packageTitleItem.medium"
                    width="100%"
                    message-path="component.title.medium"
                    url="refdata/categories/TitleInstancePackagePlatform.Medium"
                    :label="$t('component.title.medium.label')"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.lastChangedExternal"
                    readonly
                    :label="$t('component.tipp.lastChangedExternal')"
                  />
                </v-col>
              </v-row>
              <v-row
                v-if="isBook"
                dense
              >
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.dateFirstInPrint"
                    :readonly="isReadonly"
                    dense
                    :label="$t('component.title.firstPublishedInPrint')"
                  />
                </v-col>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.dateFirstOnline"
                    :readonly="isReadonly"
                    dense
                    :label="$t('component.title.firstPublishedOnline')"
                  />
                </v-col>
              </v-row>
              <v-row
                v-if="isBook"
                dense
              >
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.firstAuthor"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.firstAuthor.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.firstEditor"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.firstEditor.label')"
                  />
                </v-col>
              </v-row>
              <v-row
                v-if="isBook"
                dense
              >
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.volumeNumber"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.volumeNumber')"
                  />
                </v-col>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.editionStatement"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.editionStatement')"
                  />
                </v-col>
              </v-row>
            </gokb-section>
          </v-col>
        </v-row>
        <v-row
          v-if="!isBook"
          dense
        >
          <v-col>
            <gokb-section
              expandable
              :sub-title="$t('component.tipp.access')"
            >
              <v-row dense>
                <v-col>
                  <gokb-search-platform-field
                    v-model="packageTitleItem.hostPlatform"
                    :items="platformSelection"
                    :label="$tc('component.platform.label')"
                    :readonly="isEdit || isReadonly"
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.accessStartDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessStartDate')"
                  />
                </v-col>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.accessEndDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessEndDate')"
                  />
                </v-col>
                <v-col>
                  <gokb-state-field
                    v-model="packageTitleItem.paymentType"
                    :init-item="packageTitleItem.paymentType"
                    message-path="component.tipp.paymentType"
                    url="refdata/categories/TitleInstancePackagePlatform.PaymentType"
                    :label="$t('component.tipp.paymentType.label')"
                    :readonly="isReadonly"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-url-field
                    v-model="packageTitleItem.url"
                    :disabled="isReadonly"
                    dense
                    :label="$tc('component.tipp.url.label')"
                  />
                </v-col>
              </v-row>
            </gokb-section>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="6">
        <v-row dense>
          <v-col>
            <gokb-identifier-section
              v-model="packageTitleItem.ids"
              :title="$tc('component.tipp.identifier.label')"
              :target-type="titleTypeString"
              :expanded="!!packageTitleItem.ids"
              :disabled="isReadonly"
            />
          </v-col>
        </v-row>
        <v-row
          v-if="isBook"
          dense
        >
          <v-col>
            <gokb-section
              expandable
              :sub-title="$t('component.tipp.access')"
            >
              <v-row dense>
                <v-col>
                  <gokb-search-platform-field
                    v-model="packageTitleItem.hostPlatform"
                    :items="platformSelection"
                    :label="$tc('component.platform.label')"
                    :readonly="isEdit || isReadonly"
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.accessStartDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessStartDate')"
                  />
                </v-col>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.accessEndDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessEndDate')"
                  />
                </v-col>
                <v-col>
                  <gokb-state-field
                    v-model="packageTitleItem.paymentType"
                    :init-item="packageTitleItem.paymentType"
                    message-path="component.tipp.paymentType"
                    url="refdata/categories/TitleInstancePackagePlatform.PaymentType"
                    :label="$t('component.tipp.paymentType.label')"
                    :readonly="isReadonly"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-url-field
                    v-model="packageTitleItem.url"
                    :disabled="isReadonly"
                    dense
                    :label="$tc('component.tipp.url.label')"
                  />
                </v-col>
              </v-row>
            </gokb-section>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-row dense>
              <v-col>
                <span class="text-h6 ml-4">
                  {{ $t('component.tipp.coverage.label') }}
                </span>
                <v-btn
                  icon
                  @click="doExpandCoverage"
                >
                  <v-icon>{{ expansionIcon }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row
              v-if="coverageExpanded"
              dense
            >
              <v-col
                v-for="statement in packageTitleItem.coverageStatements"
                :key="statement.id"
              >
                <gokb-section no-tool-bar>
                  <v-row>
                    <v-col cols="4">
                      <gokb-state-field
                        v-model="statement.coverageDepth"
                        :readonly="isReadonly"
                        :init-item="statement.coverageDepth"
                        :label="$t('component.tipp.coverage.depth.label')"
                        message-path="component.tipp.coverage.depth"
                        url="refdata/categories/TIPPCoverageStatement.CoverageDepth"
                      />
                    </v-col>
                    <v-col>
                      <gokb-textarea-field
                        v-model="statement.coverageNote"
                        :disabled="isReadonly"
                        :label="$t('component.tipp.coverage.note')"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="isJournal">
                    <v-col>
                      <gokb-date-field
                        v-model="statement.startDate"
                        :readonly="isReadonly"
                        dense
                        :label="$t('component.tipp.coverage.startDate')"
                      />
                    </v-col>
                    <v-col>
                      <gokb-text-field
                        v-model="statement.startVolume"
                        :disabled="isReadonly"
                        dense
                        :label="$t('component.tipp.coverage.startVolume')"
                      />
                    </v-col>
                    <v-col>
                      <gokb-text-field
                        v-model="statement.startIssue"
                        :disabled="isReadonly"
                        dense
                        :label="$t('component.tipp.coverage.startIssue')"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="isJournal">
                    <v-col>
                      <gokb-date-field
                        v-model="statement.endDate"
                        :readonly="isReadonly"
                        dense
                        :label="$t('component.tipp.coverage.endDate')"
                      />
                    </v-col>
                    <v-col>
                      <gokb-text-field
                        v-model="statement.endVolume"
                        :disabled="isReadonly"
                        dense
                        :label="$t('component.tipp.coverage.endVolume')"
                      />
                    </v-col>
                    <v-col>
                      <gokb-text-field
                        v-model="statement.endIssue"
                        :disabled="isReadonly"
                        dense
                        :label="$t('component.tipp.coverage.endIssue')"
                      />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <gokb-embargo-field
                        v-model="statement.embargo"
                        :readonly="isReadonly"
                      />
                    </v-col>
                  </v-row>
                </gokb-section>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <template #buttons>
      <v-btn
        class="ml-6 btn-default"
        :to="{ name: '/package-title', params: { id: id} }"
      >
        {{ $t('component.tipp.toFullView') }}
      </v-btn>
      <v-spacer />
      <div v-if="id">
        <v-chip
          class="ma-1"
          label
        >
          <v-icon
            :title="$t('component.general.dateCreated')"
            medium
          >
            mdi-file-plus-outline
          </v-icon>
          <span class="ml-1">{{ localDateCreated }}</span>
        </v-chip>
        <v-chip
          class="ma-1"
          label
        >
          <v-icon
            :title="$t('component.general.lastUpdated')"
            label
            medium
          >
            mdi-refresh
          </v-icon>
          <span class="ml-1">{{ localLastUpdated }}</span>
        </v-chip>
      </div>
      <v-spacer />
      <gokb-button
        text
        class="mr-6"
        @click="close"
      >
        {{ updateUrl ? $t('btn.cancel') : $t('btn.close') }}
      </gokb-button>
      <gokb-button
        v-if="updateUrl || !id"
        :disabled="!packageTitleItem.title"
        class="mr-6"
        default
      >
        {{ selected ? $t('btn.update') : $t('btn.add') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import tippServices from '@/shared/services/tipp-services'
  import { EDIT_TITLE_ROUTE, EDIT_TIPP_ROUTE } from '@/router/route-paths'

  export default {
    name: 'GokbAddTitlePopup',
    extends: BaseComponent,
    props: {
      value: {
        type: [Number, String],
        required: true,
        default: undefined
      },
      selected: {
        type: Object,
        required: false,
        default: undefined
      },
      pkg: {
        type: Number,
        required: false,
        default: undefined
      },
      parentPlatform: {
        type: Object,
        required: false,
        default: undefined
      },
      titleType: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        pprops: undefined,
        platformSelection: [],
        coverageExpanded: false,
        title: {
          id: undefined,
          title: undefined,
          type: undefined,
          ids: [],
          publisher: undefined,
          publishedFrom: undefined,
          publishedTo: undefined
        },
        selectedTitle: undefined,
        selectedItem: undefined,
        coverageObject: {
          coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
          startDate: undefined,
          endDate: undefined,
          startVolume: undefined, // number
          endVolume: undefined, // number
          startIssue: undefined, // number
          endIssue: undefined, // number
          coverageNote: undefined, // note
          embargo: undefined
        },
        updateUrl: undefined,
        deleteUrl: undefined,
        status: undefined,
        items: [],
        id: undefined,
        allNames: { name: undefined, alts: [] },
        lastUpdated: undefined,
        dateCreated: undefined,
        packageTitleItem: {
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          status: undefined,
          paymentType: undefined,
          url: undefined,
          name: undefined,
          accessStartDate: undefined,
          accessEndDate: undefined,
          ids: [],
          coverageStatements: [
            {
              coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
              startDate: undefined,
              endDate: undefined,
              startVolume: undefined, // number
              endVolume: undefined, // number
              startIssue: undefined, // number
              endIssue: undefined, // number
              coverageNote: undefined, // note
              embargo: undefined
            }
          ],
          series: undefined,
          subjectArea: undefined,
          publisherName: undefined,
          dateFirstInPrint: undefined,
          dateFirstOnline: undefined,
          firstAuthor: undefined,
          firstEditor: undefined,
          publicationType: undefined,
          volumeNumber: undefined,
          editionStatement: undefined,
          medium: undefined,
          lastChangedExternal: undefined
        }
      }
    },
    computed: {
      header () {
        return !this.isReadonly ? (this.id ? (this.$i18n.t('header.edit.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel) : (this.$i18n.t('header.add.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel)) : (this.typeLabel + ' – ' + this.$i18n.tc('component.tipp.label'))
      },
      typeLabel () {
        return this.title?.type ? this.$i18n.tc('component.title.type.' + (typeof this.title.type === 'object' ? this.title.type.id : this.title.type)) : this.$i18n.tc('component.title.label')
      },
      isEdit () {
        return !!this.id
      },
      isReadonly () {
        return !accountModel.loggedIn || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isJournal () {
        return this.title?.type === 'Journal' || this.title.type.id === 'journal'
      },
      isBook () {
        return this.title?.type === 'Book' || this.title?.type?.id === 'book' || this.title?.type === 'Monograph' || this.title?.type?.id === 'monograph'
      },
      titleTypeString () {
        return (typeof this.title.type === 'object' ? this.title.type.id : this.title.type)
      },
      expansionIcon () {
        return this.coverageExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      },
      localDateCreated () {
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' }) : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' }) : ''
      },
      localValue: {
        get () {
          return !!this.value
        },
        set (localValue) {
          this.$emit('input', null)
        }
      },
      accessInterval: {
        get () {
          return [this.packageTitleItem.accessStartDate, this.packageTitleItem.accessEndDate]
        },
        set ([from, to]) {
          this.packageTitleItem.accessStartDate = from
          this.packageTitleItem.accessEndDate = to
        }
      }
    },
    async created () {
      this.selectedItem = this.selected

      if (this.selected) {
        this.packageTitleItem.hostPlatform = this.selectedItem.hostPlatform
        this.packageTitleItem.name = this.selectedItem.name
        this.packageTitleItem.pkg = this.selectedItem.pkg
        this.packageTitleItem.title = this.selectedItem.title
        this.packageTitleItem.url = this.selectedItem.url
        this.packageTitleItem.paymentType = this.selectedItem.paymentType
        this.packageTitleItem.accessStartDate = this.selectedItem.accessStartDate
        this.packageTitleItem.accessEndDate = this.selectedItem.accessEndDate
        this.packageTitleItem.ids = this.selectedItem.ids
        this.packageTitleItem.series = this.selectedItem.series
        this.packageTitleItem.subjectArea = this.selectedItem.subjectArea
        this.packageTitleItem.publisherName = this.selectedItem.publisherName
        this.packageTitleItem.dateFirstInPrint = this.selectedItem.dateFirstInPrint
        this.packageTitleItem.dateFirstOnline = this.selectedItem.dateFirstOnline
        this.packageTitleItem.firstAuthor = this.selectedItem.firstAuthor
        this.packageTitleItem.firstEditor = this.selectedItem.firstEditor
        this.packageTitleItem.publicationType = this.selectedItem.publicationType
        this.packageTitleItem.volumeNumber = this.selectedItem.volumeNumber
        this.packageTitleItem.editionStatement = this.selectedItem.editionStatement
        this.packageTitleItem.medium = this.selectedItem.medium
        this.packageTitleItem.lastChangedExternal = this.selectedItem.lastChangedExternal
        this.packageTitleItem.status = this.selectedItem.status
        this.updateUrl = this.selectedItem.updateUrl
        this.deleteUrl = this.selectedItem.deleteUrl
        this.platformSelection.push(this.selectedItem.hostPlatform)
        this.status = this.selectedItem.status
        this.lastUpdated = this.selectedItem.lastUpdated
        this.dateCreated = this.selectedItem.dateCreated
        this.allNames.name = this.selectedItem.name

        if (this.selectedItem?.coverageStatements?.length) {
          this.packageTitleItem.coverageStatements = this.selectedItem.coverageStatements.map(({ startDate, endDate, coverageDepth, coverageNote, startIssue, startVolume, endIssue, endVolume, embargo }) => ({
            startDate: startDate?.substr(0, 10),
            endDate: endDate?.substr(0, 10),
            coverageDepth,
            coverageNote,
            startIssue,
            startVolume,
            endIssue,
            endVolume,
            embargo
          }))
        }
        this.id = this.selectedItem.id
        this.packageTitleItem.id = this.id
        if (this.selectedItem.title?.type) {
          this.title.type = this.selectedItem.title.type
        } else {
          this.title.type = this.titleType
        }
      } else {
        this.title.type = this.titleType
        this.packageTitleItem.hostPlatform = this.parentPlatform
      }
      this.coverageExpanded = this.isJournal
    },
    methods: {
      async submitTipp () {
        if (this.selected && typeof this.selected.id === 'number') {
          const newTipp = {
            ...this.packageTitleItem,
            id: this.id
          }

          const response = await this.catchError({
            promise: tippServices.createOrUpdateTipp(newTipp, this.cancelToken.token),
            instance: this
          })

          if (response.status === 200) {
            this.$emit('edit', this.packageTitleItem)
            this.close()
          } else {
            console.log(response.status)
          }
        } else {
          this.packageTitleItem.title.type = this.title.type
          this.packageTitleItem.name = this.allNames.name

          const newTipp = {
            ...this.packageTitleItem,
            id: this.tempId(),
            titleId: this.packageTitleItem.title.id,
            popup: { value: this.packageTitleItem.title.name, label: 'tipp', type: 'GokbAddTitlePopup' },
            link: { value: this.packageTitleItem.title.name, route: EDIT_TITLE_ROUTE, id: 'titleId' },
            hostPlatformName: this.packageTitleItem.hostPlatform?.name,
            updateUrl: '',
            deleteUrl: '',
            isDeletable: true
          }

          this.$emit('add', newTipp)
          this.close()
        }
      },
      tempId () {
        return 'tempTippId' + Math.random().toString(36).substr(2, 5)
      },
      close () {
        this.localValue = false
      },
      decodeEmbargo () {
        const matches = this.packageTitleItem.coverageStatement.embargo?.match(/^([P,R]?)([0-9]*)([D,M,Y]?)$/)
        const [, type, duration, unit] = matches || []
        return { type, duration, unit }
      },
      doExpandCoverage () {
        this.coverageExpanded = !this.coverageExpanded
      },
      openDetails () {
        this.$router.push({ name: EDIT_TIPP_ROUTE, params: { id: this.id } })
      }
    }
  }
</script>
