<template>
  <gokb-section
    expandable
    sub-title="Jobs"
  >
    <template #buttons>
      <v-btn
        icon
        :title="$t('btn.refresh')"
        @click="refreshAllJobs"
      >
        <v-icon>
          mdi-refresh
        </v-icon>
      </v-btn>
      <v-btn
        v-if="!autoJobRefresh"
        icon
        :title="$t('btn.enableSync')"
        @click="startAutoUpdate"
      >
        <v-icon>
          mdi-sync
        </v-icon>
      </v-btn>
      <v-btn
        v-else
        icon
        :title="$t('btn.disableSync')"
        @click="stopAutoUpdate"
      >
        <v-icon>
          sync_disabled
        </v-icon>
      </v-btn>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <v-expansion-panels v-model="jobPanel">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h4>{{ $t('job.active.label') }}</h4>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <gokb-table
            :headers="tableHeaders"
            :items="jobs"
            :editable="isEditable"
            :selected-items="selectedItems"
            :total-number-of-items="totalNumberOfItems"
            :options.sync="options"
            @selected-items="selectedItems = $event"
            @retire-item="confirmCancelJob"
            @paginate="resultPaginate"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header click="toggleOldResults">
          <h4>{{ $t('job.archived.label') }}</h4>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <gokb-table
            :headers="tableHeaders"
            :items="oldResults"
            :editable="isEditable"
            :selected-items="selectedOldResults"
            :total-number-of-items="totalOldResults"
            :options.sync="optionsOldResults"
            @selected-items="selectedOldResults = $event"
            @paginate="oldResultPaginate"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import profileServices from '@/shared/services/profile-services'
  import BaseComponent from '@/shared/components/base-component'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbJobsSection',
    components: {
      GokbConfirmationPopup
    },
    extends: BaseComponent,
    props: {
      value: {
        type: Number,
        required: true,
        default: undefined
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        optionsOldResults: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        selectedOldResults: [],
        jobPanel: 0,
        jobs: [],
        oldResults: [],
        totalNumberOfItems: 0,
        totalOldResults: 0,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        interval: null,
        autoJobRefresh: false
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      isEditable () {
        return !this.disabled
      },
      tableHeaders () {
        return [
          { text: this.$i18n.t('job.type'), align: 'left', value: 'popup', sortable: false, width: '25%' },
          { text: this.$i18n.t('job.linkedComponent'), align: 'left', value: 'link', sortable: false, width: '40%' },
          { text: this.$i18n.t('job.status'), align: 'left', value: 'status', sortable: false, width: '10%' },
          { text: this.$i18n.t('job.startTime'), align: 'left', value: 'startTime', sortable: false, width: '10%' },
          { text: this.$i18n.t('job.endTime'), align: 'left', value: 'endTime', sortable: false, width: '10%' },
        ]
      }
    },
    watch: {
      $route (to, from) {
        if (to.path !== '/home') {
          clearInterval(this.interval)
        }
      },
      '$i18n.locale' (l) {
        this.fetchJobs()
        this.fetchOldResults()
      }
    },
    created () {
      this.fetchJobs()
      this.fetchOldResults()
    },
    preDestroy () {
      clearInterval(this.interval)
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      resultPaginate (page) {
        this.fetchJobs({ page })
      },
      oldResultPaginate (page) {
        this.fetchOldResults({ page })
      },
      refreshAllJobs () {
        this.fetchJobs()
        this.fetchOldResults()
      },
      async fetchJobs ({ page } = { page: undefined }) {
        const result = await this.catchError({
          promise: profileServices.getJobs({
            offset: this.options.page ? (this.options.page - 1) * this.options.itemsPerPage : 0,
            limit: this.options.itemsPerPage
          }, this.cancelToken.token),
          instance: this
        })

        const componentRoutes = {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
        }

        if (result.status === 200) {
          this.jobs = result.data?.data?.map(
            ({ uuid, type, linkedItem, startTime, begun, progress, endTime, messages, cancelled }) => (
              {
                id: uuid,
                type,
                popup: { value: (type ? this.$i18n.t('job.jobTypes.' + type.name) : this.$i18n.t('job.jobTypes.Unknown')), label: 'job', type: 'GokbEditJobPopup' },
                componentId: linkedItem?.id || null,
                componentType: this.$i18n.tc('component.' + linkedItem.type.toLowerCase() + '.label'),
                link: linkedItem ? { value: linkedItem?.name, route: componentRoutes[linkedItem.type.toLowerCase()], id: 'componentId' } : {},
                progress,
                messages,
                startTime: new Date(startTime).toLocaleString(this.$i18n.locale),
                endTime: endTime ? new Date(endTime).toLocaleString(this.$i18n.locale) : '',
                status: (begun ? (endTime ? (cancelled ? (this.$i18n.t('job.cancelled') + ' (' + progress + '%)') : this.$i18n.t('job.finished')) : progress + '%') : this.$i18n.t('job.waiting'))
              }
            )
          )
          this.totalNumberOfItems = result.data?._pagination?.total
        }
      },
      async fetchOldResults ({ page } = { page: undefined }) {
        const result = await this.catchError({
          promise: profileServices.getJobs({
            archived: true,
            offset: this.optionsOldResults.page ? (this.optionsOldResults.page - 1) * this.optionsOldResults.itemsPerPage : 0,
            limit: this.optionsOldResults.itemsPerPage
          }, this.cancelToken.token),
          instance: this
        })

        const componentRoutes = {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
        }

        if (result.status === 200) {
          this.oldResults = result.data?.data?.map(
            ({ uuid, type, linkedItem, startTime, endTime, status }) => (
              {
                id: uuid,
                type,
                archived: true,
                popup: { value: (type ? this.$i18n.t('job.jobTypes.' + type.name) : this.$i18n.t('job.jobTypes.Unknown')), label: 'job', type: 'GokbEditJobPopup' },
                componentId: linkedItem?.id || null,
                componentType: this.$i18n.tc('component.' + linkedItem.type.toLowerCase() + '.label'),
                link: linkedItem ? { value: linkedItem?.name, route: componentRoutes[linkedItem.type.toLowerCase()], id: 'componentId' } : {},
                startTime: new Date(startTime).toLocaleString(this.$i18n.locale),
                endTime: new Date(endTime).toLocaleString(this.$i18n.locale),
                status: this.$i18n.t('job.' + status.toLowerCase())
              }
            )
          )
          this.totalOldResults = result.data?._pagination?.total
        }
      },
      confirmCancelJob ({ id }) {
        this.actionToConfirm = '_cancelJob'
        this.messageToConfirm = { text: 'popups.confirm.cancel.list', vars: [this.$i18n.tc('job.label'), id] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      async _cancelJob (id) {
        this.catchError({
          promise: profileServices.cancelJob(id, this.cancelToken.token),
          instance: this
        })
      },
      startAutoUpdate () {
        this.autoJobRefresh = true
        this.fetchJobs()
        this.fetchOldResults()

        this.interval = setInterval(function () {
          this.fetchJobs()
          this.fetchOldResults()
        }.bind(this), 1000)
      },
      stopAutoUpdate () {
        this.autoJobRefresh = false
        clearInterval(this.interval)
      }
    }
  }
</script>
