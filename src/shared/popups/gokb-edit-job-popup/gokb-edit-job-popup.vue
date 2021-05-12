<template>
  <gokb-dialog
    v-model="localValue"
    title="Job-Details"
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
    <v-row v-if="selectedItem.componentId">
      <v-col>
        <div
          v-if="selectedItem.link"
          class="primary--text"
        >
          {{ $i18n.tc('component.package.label') }}
        </div>
        <router-link
          v-if="selectedItem.link"
          :style="{ color: '#f2994a' }"
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
            {{ m.message }}
          </li>
        </ul>
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

  export default {
    name: 'GokbEditJobPopup',
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
          messages: []
        },
        items: []
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
      }
    },
    async created () {
      if (this.selected.archived) {
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
          promise: jobServices.getJob(this.id, this.cancelToken.token),
          instance: this
        })

        const record = result?.data

        this.selectedItem.componentId = record.linkedItem?.id
        this.selectedItem.componentType = this.$i18n.tc('component.' + record.linkedItem.type.toLowerCase() + '.label')
        this.selectedItem.link = record.linkedItem ? { value: record.linkedItem?.name, route: componentRoutes[record.linkedItem.type.toLowerCase()], id: 'componentId' } : {}
        this.selectedItem.type = record.type
        this.selectedItem.description = record.description
        this.selectedItem.status = record.status
        this.selectedItem.startTime = new Date(record.startTime).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' })
        this.selectedItem.endTime = new Date(record.endTime).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' })
        this.selectedItem.results = record.job_result
        this.selectedItem.messages = [{ message: record.job_result.message }]
      } else {
        this.selectedItem = this.selected
      }
    },
    methods: {
      close () {
        this.localValue = false
      }
    }
  }
</script>
