<template>
  <gokb-dialog
    v-model="localValue"
    title="Job-Details"
    width="50%"
    @submit="close"
  >
    <v-row>
      <v-col md="12">
        <gokb-textarea-field
          v-model="selectedItem.popup.value"
          readonly
          :label="$i18n.t('job.description')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <gokb-text-field
          v-model="selectedItem.startTime"
          readonly
          :label="$i18n.t('job.startTime')"
        />
      </v-col>
      <v-col md="4">
        <gokb-text-field
          v-model="selectedItem.endTime"
          readonly
          :label="$i18n.t('job.endTime')"
        />
      </v-col>
    </v-row>
    <v-row>
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
        Schließen
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>

  export default {
    name: 'GokbEditJobPopup',
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
        selectedItem: {
          description: undefined,
          startDate: undefined,
          endDate: undefined,
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
    },
    async created () {
      this.selectedItem = this.selected
    },
    methods: {
      close () {
        this.localValue = false
      }
    }
  }
</script>
