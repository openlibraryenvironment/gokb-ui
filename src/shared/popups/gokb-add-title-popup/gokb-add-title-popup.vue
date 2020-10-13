<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="800"
    @submit="submitTipp"
  >
    <gokb-error-component :value="error" />
    <gokb-section :sub-title="$t('component.general.general')">
      <gokb-state-select-field
        v-if="status"
        v-model="status"
        :deletable="!!deleteUrl"
        :editable="!!updateUrl"
      />
      <gokb-title-field
        v-model="packageTitleItem.title"
        :type-filter="title.type.id"
        :label="$tc('component.title.label')"
        :readonly="isEdit || isReadonly"
        return-object
      />
      <gokb-search-package-field
        v-if="packageTitleItem.title"
        v-model="packageTitleItem.pkg"
        :label="$tc('component.package.label')"
        :readonly="true"
        return-object
      />
    </gokb-section>
    <gokb-section :sub-title="$t('component.tipp.access')">
      <gokb-search-platform-field
        v-model="packageTitleItem.hostPlatform"
        :items="platformSelection"
        :label="$tc('component.platform.label')"
        :readonly="isEdit || isReadonly"
        return-object
      />
      <gokb-date-range-field
        v-model="accessInterval"
        :disabled="isReadonly"
        :label="$t('component.tipp.accessPeriod')"
      />
      <gokb-url-field
        v-model="packageTitleItem.url"
        :disabled="isReadonly"
        :label="$tc('component.tipp.url.label')"
      />
    </gokb-section>
    <gokb-section
      expandable
      :hide-default="true"
      :sub-title="$t('component.tipp.coverage.label')"
      :items-total="packageTitleItem.coverageStatements.length"
    >
      <div
        v-for="statement in packageTitleItem.coverageStatements"
        :key="statement.id"
      >
        <v-row>
          <v-col>
            <gokb-coverage-field
              v-model="statement.coverageDepth"
              :readonly="isReadonly"
              :label="$t('component.tipp.coverage.depth')"
            />
            <v-row v-if="isJournal">
              <v-col>
                <gokb-date-field
                  v-model="statement.startDate"
                  :readonly="isReadonly"
                  :label="$t('component.tipp.coverage.startDate')"
                />
              </v-col>
              <v-col>
                <gokb-date-field
                  v-model="statement.endDate"
                  :readonly="isReadonly"
                  :label="$t('component.tipp.coverage.endDate')"
                />
              </v-col>
            </v-row>
            <v-row v-if="isJournal">
              <v-col>
                <gokb-text-field
                  v-model="statement.startIssue"
                  :disabled="isReadonly"
                  :label="$t('component.tipp.coverage.startIssue')"
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="statement.endIssue"
                  :disabled="isReadonly"
                  :label="$t('component.tipp.coverage.endIssue')"
                />
              </v-col>
            </v-row>
            <v-row v-if="isJournal">
              <v-col>
                <gokb-text-field
                  v-model="statement.startVolume"
                  :disabled="isReadonly"
                  :label="$t('component.tipp.coverage.startVolume')"
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="statement.endVolume"
                  :disabled="isReadonly"
                  :label="$t('component.tipp.coverage.endVolume')"
                />
              </v-col>
            </v-row>
            <gokb-textarea-field
              v-model="statement.coverageNote"
              :disabled="isReadonly"
              :label="$t('component.tipp.coverage.note')"
            />
            <gokb-embargo-field
              v-model="statement.embargo"
              :readonly="isReadonly"
            />
          </v-col>
        </v-row>
      </div>
    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ updateUrl ? $t('btn.cancel') : $t('btn.close') }}
      </gokb-button>
      <gokb-button
        v-if="updateUrl || !id"
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
  import { EDIT_TITLE_ROUTE } from '@/router/route-paths'

  export default {
    name: 'GokbAddTitlePopup',
    extends: BaseComponent,
    props: {
      value: {
        type: Number,
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
        packageTitleItem: {
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          url: undefined,
          accessStartDate: undefined,
          accessEndDate: undefined,
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
          ]
        }
      }
    },
    computed: {
      header () {
        return this.isEdit ? (this.id ? (this.$i18n.t('header.edit.label', [this.typeLabel]) + ' ' + this.$i18n.t('component.tipp.access')) : (this.$i18n.t('header.add.label', [this.typeLabel]) + ' ' + this.$i18n.t('component.tipp.access'))) : (this.typeLabel + ' ' + this.$i18n.t('component.tipp.access'))
      },
      typeLabel () {
        return this.title.type.text || this.$i18n.tc('component.title.label')
      },
      isEdit () {
        return !!this.id
      },
      isReadonly () {
        return !accountModel.loggedIn || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isJournal () {
        return this.title.type.id === 'journal'
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
        this.packageTitleItem.pkg = this.selectedItem.pkg
        this.packageTitleItem.title = this.selectedItem.title
        this.packageTitleItem.url = this.selectedItem.url
        this.status = this.selectedItem.status
        this.packageTitleItem.accessStartDate = this.selectedItem.accessStartDate
        this.packageTitleItem.accessEndDate = this.selectedItem.accessEndDate
        this.updateUrl = this.selectedItem.updateUrl
        this.deleteUrl = this.selectedItem.deleteUrl
        this.platformSelection.push(this.selectedItem.hostPlatform)

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
        this.title.type = { id: this.selectedItem.title.type.toLowerCase(), text: this.$i18n.tc('component.title.type.' + this.selectedItem.title.type) }
      } else {
        this.title.type = this.titleType
        this.packageTitleItem.hostPlatform = this.parentPlatform
      }
    },
    methods: {
      async submitTipp () {
        if (this.selected) {
          const newTipp = {
            pkg: this.packageTitleItem.pkg,
            title: this.packageTitleItem.title,
            hostPlatform: this.packageTitleItem.hostPlatform,
            accessStartDate: this.packageTitleItem.accessStartDate,
            status: this.status,
            accessEndDate: this.packageTitleItem.accessEndDate,
            url: this.packageTitleItem.url,
            coverageStatements: this.packageTitleItem.coverageStatements.map(({ startDate, endDate, startIssue, endIssue, startVolume, endVolume, embargo, coverageNote, coverageDepth }) => ({
              startDate,
              endDate,
              coverageDepth,
              startIssue,
              endIssue,
              startVolume,
              endVolume,
              embargo,
              coverageNote
            })),
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
          console.log('Adding new TIPP!')
          const newTipp = {
            ...this.packageTitleItem,
            id: this.tempId(),
            title: { type: this.title.type },
            titleId: this.packageTitleItem.title.id,
            popup: { value: 'Show Info', label: 'tipp', type: 'GokbAddTitlePopup' },
            link: { value: this.packageTitleItem.title.name, route: EDIT_TITLE_ROUTE, id: 'titleId' },
            hostPlatformName: this.packageTitleItem.hostPlatform?.name,
            updateUrl: null,
            deleteUrl: null
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
      }
    }
  }
</script>
