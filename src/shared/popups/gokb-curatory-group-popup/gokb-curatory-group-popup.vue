<template>
  <gokb-dialog
    v-model="localValue"
    :title="$tc('component.curatoryGroup.label')"
    @submit="close"
  >
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="selectedItem.name"
          disabled
          :label="$i18n.t('component.general.name')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="selectedItem.organisationType"
          disabled
          :label="$i18n.t('component.curatoryGroup.organisationType.label')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-email-field
          v-model="selectedItem.email"
          disabled
          :label="$i18n.t('component.user.email')"
        />
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
  import curatoryGroupServices from '@/shared/services/curatory-group-services'

  export default {
    name: 'GokbCuratoryGroupPopup',
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
        id: undefined,
        selectedItem: {
          name: undefined,
          email: undefined,
          users: undefined,
          organisationType: undefined
        }
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
      }
    },
    async created () {
      if (this.selected?.id) {
        this.fetchGroup()
      } else {
        this.selectedItem = this.selected
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async fetchGroup () {
        this.id = this.selected.id

        const result = await this.catchError({
          promise: curatoryGroupServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        const record = result?.data?.data

        this.selectedItem.name = record.name
        this.selectedItem.email = record.email
        if (record.organizationType?.name) {
          this.selectedItem.organisationType = this.$i18n.t('component.curatoryGroup.organisationType.' + record.organizationType?.name + '.label')
        }
        if (record._embedded?.users) {
          this.selectedItem.users = record._embedded?.users
        }
      },
      updateGroup () {

      }
    }
  }
</script>
