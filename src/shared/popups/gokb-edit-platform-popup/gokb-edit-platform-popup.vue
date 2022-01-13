<template>
  <gokb-dialog
    value=""
    :title="localTitle"
    @submit="save"
  >
    <gokb-error-component :value="error" />
    <span v-if="errorMsg">
      <v-alert
        type="error"
        dismissible
      >
        {{ localErrorMessage }}
      </v-alert>
    </span>
    <v-row
      dense
      class="mt-4"
    >
      <v-col>
        <gokb-text-field
          ref="name"
          v-model="platform.name"
          :label="$tc('component.general.name')"
          :api-errors="errors.name"
          required
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-url-field
          ref="platformUrl"
          v-model="platform.primaryUrl"
          :label="$tc('component.platform.url')"
          :api-errors="errors.primaryUrl"
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
        default
        :disabled="!isValid"
      >
        {{ submitButtonLabel }}
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
      pprops: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        errorMsg: undefined,
        errors: {},
        updateUrl: undefined,
        platform: {
          id: undefined,
          name: undefined,
          primaryUrl: undefined
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
      },
      platformId () {
        return this.selected?.id ? this.selected.id : undefined
      },
      isReadonly () {
        return !accountModel.loggedIn() || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isEdit () {
        return !!this.platformId
      },
      isValid () {
        return !!this.platform.name && !!this.platform.primaryUrl
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.platform.label')]) : undefined
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.platform.label')]) : undefined
      },
      submitButtonLabel () {
        return this.isEdit ? this.$i18n.tc('route.platform.edit') : this.$i18n.tc('route.platform.create')
      },
      localTitle () {
        if (this.isEdit) {
          return this.$i18n.tc('component.platform.label') + (this.platform?.stdDesc ? (' – ' + this.$i18n.t('component.platform.stdDesc.' + (this.platform.stdDesc.value || this.platform.stdDesc.name) + '.label')) : '')
        } else {
          return this.$i18n.tc('route.platform.create')
        }
      }
    },
    created () {
      if (this.selected) {
        // edit existing platform
        this.platform.name = this.selected.name
        this.platform.primaryUrl = this.selected.primaryUrl
        this.platform.id = this.selected.id
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
        this.platform.name = name
        this.platform.primaryUrl = primaryUrl
        this.updateUrl = _links?.update?.href || undefined
      },
      async save () {
        this.errors = {}
        if (this.$refs.name.validate() && this.$refs.primaryUrl.validate()) {
          const activeGroup = accountModel.activeGroup()

          const newPlatform = {
            id: this.platform.id,
            name: this.platform.name,
            primaryUrl: this.platform.primaryUrl,
            version: this.version,
            activeGroup
          }

          if (!this.isEdit) {
            newPlatform.provider = this.pprops?.providerId
          }

          const response = await this.catchError({
            promise: platformServices.createOrUpdatePlatform(newPlatform, this.cancelToken.token),
            instance: this
          })

          if (response?.status < 300) {
            const updatedObj = {
              id: response.data.id,
              name: response.data.name,
              primaryUrl: response.data.primaryUrl,
              provider: response.data.provider,
              status: response.data.status,
              version: response.data.version,
              isDeletable: true
            }

            this.$emit('edit', updatedObj)
            this.close()
          } else {
            if (response?.status === 409) {
              this.errorMsg = 'error.update.409'
              this.errors = response?.data?.error
            } else if (response?.status === 500) {
              this.errorMsg = 'error.general.500'
            } else {
              this.errorMsg = this.isEdit ? 'error.update.400' : 'error.create.400'
              this.errors = response?.data?.error
            }
          }
        }
      }
    }
  }
</script>
