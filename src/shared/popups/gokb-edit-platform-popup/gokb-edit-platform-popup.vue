<template>
  <gokb-dialog
    v-model="localValue"
    :title="localTitle"
    :width="1000"
    @submit="save"
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
    <v-row>
      <v-col md="12">
        <template>
          <v-row dense>
            <v-col cols="6">
              <gokb-text-field
                v-model="localAction"
                :label="submitButtonLabel"
                disabled
              />
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
    <v-row
      dense
      class="mt-4"
    >
      <v-col>
        <gokb-title-field
          v-model="platform.title"
          :label="$tc('component.platform.label')"
          required
          dense
          return-object
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <gokb-url-field
          ref="platformUrl"
          v-model="platform.url"
          :label="$tc('component.tipp.url.label')"
          required
          dense
        />
      </v-col>
    </v-row>

    <template #buttons>
      <v-spacer />
      <gokb-button
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly"
        :disabled="!isValid"
        default
      >
        {{ isEdit ? $t('btn.update') : $t('btn.create') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import platformServices from '@/shared/services/platform-services'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'GokbEditPlatformPopup',
    extends: BaseComponent,
    props: {
      selected: {
        type: Object,
        required: false,
        default: undefined
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      component: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        selectedItem: undefined,
        successMsg: undefined,
        errorMsg: undefined,
        updateUrl: undefined,
        platform: {
          label: undefined,
          url: undefined,
          title: undefined
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
      isReadonly () {
        return !accountModel.loggedIn() || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isEdit () {
        return !!this.id
      },
      isValid () {
        return !!this.platform.component
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.platform.label')]) : undefined
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.platform.label')]) : undefined
      },
      submitButtonLabel () {
        return this.isEdit ? this.$i18n.tc('component.platform.edit') : this.$i18n.tc('component.platform.create')
      }
    },
    async created () {
      this.selectedItem = this.selected

      if (this.component) {
        this.platform.component = this.component
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async fetch (pid) {
        const {
          data: {
            name,
            primaryUrl,
            _links
          }
        } = await this.catchError({
          promise: platformServices.getPlatform(pid, this.cancelToken.token),
          instance: this
        })
        this.platform.label = name
        this.platform.url = primaryUrl
        this.updateUrl = _links?.update?.href || undefined
      },
      async save () {
        const activeGroup = accountModel.activeGroup()

        const newPlatform = {
          id: this.id,
          status: this.platform.status?.id || null,
          version: this.version,
          activeGroup
        }

        const response = await this.catchError({
          promise: platformServices.createOrUpdatePlatform(newPlatform, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.$emit('edit', this.selectedItem)
          this.close()
        } else {
          if (response.status === 409) {
            this.errorMsg = 'error.update.409'
          } else if (response.status === 500) {
            this.errorMsg = 'error.general.500'
          } else {
            this.errors = response.data.error
          }
        }
      }
    }
  }
</script>
