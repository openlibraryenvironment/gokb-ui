<template>
  <gokb-section
    expandable
    sub-title="Jobs"
    :items-total="totalNumberOfItems"
  >
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
      @selected-items="selectedItems = $event"
      @delete-item="cancelJob"
      @paginate="resultPaginate"
    />
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
        selectedItems: [],
        jobs: [],

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        interval: null
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.jobs.length
      },
      isEditable () {
        return !this.disabled
      }
    },
    watch: {
      $route (to, from) {
        if (to.path !== '/home') {
          clearInterval(this.interval)
        } else {
          this.interval = setInterval(function () {
            this.fetchJobs(this.page)
          }.bind(this), 2000)
        }
      }
    },
    created () {
      this.tableHeaders = [
        { text: 'ID', align: 'left', value: 'id', sortable: false, width: '10%' },
        { text: this.$i18n.t('job.description'), align: 'left', value: 'popup', sortable: false, width: '40%' },
        { text: this.$i18n.t('job.status'), align: 'left', value: 'status', sortable: false, width: '20%' },
        { text: this.$i18n.t('job.startTime'), align: 'left', value: 'startTime', sortable: false, width: '15%' },
        { text: this.$i18n.t('job.endTime'), align: 'left', value: 'endTime', sortable: false, width: '15%' },
      ]
      this.fetchJobs(this.page)

      this.interval = setInterval(function () {
        this.fetchJobs(this.page)
      }.bind(this), 2000)
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
      async fetchJobs ({ page } = { page: undefined }) {
        const result = await this.catchError({
          promise: profileServices.getJobs({
            offset: page ? (page - 1) * this.options.itemsPerPage : 0,
            limit: this.options.itemsPerPage
          }, this.cancelToken.token),
          instance: this
        })

        if (result.status === 200) {
          this.jobs = result.data?.data?.map(
            ({ id, description, startTime, begun, progress, endTime, messages }) => (
              {
                id,
                popup: { value: description, label: 'job', type: 'GokbEditJobPopup' },
                progress,
                messages,
                startTime: new Date(startTime).toLocaleString(this.$i18n.locale),
                endTime: new Date(endTime).toLocaleString(this.$i18n.locale),
                status: (begun ? (endTime ? this.$i18n.t('job.finished') : progress + '%') : this.$i18n.t('job.waiting'))
              }
            )
          )
        }
      },
      cancelJob () {

      }
    }
  }
</script>
