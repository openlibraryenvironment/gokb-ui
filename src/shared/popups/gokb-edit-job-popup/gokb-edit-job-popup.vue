<template>
  <gokb-dialog
    v-model="localValue"
    :title="$t('job.details')"
    width="70%"
    @submit="close"
  >
    <v-row>
      <v-col md="4">
        <gokb-text-field
          v-model="localType"
          disabled
          :label="$i18n.t('job.type')"
        />
      </v-col>
    </v-row>
    <v-row v-if="!!selectedItem.componentId">
      <v-col>
        <div
          v-if="!!selectedItem.link"
          class="primary--text"
        >
          {{ $i18n.tc('component.package.label') }}
        </div>
        <router-link
          v-if="!!selectedItem.link"
          :style="{ color: 'primary' }"
          :to="{ name: '/package', params: { 'id': selectedItem.componentId } }"
        >
          {{ selectedItem.link.value || $i18n.tc('component.package.label') + ' ' + selectedItem.componentId }}
        </router-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <gokb-text-field
          v-model="selectedItem.startTime"
          disabled
          :label="$i18n.t('job.startTime')"
        />
      </v-col>
      <v-col md="4">
        <gokb-text-field
          v-model="selectedItem.endTime"
          disabled
          :label="$i18n.t('job.endTime')"
        />
      </v-col>
    </v-row>
    <v-row v-if="!!selectedItem.results">
      <v-col>
        <div
          class="primary--text"
        >
          {{ selectedItem.dryRun ? $i18n.t('job.report.dryRunLabel') : $i18n.t('job.report.label') }}
        </div>
        <div v-if="!!selectedItem.results.report">
          <span class="mr-4">{{ $i18n.t('job.report.invalid.label') }}: {{ selectedItem.results.report.invalid }}/{{ selectedItem.results.report.numRows }}</span>
          <span v-if="!!selectedItem.results.report.hasOwnProperty('previous')" class="mr-4">{{ $i18n.t('job.report.previous.label') }}: {{ selectedItem.results.report.previous }}</span>
          <span v-if="!!selectedItem.results.report.hasOwnProperty('matched')" class="mr-4">{{ $i18n.t('job.report.matched.label') }}: {{ selectedItem.results.report.matched }}</span>
          <span v-if="!!selectedItem.results.report.hasOwnProperty('partial')" class="mr-4">{{ $i18n.t('job.report.partial.label') }}: {{ selectedItem.results.report.partial }}</span>
          <span v-if="!!selectedItem.results.report.hasOwnProperty('created')" class="mr-4">{{ $i18n.t('job.report.created.label') }}: {{ selectedItem.results.report.created }}</span>
          <span v-if="!!selectedItem.results.report.hasOwnProperty('reviews')" class="mr-4">{{ $i18n.t('job.report.created.label') }}: {{ selectedItem.results.report.reviews }}</span>
          <span v-if="!selectedItem.dryRun && !!selectedItem.results.report.hasOwnProperty('retired')">{{ $i18n.t('job.report.retired.label') }}: {{ selectedItem.results.report.retired }}</span>
        </div>
        <div v-else-if="!!selectedItem.results.matched">
          <span class="mr-4">{{ $i18n.t('job.report.matched.label') }}: {{ selectedItem.results.matched }}</span>
          <span class="mr-4">{{ $i18n.t('job.report.created.label') }}: {{ selectedItem.results.created }}</span>
          <span class="mr-4">{{ $i18n.t('job.report.unmatched.label') }}: {{ selectedItem.results.unmatched }}</span>
          <span class="mr-4">{{ $i18n.tc('default.error.label', 2) }}: {{ selectedItem.results.error }}</span>
        </div>
        <div v-else-if="!!selectedItem.results.validation">
          <span class="mr-4">{{ $i18n.t('job.report.invalid.label') }}: {{ selectedItem.results.validation.rows.error }}/{{ selectedItem.results.validation.rows.total }}</span>
          <span class="mr-4">{{ $i18n.tc('kbart.processing.warning.label', 2) }}: {{ selectedItem.results.validation.rows.warning }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="selectedItem.messages">
      <v-col>
        <div
          class="primary--text"
        >
          {{ $i18n.t('job.messages') }}
        </div>
        <ul class="mt-2">
          <li
            v-for="(m, idx) in selectedItem.messages"
            :key="idx"
          >
            {{ (typeof m === "string" ? m : m.message) }}
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row v-if="rowErrors.length > 0">
      <v-col md="12">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $tc('kbart.processing.error.label', 2) }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :items="rowErrors"
                :headers="errorHeaders"
                sort-by="row"
                group-by="row"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row v-if="rowWarnings.length > 0">
      <v-col md="12">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $tc('kbart.processing.warning.label', 2) }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :items="rowWarnings"
                :headers="errorHeaders"
                sort-by="row"
                group-by="row"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row v-if="selectedItem.results">
      <v-col md="12">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{ $t('component.review.additionalInfo.label') }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <vue-json-pretty :data="selectedItem.results" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <template #buttons>
      <v-spacer />
      <gokb-button
        default
      >
        {{ $t('btn.close') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import jobServices from '@/shared/services/job-services'
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'GokbEditJobPopup',
    components: { VueJsonPretty },
    extends: BaseComponent,
    props: {
      selected: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        config: [],
        id: undefined,
        selectedItem: {
          description: undefined,
          componentId: undefined,
          componentType: undefined,
          type: undefined,
          status: undefined,
          startDate: undefined,
          endDate: undefined,
          results: undefined,
          dryRun: false,
          messages: []
        },
        items: [],
        rowErrors: [],
        rowWarnings: []
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value || true
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
      localType () {
        return this.selectedItem.type ? this.$i18n.t('job.jobTypes.' + this.selectedItem.type.name) : null
      },
      errorHeaders () {
        return [
          { text: this.$i18n.tc('kbart.row.label'), align: 'start', width: '10%', value: 'row', groupable: false },
          { text: this.$i18n.tc('kbart.column.label'), align: 'start', width: '15%', value: 'column' },
          { text: this.$i18n.tc('kbart.errors.reason.label'), align: 'start', value: 'reason' },
        ]
      }
    },
    async created () {
      if (this.selected) {
        const componentRoutes = {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
        }

        this.id = this.selected.id

        const result = await this.catchError({
          promise: jobServices.get(this.id, this.selected.archived, this.cancelToken.token),
          instance: this
        })

        const record = result?.data

        this.selectedItem.componentId = record.linkedItem?.id
        this.selectedItem.componentType = record.linkedItem && this.$i18n.tc('component.' + record.linkedItem.type.toLowerCase() + '.label')
        this.selectedItem.link = record.linkedItem ? { value: record.linkedItem.name, route: componentRoutes[record.linkedItem.type.toLowerCase()], id: 'componentId' } : {}
        this.selectedItem.type = record.type
        this.selectedItem.description = record.description
        this.selectedItem.status = record.status
        this.selectedItem.startTime = new Date(record.startTime).toLocaleString('sv')
        this.selectedItem.endTime = new Date(record.endTime).toLocaleString('sv')

        if (record.finished) {
          this.selectedItem.results = record.job_result

          if (record.job_result.dryRun) {
            this.selectedItem.dryRun = true
          }
        }

        if (!!record.messages) {
          this.selectedItem.messages = record.messages
        } else if (!!record.job_result) {
          if (!!record.job_result.message) {
            this.selectedItem.messages = [record.job_result.message]
          } else if (!!record.job_result.messages) {
            this.selectedItem.messages = record.job_result.messages
          }
        }

        if (!!record.job_result?.badrows) {
          record.job_result.badrows.forEach(badrow => {
            Object.entries(badrow.errors).forEach(([colname, v]) => {
              this.rowErrors.push({ row: badrow.row, column: colname, reason: this.$i18n.t(v.messageCode, v.args) })
            })
          })
        } else if (!!record.job_result?.validation) {
          Object.entries(record.job_result.validation.errors.rows).forEach(([rownum, colobj]) =>
            Object.entries(colobj).forEach(([colname, eo]) =>
              this.rowErrors.push({ row: rownum, column: colname, reason: this.$i18n.t(eo.messageCode, eo.args)})
            )
          )

          Object.entries(record.job_result.validation.warnings.rows).forEach(([rownum, colobj]) =>
            Object.entries(colobj).forEach(([colname, wo]) =>
              this.rowWarnings.push({ row: rownum, column: colname, reason: this.$i18n.t(wo.messageCode, wo.args)})
            )
          )
        }
      }
    },
    methods: {
      close () {
        this.localValue = false
      }
    }
  }
</script>

<style>
  .vjs-tree__node.is-highlight, .vjs-tree__node:hover { background-color:#9b9b9b }
  .vjs-value__string { color: #3c804b }
</style>
