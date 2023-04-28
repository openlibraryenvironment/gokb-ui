<template>
  <gokb-dialog
    value=""
    :title="localTitle"
    v-on="isEdit ? { submit: save } : { submit: check }"
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
        <gokb-search-platform-field
          v-if="!selected"
          v-model="platformName"
          :items="items"
          :readonly="isReadonly"
          :label="$tc('component.general.name')"
          :query-fields="[]"
          required
          return-object
          allow-new-values
          disable-if-linked
        />
        <gokb-text-field
          v-else
          v-model="platform.name"
          :readonly="isReadonly"
          :label="$tc('component.general.name')"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-search-platform-field
          v-if="!selected"
          v-model="platformUrl"
          :items="items"
          :readonly="isReadonly"
          :label="$tc('component.platform.url')"
          :rules="urlRules"
          :query-fields="['primaryUrl']"
          item-text="primaryUrl"
          required
          return-object
          allow-new-values
          disable-if-linked
        />
        <gokb-url-field
          v-else
          v-model="platformUrl"
          :readonly="isReadonly"
          :required="!isReadonly"
        />
      </v-col>
    </v-row>
    <v-row
      v-for="c in conflictLinks"
      :key="c.id"
      dense
    >
      <v-col v-if="!c.id">
        {{ $t('component.platform.conflict.noProvider', [c.platformId]) }}
      </v-col>
      <v-col v-else>
        {{ $t('component.platform.conflict.' + c.type, [c.platformName]) }}
        {{ $t('component.platform.conflict.providerLink') }}
        <router-link
          :style="{ color: 'primary' }"
          :to="{ name: '/provider', params: { 'id': c.id } }"
        >
          {{ c.name }}
        </router-link>
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
  import GokbSearchPlatformField from '@/shared/components/simple/gokb-search-platform-field'
  import 'vue-json-pretty/lib/styles.css'

  export default {
    name: 'GokbEditPlatformPopup',
    components: {
      GokbSearchPlatformField
    },
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
      },
      providerId: {
        type: Number,
        required: false,
        default: undefined
      },
      editable: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        errorMsg: undefined,
        errors: {},
        conflictLinks: [],
        platformUrl: undefined,
        platformName: undefined,
        items: [],
        updateUrl: undefined,
        platform: {
          id: undefined,
          name: undefined,
          primaryUrl: undefined
        },
        urlRules:
          [v => (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/.test(v)) || this.$i18n.t('component.tipp.url.error')],
        queryFields: ['primaryUrl'],
        disableIfLinked: true
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
        return !this.pprops.editable
      },
      isEdit () {
        return !!this.selected
      },
      isValid () {
        return !!this.platform?.name && !!this.platform?.primaryUrl
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.platform.label')]) : undefined
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.platform.label')]) : undefined
      },
      submitButtonLabel () {
        return this.isEdit ? this.$i18n.tc('route.platform.edit') : this.$i18n.tc('route.platform.add')
      },
      localTitle () {
        if (this.isEdit) {
          return this.$i18n.tc('component.platform.label') + (this.platform?.stdDesc ? (' – ' + this.$i18n.t('component.platform.stdDesc.' + (this.platform.stdDesc.value || this.platform.stdDesc.name) + '.label')) : '')
        } else {
          return this.$i18n.tc('route.platform.add')
        }
      }
    },
    created () {
      if (this.selected) {
        // edit existing platform
        this.platformName = this.selected

        this.updateUrl = this.selected.updateUrl
        this.items = [this.platform]
      }
    },
    watch: {
      'platformName'(val) {
        if (!!val) {
          if (typeof val === 'object') {
            this.platform = val
            this.platformUrl = val.primaryUrl
          } else if (val !== this.platform.name) {
            this.platform = {
              name: val,
              primaryUrl: undefined,
              id: undefined
            }
            this.platformUrl = undefined
          }
        }
        else {
          this.platform = {
            name: undefined,
            primaryUrl: undefined,
            id: undefined
          }
        }
      },
      'platformUrl'(val) {
        if (!this.selected && !!val && typeof val === 'object') {
          this.platformName = val
        }
        else if (this.platform?.primaryUrl !== val) {
          this.platform.primaryUrl = val
        }
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      async fetch (pid) {
        const response = await this.catchError({
          promise: platformServices.getPlatform(pid, this.cancelToken.token),
          instance: this
        })

        if (response.status === 200) {
          return response.data
        } else {
          return undefined
          // Something went wrong
        }
      },
      async save () {
        this.errors = {}
        this.conflictLinks = []

        const activeGroup = accountModel.activeGroup()

        const newPlatform = {
          id: this.platform.id,
          name: this.platform.name,
          primaryUrl: this.platform.primaryUrl,
          version: this.version,
          activeGroup
        }

        if (!this.isEdit) {
          newPlatform.provider = this.providerId
        }

        const response = await this.catchError({
          promise: platformServices.createOrUpdate(newPlatform, this.cancelToken.token),
          instance: this
        })

        if (response?.status < 300) {
          if (response.data?.error) {
            this.handleApiErrors(response.data.error)
          } else {
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
          }
        } else {
          if (response?.status === 409) {
            this.errorMsg = 'error.update.409'
            this.errors = response?.data?.error
          } else if (response?.status === 500) {
            this.errorMsg = 'error.general.500'
          } else if (response.data?.error) {
            this.handleApiErrors(response.data.error)
          }
        }
      },
      async check () {
        this.errors = {}
        this.conflictLinks = []
        const activeGroup = accountModel.activeGroup()
        const newPlatform = {
          id: this.platform.id,
          name: this.platform.name,
          primaryUrl: this.platform.primaryUrl,
          version: this.version,
          activeGroup
        }

        const response = await this.catchError({
          promise: platformServices.check(newPlatform, this.cancelToken.token),
          instance: this
        })
        if (response?.status < 300 && response.data) {
          if (response.data.error) {
            this.handleApiErrors(response.data.error)
          } else if (!response.data.to_create) {
            this.handleApiErrors(response.data.conflicts)
          } else {
            this.$emit('edit', newPlatform)
            this.close()
          }
        } else {
          if (response?.status === 409) {
            this.errorMsg = 'error.update.409'
            this.errors = response?.data?.error
          } else if (response?.status === 500) {
            this.errorMsg = 'error.general.500'
          } else if (response.data?.error) {
            this.handleApiErrors(response.data.error)
          }
        }
      },
      async handleApiErrors (errors) {
        var conflictProviders = {}
        this.errorMsg = this.isEdit ? 'error.update.400' : 'error.create.400'

        if (errors.name) {
          for (const en of errors.name) {
            if (en.matches) {
              const fetchedPlt = await this.fetch(en.matches)

              if (fetchedPlt.provider) {
                conflictProviders[fetchedPlt.provider.id] = { id: fetchedPlt.provider.id, name: fetchedPlt.provider.name, platformName: fetchedPlt.name, type: 'name' }
              } else {
                conflictProviders.unknown = { platformName: fetchedPlt.name, platformId: fetchedPlt.id }
              }
            }
          }
        }
        if (errors.primaryUrl) {
          for (const eu of errors.primaryUrl) {
            if (eu.matches) {
              const fetchedPlt = await this.fetch(eu.matches)

              if (fetchedPlt.provider) {
                if (conflictProviders[fetchedPlt.provider.id]) {
                  conflictProviders[fetchedPlt.provider.id].type = 'general'
                } else {
                  conflictProviders[fetchedPlt.provider.id] = { id: fetchedPlt.provider.id, name: fetchedPlt.provider.name, platformName: fetchedPlt.name, type: 'url' }
                }
              } else {
                if (conflictProviders.unknown) {
                  conflictProviders.unknown.type = 'general'
                } else {
                  conflictProviders.unknown = { platformName: fetchedPlt.name, platformId: fetchedPlt.id }
                }
              }
            }
          }
        }
        for (const cp in conflictProviders) {
          this.conflictLinks.push(conflictProviders[cp])
        }
        this.errors = errors
      }
    }
  }
</script>
