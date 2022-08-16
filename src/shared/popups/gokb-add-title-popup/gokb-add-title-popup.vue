<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="1000"
    @submit="submitTipp"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert
        type="success"
        dismissible
      >
        {{ localSuccessMessage }}
      </v-alert>
    </span>
    <span v-if="errorMsg">
      <v-alert
        type="error"
        dismissible
      >
        {{ localErrorMessage }}
      </v-alert>
    </span>
    <v-row dense>
      <v-col>
        <gokb-section
          expandable
          :sub-title="$t('component.general.general')"
        >
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
          <v-row>
            <v-col cols="6">
              <gokb-state-select-field
                v-if="status"
                v-model="packageTitleItem.status"
                :deletable="!!deleteUrl"
                :editable="!!updateUrl"
              />
            </v-col>
            <v-col cols="6">
              <gokb-uuid-field
                v-if="id"
                :label="$t('component.general.uuid.label')"
                :value="uuid"
                path="/package-title"
                dense
              />
            </v-col>
          </v-row>
          <v-row
            dense
            class="mt-4"
          >
            <v-col>
              <gokb-title-field
                v-model="packageTitleItem.title"
                :type-filter="titleTypeId"
                :label="$tc('component.title.label')"
                dense
                show-link
                :readonly="isReadonly"
                return-object
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <gokb-search-package-field
                v-if="isEdit"
                v-model="packageTitleItem.pkg"
                :label="$tc('component.package.label')"
                dense
                readonly
                return-object
              />
            </v-col>
          </v-row>
          <v-row class="pt-4" />
        </gokb-section>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <gokb-section
          expandable
          :mark-required="!isReadonly"
          :sub-title="$t('component.tipp.access.label')"
          hide-default
        >
          <v-row
            dense
            class="mt-4"
          >
            <v-col>
              <gokb-search-platform-field
                v-model="packageTitleItem.hostPlatform"
                :items="platformSelection"
                :label="$tc('component.platform.label')"
                :readonly="isEdit || isReadonly"
                required
                dense
                return-object
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <gokb-date-field
                v-model="packageTitleItem.accessStartDate"
                :readonly="isReadonly"
                :label="$t('component.tipp.accessStartDate')"
              />
            </v-col>
            <v-col cols="4">
              <gokb-date-field
                v-model="packageTitleItem.accessEndDate"
                :readonly="isReadonly"
                :label="$t('component.tipp.accessEndDate')"
              />
            </v-col>
            <v-col cols="4">
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
                ref="tippUrl"
                v-model="packageTitleItem.url"
                :disabled="isReadonly"
                required
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
        <gokb-identifier-section
          v-model="packageTitleItem.ids"
          :target-type="titleTypeString"
          :mark-required="!isEdit"
          :disabled="isReadonly"
          :expanded="false"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-toolbar
          dense
          flat
        >
          <span class="text-h6">
            {{ $t('component.tipp.coverage.label') }}
          </span>
          <v-btn
            icon
            @click="doExpandCoverage"
          >
            <v-icon>{{ expansionIcon }}</v-icon>
          </v-btn>
          <v-spacer />
          <v-toolbar-items class="pa-2">
            <gokb-button
              v-if="!isReadonly && coverageExpanded"
              icon-id="mdi-plus"
              default
              @click="addNewCoverage"
            >
              {{ $t('btn.add') }}
            </gokb-button>
          </v-toolbar-items>
        </v-toolbar>
        <div v-if="coverageExpanded">
          <v-row
            v-for="(statement, idx) in packageTitleItem.coverageStatements"
            :key="idx"
            dense
          >
            <v-col>
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
                  <v-col
                    v-if="!isReadonly"
                    cols="1"
                    class="pt-6 mr-2"
                  >
                    <v-btn
                      icon
                      :title="$t('btn.delete')"
                      @click="removeCoverage(idx)"
                    >
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="isJournal">
                  <v-col md="4">
                    <gokb-date-field
                      v-model="statement.startDate"
                      :readonly="isReadonly"
                      dense
                      :label="$t('component.tipp.coverage.startDate')"
                    />
                  </v-col>
                  <v-col md="4">
                    <gokb-text-field
                      v-model="statement.startVolume"
                      :disabled="isReadonly"
                      dense
                      :label="$t('component.tipp.coverage.startVolume')"
                    />
                  </v-col>
                  <v-col md="4">
                    <gokb-text-field
                      v-model="statement.startIssue"
                      :disabled="isReadonly"
                      dense
                      :label="$t('component.tipp.coverage.startIssue')"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="isJournal">
                  <v-col md="4">
                    <gokb-date-field
                      v-model="statement.endDate"
                      :readonly="isReadonly"
                      dense
                      :label="$t('component.tipp.coverage.endDate')"
                    />
                  </v-col>
                  <v-col md="4">
                    <gokb-text-field
                      v-model="statement.endVolume"
                      :disabled="isReadonly"
                      dense
                      :label="$t('component.tipp.coverage.endVolume')"
                    />
                  </v-col>
                  <v-col md="4">
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
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <gokb-prices-section
          v-model="packageTitleItem.prices"
          :disabled="isReadonly"
          :expanded="false"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <gokb-section
          :sub-title="$t('component.tipp.other.label')"
          hide-default
          expandable
        >
          <v-row>
            <v-col>
              <gokb-text-field
                v-model="packageTitleItem.publisherName"
                :disabled="isReadonly"
                :label="$tc('component.title.publisher.label')"
              />
            </v-col>
            <v-col>
              <gokb-text-field
                v-model="packageTitleItem.series"
                :disabled="isReadonly"
                :label="$t('component.tipp.series.label')"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <gokb-text-field
                v-model="packageTitleItem.subjectArea"
                :disabled="isReadonly"
                dense
                :label="$t('component.tipp.subjectArea.label')"
              />
            </v-col>
            <v-col>
              <gokb-state-field
                v-model="packageTitleItem.medium"
                :init-item="packageTitleItem.medium"
                width="100%"
                dense
                message-path="component.title.medium"
                url="refdata/categories/TitleInstancePackagePlatform.Medium"
                :label="$t('component.title.medium.label')"
                :readonly="isReadonly"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <gokb-text-field
                v-model="packageTitleItem.importId"
                :disabled="isEdit"
                dense
                :label="$t('component.tipp.importId.label')"
              />
            </v-col>
            <v-col>
              <gokb-state-field
                v-model="packageTitleItem.publicationType"
                :init-item="packageTitleItem.publicationType || titleType"
                width="100%"
                dense
                return-object
                message-path="component.tipp.publicationType"
                url="refdata/categories/TitleInstancePackagePlatform.PublicationType"
                :label="$t('component.tipp.publicationType.label')"
                :readonly="isReadonly"
              />
            </v-col>
            <v-col>
              <gokb-date-field
                v-model="packageTitleItem.lastChangedExternal"
                readonly
                dense
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
            <v-col>
              <gokb-text-field
                v-model="packageTitleItem.editionStatement"
                :disabled="isReadonly"
                dense
                :label="$t('component.title.editionStatement')"
              />
            </v-col>
            <v-col cols="3">
              <gokb-text-field
                v-model="packageTitleItem.volumeNumber"
                :disabled="isReadonly"
                dense
                :label="$t('component.title.volumeNumber')"
              />
            </v-col>
          </v-row>
        </gokb-section>
      </v-col>
    </v-row>
    <template #buttons>
      <v-btn
        v-if="isEdit"
        class="ml-6 btn-default"
        :to="{ name: '/package-title', params: { id: id} }"
      >
        {{ $t('component.tipp.toFullView') }}
      </v-btn>
      <v-spacer />
      <v-spacer />
      <gokb-button
        class="mr-6"
        color="secondary"
        @click="close"
      >
        {{ updateUrl ? $t('btn.cancel') : $t('btn.close') }}
      </gokb-button>
      <gokb-button
        v-if="updateUrl || !id"
        :disabled="!isValid"
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

  const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/

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
        urlValid: false,
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
        successMsg: undefined,
        errorMsg: undefined,
        status: undefined,
        version: undefined,
        items: [],
        id: undefined,
        uuid: undefined,
        allNames: { name: undefined, alts: [] },
        lastUpdated: undefined,
        dateCreated: undefined,
        packageTitleItem: {
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          importId: undefined,
          status: undefined,
          paymentType: undefined,
          url: undefined,
          name: undefined,
          accessStartDate: undefined,
          accessEndDate: undefined,
          prices: [],
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
        return !!this.id && !!this.version
      },
      isReadonly () {
        return !accountModel.loggedIn || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isJournal () {
        return this.title?.type === 'Journal' || this.title?.type === 'Serial' || this.title?.type?.id === 'journal' || this.titleType?.id === 'Journal' || this.packageTitleItem.publicationType?.name === 'Serial'
      },
      isBook () {
        return this.title?.type === 'Book' || this.title?.type?.id === 'book' || this.title?.type === 'Monograph' || this.title?.type?.id === 'monograph' || this.packageTitleItem.publicationType?.name === 'Monograph'
      },
      isValid () {
        return !!this.allNames.name && !!this.packageTitleItem.hostPlatform && (this.isEdit || this.packageTitleItem.ids.length > 0) && this.packageTitleItem.url && URL_REGEX.test(this.packageTitleItem.url)
      },
      titleTypeString () {
        return (typeof this.title?.type === 'object' ? this.title.type.id : this.title?.type || this.packageTitleItem.publicationType.name)
      },
      titleTypeId () {
        return this.title?.type?.id || this.packageTitleItem.publicationType?.name || this.titleType?.id
      },
      expansionIcon () {
        return this.coverageExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      },
      isCoverageExpanded () {
        return this.coverageExpanded
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.tipp.label')]) : undefined
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.tipp.label')]) : undefined
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
        this.packageTitleItem.uuid = this.selectedItem.uuid
        this.packageTitleItem.paymentType = this.selectedItem.paymentType
        this.packageTitleItem.accessStartDate = this.selectedItem.accessStartDate
        this.packageTitleItem.accessEndDate = this.selectedItem.accessEndDate
        this.packageTitleItem.ids = this.selectedItem.ids
        this.packageTitleItem.prices = this.selectedItem.prices
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
        this.packageTitleItem.importId = this.selectedItem.importId
        this.updateUrl = this.selectedItem.updateUrl
        this.deleteUrl = this.selectedItem.deleteUrl
        this.platformSelection.push(this.selectedItem.hostPlatform)
        this.status = this.selectedItem.status
        this.version = this.selectedItem.version
        this.lastUpdated = this.selectedItem.lastUpdated
        this.dateCreated = this.selectedItem.dateCreated
        this.allNames.name = this.selectedItem.name
        this.allNames.alts = this.selectedItem.variantNames

        if (this.selectedItem?.coverageStatements?.length) {
          this.packageTitleItem.coverageStatements = this.selectedItem.coverageStatements.map(({ startDate, endDate, coverageDepth, coverageNote, startIssue, startVolume, endIssue, endVolume, embargo }) => ({
            startDate: startDate && this.buildDateString(startDate),
            endDate: endDate && this.buildDateString(endDate),
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
        this.uuid = this.selectedItem.uuid
        this.packageTitleItem.id = this.id
        if (this.selectedItem.title?.type) {
          this.title.type = this.selectedItem.title.type
        } else {
          this.title.type = this.titleType
        }
      } else {
        this.title.type = this.titleType
        this.packageTitleItem.hostPlatform = this.parentPlatform
        this.publicationType = this.titleType
      }
      this.coverageExpanded = !this.isEdit && (this.title.type === 'Serial' || this.title.type === 'serial')
    },
    methods: {
      async submitTipp () {
        if (this.selected && typeof this.selected.id === 'number') {
          const activeGroup = accountModel.activeGroup()

          const newTipp = {
            ...this.packageTitleItem,
            name: this.allNames.name,
            ids: this.packageTitleItem.ids.map(id => ({ value: id.value, type: id.namespace })),
            prices: this.packageTitleItem.prices.map(price => ({ ...price, id: (typeof price.id === 'number' ? price.id : null) })),
            publicationType: (this.packageTitleItem.publicationType ? this.packageTitleItem.publicationType.name : null),
            variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({ variantName, locale, variantType, id: typeof id === 'number' ? id : null })),
            id: this.id,
            activeGroup: activeGroup
          }

          const response = await this.catchError({
            promise: tippServices.createOrUpdateTipp(newTipp, this.cancelToken.token),
            instance: this
          })

          if (response.status < 400) {
            const edited = {
              ...this.packageTitleItem,
              statusLocal: this.$i18n.t('component.general.status.' + this.packageTitleItem.status.name + '.label'),
              popup: { value: (this.pkg ? (this.packageTitleItem.title ? this.packageTitleItem.title.name : this.packageTitleItem.name) : this.packageTitleItem.pkg.name), label: 'tipp', type: 'GokbAddTitlePopup' },
              hostPlatformName: this.packageTitleItem.hostPlatform?.name,
              titleType: this.title.type,
            }
            this.$emit('edit', edited)
            this.close()
          } else {
            if (response.status === 409) {
              this.errorMsg = 'error.update.409'
            } else if (response.status === 500) {
              this.errorMsg = 'error.general.500'
            } else {
              this.errorMsg = this.isEdit ? 'error.update.400' : 'error.create.400'
              this.errors = response.data.error
            }
          }
        } else {
          if (this.packageTitleItem.title) {
            this.packageTitleItem.title.type = this.title.type
          }
          this.packageTitleItem.name = this.allNames.name

          const newTipp = {
            ...this.packageTitleItem,
            id: this.tempId(),
            connectedTitleId: this.packageTitleItem.title?.id || null,
            ids: this.packageTitleItem.ids.map(ido => ({ value: ido.value, type: ido.namespace })),
            prices: this.packageTitleItem.prices.map(price => ({ ...price, type: price.priceType, id: (typeof price.id === 'number' ? price.id : null) })),
            variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({ variantName, locale, variantType, id: typeof id === 'number' ? id : null })),
            publicationType: (this.packageTitleItem.publicationType ? this.packageTitleItem.publicationType.name : null),
            popup: { value: this.packageTitleItem.name, label: 'tipp', type: 'GokbAddTitlePopup' },
            link: { value: (this.packageTitleItem.title?.name), route: EDIT_TITLE_ROUTE, id: 'connectedTitleId' },
            hostPlatformName: this.packageTitleItem.hostPlatform?.name,
            version: this.version,
            updateUrl: '',
            deleteUrl: '',
            isDeletable: true,
            _pending: 'added'
          }

          if (this.selected?.id) {
            this.$emit('edit', newTipp)
          } else {
            this.$emit('add', newTipp)
          }
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
      },
      addNewCoverage () {
        this.packageTitleItem.coverageStatements.push(this.coverageObject)
      },
      removeCoverage (idx) {
        this.packageTitleItem.coverageStatements.splice(idx, 1)

        if (this.packageTitleItem.coverageStatements.length === 0) {
          this.packageTitleItem.coverageStatements.push(this.coverageObject)
        }
      }
    }
  }
</script>
