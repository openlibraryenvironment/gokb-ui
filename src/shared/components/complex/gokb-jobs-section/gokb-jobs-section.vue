<template>
  <gokb-section
    expandable
    :sub-title="title"
    :items-total="totalNumberOfItems"
    :hide-default="hideDefault"
  >
    <template #buttons>
      <v-btn
        v-if="group && showGroupJobs"
        icon
        :title="$t('job.context.profile')"
        @click="switchContext"
      >
        <v-icon>
          mdi-account
        </v-icon>
      </v-btn>
      <v-btn
        v-else-if="group"
        icon
        :title="$t('job.context.group')"
        @click="switchContext"
      >
        <v-icon>
          mdi-account-group
        </v-icon>
      </v-btn>
      <v-btn
        icon
        :title="$t('btn.refresh')"
        @click="fetchJobs"
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
          mdi-sync-off
        </v-icon>
      </v-btn>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="tableHeaders"
      :items="jobs"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      hide-select
      @selected-items="selectedItems = $event"
      @retire-item="confirmCancelJob"
      @paginate="resultPaginate"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import profileServices from '@/shared/services/profile-services'
  import groupServices from '@/shared/services/curatory-group-services'
  import packageServices from '@/shared/services/package-services'
  import BaseComponent from '@/shared/components/base-component'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbJobsSection',
    components: {
      GokbConfirmationPopup
    },
    extends: BaseComponent,
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      group: {
        type: Object,
        required: false,
        default: undefined
      },
      autoRefresh: {
        type: Boolean,
        required: false,
        default: true
      },
      linkedComponent: {
        type: [String, Number],
        required: false,
        default: undefined
      },
      hideDefault: {
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
        selectedItems: [],
        jobPanel: 0,
        jobs: [],
        showGroupJobs: false,
        totalNumberOfItems: 0,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        interval: null,
        autoJobRefresh: true
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
        if (this.linkedComponent) {
          return [
            { text: this.$i18n.t('job.type'), align: 'start', value: 'popup', sortable: false },
            { text: this.$i18n.t('job.status'), align: 'start', value: 'status', sortable: false, width: '15%' },
            { text: this.$i18n.t('job.startTime'), align: 'start', value: 'startTime', sortable: false, width: '15%' },
            { text: this.$i18n.t('job.endTime'), align: 'start', value: 'endTime', sortable: false, width: '15%' },
          ]
        } else {
          return [
            { text: this.$i18n.t('job.type'), align: 'start', value: 'popup', sortable: false, width: '25%' },
            { text: this.$i18n.t('job.linkedComponent'), align: 'start', value: 'link', sortable: false, width: '40%' },
            { text: this.$i18n.t('job.status'), align: 'start', value: 'status', sortable: false, width: '10%' },
            { text: this.$i18n.t('job.startTime'), align: 'start', value: 'startTime', sortable: false, width: '10%' },
            { text: this.$i18n.t('job.endTime'), align: 'start', value: 'endTime', sortable: false, width: '10%' },
          ]
        }
      },
      title () {
        return this.$i18n.tc('job.label', 2) + (this.showGroupJobs ? (' (' + this.group.name + ')') : '')
      }
    },
    watch: {
      '$i18n.locale' (l) {
        this.fetchJobs()
      }
    },
    created () {
      this.fetchJobs()
      clearInterval(this.interval)
      this.interval = undefined

      this.autoJobRefresh = this.autoRefresh
    },
    activated () {
      clearInterval(this.interval)
      this.interval = undefined

      this.autoJobRefresh = this.autoRefresh

      this.startAutoUpdate()
    },
    activated () {
      if (this.autoJobRefresh && !this.interval) {
        this.startAutoUpdate()
      }
    },
    deactivated () {
      clearInterval(this.interval)
      this.interval = undefined
    },
    preDestroy () {
      clearInterval(this.interval)
      this.interval = undefined
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      resultPaginate (page) {
        this.fetchJobs({ page })
      },
      async fetchJobs ({ page } = { page: undefined }) {
        let lookupService = profileServices

        if (this.linkedComponent) {
          lookupService = packageServices
        } else if (this.showGroupJobs) {
          lookupService = groupServices
        }

        const result = await this.catchError({
          promise: lookupService.getJobs({
            offset: this.options.page ? (this.options.page - 1) * this.options.itemsPerPage : 0,
            ...(this.showGroupJobs ? { id: this.group.id } : {}),
            ...(!!this.linkedComponent ? { id: this.linkedComponent } : {}),
            combined: true,
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

        if (result?.status === 200) {
          this.jobs = result.data?.data?.map(record => (
              {
                id: record.uuid,
                type: record.type,
                popup: { value: (record.type ? this.$i18n.t('job.jobTypes.' + record.type.name) : this.$i18n.t('job.jobTypes.Unknown')), label: 'job', type: 'GokbEditJobPopup' },
                componentId: record.linkedItem?.id || null,
                componentType: record.linkedItem && this.$i18n.tc('component.' + record.linkedItem.type.toLowerCase() + '.label'),
                link: record.linkedItem ? { value: record.linkedItem?.name, route: componentRoutes[record.linkedItem.type.toLowerCase()], id: 'componentId' } : {},
                archived: !!record.status || false,
                progress: record.progress,
                messages: record.messages,
                startTime: new Date(record.startTime).toLocaleString('sv'),
                endTime: record.endTime ? new Date(record.endTime).toLocaleString('sv') : '',
                status: this.determineStatusText(record)
              }
            )
          )
          this.totalNumberOfItems = result.data?._pagination?.total
        }
      },
      determineStatusText (record) {
        let result = undefined

        if (record.status) {
          result = this.$i18n.t('job.' + record.status.toLowerCase())
        } else {
          if (record.begun) {
            if (record.endTime) {
              if (record.cancelled) {
                result = this.$i18n.t('job.cancelled') + ' (' + record.progress + '%)'
              } else {
                result = this.$i18n.t('job.finished')
              }
            } else {
              result = record.progress + '%'
            }
          } else {
            result = this.$i18n.t('job.waiting')
          }
        }

        return result
      },
      switchContext () {
        this.showGroupJobs = !this.showGroupJobs
        this.fetchJobs()
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

        this.interval = setInterval(function () {
          this.fetchJobs()
        }.bind(this), 1000)
      },
      stopAutoUpdate () {
        this.autoJobRefresh = false
        clearInterval(this.interval)
        this.interval = undefined
      }
    }
  }
</script>
