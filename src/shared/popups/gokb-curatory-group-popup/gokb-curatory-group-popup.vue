<template>
  <gokb-dialog
    v-model="localValue"
    :title="$tc('component.curatoryGroup.label')"
  >
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="selectedItem.name"
          :label="$t('component.general.name')"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="selectedItem.organisationType"
          :label="$t('component.curatoryGroup.organisationType.label')"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-email-field
          v-model="selectedItem.email"
          :label="$t('component.user.email')"
          disabled
        />
      </v-col>
    </v-row>

    <template #buttons>
      <gokb-button @click="close">
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
    emits: ['update:model-value'],
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
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
          return this.modelValue || false
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      }
    },
    watch: {
      selected (val) {
        this.selectedItem = {
          name: undefined,
          email: undefined,
          users: undefined,
          organisationType: undefined
        }

        if (!!val) {
          this.fetchGroup()
        }
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
