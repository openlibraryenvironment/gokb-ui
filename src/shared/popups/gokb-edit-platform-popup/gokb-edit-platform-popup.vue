<template>
  <gokb-dialog
    v-model="localValue"
    :title="localTitle"
    :is-valid="isValid"
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
    <v-tabs
      v-if="!isEdit"
      v-model="tab"
    >
      <v-tab
        key="search"
        @click="resetFields()"
      >
        {{ $tc('btn.select') }}
      </v-tab>
      <v-tab
        v-if="!isEdit"
        key="new"
        :disabled="!searched"
        @click="resetFields()"
      >
        {{ $tc('btn.new') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        key="search"
      >
        <v-row
          v-if="isEdit"
          class="text-h6 mt-4 ml-0"
        >
          {{ $tc('route.platform.edit') }}
        </v-row>
        <v-row
          v-else
          class="text-h6 mt-4 ml-0"
        >
          {{ $tc('route.platform.searchExisting') }}
        </v-row>
        <v-row
          dense
          class="mt-4"
        >
          <v-col>
            <gokb-search-platform-field
              v-model="platformName"
              :items="items"
              :label="$tc('component.general.name')"
              :query-fields="['name', 'primaryUrl']"
              return-object
              disable-if-linked
              @searched="hasSearched()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <gokb-url-field
              ref="urlinput"
              v-if="!!platformUrl"
              v-model="platformUrl"
              :api-errors="errors.primaryUrl"
              readonly
              @valid="updateUrlValidationState"
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
      </v-tab-item>
      <v-tab-item
        key="new"
      >
        <v-row
          class="text-h6 mt-4 ml-0"
        >
          {{ $tc('route.platform.createNew') }}
        </v-row>
        <v-row
          dense
          class="mt-4"
        >
          <v-col>
            <gokb-text-field
              v-model="platform.name"
              :readonly="isReadonly"
              :label="$tc('component.general.name')"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <gokb-url-field
              ref="urlinput"
              v-model="platform.primaryUrl"
              :api-errors="errors.primaryUrl"
              :readonly="isReadonly"
              :required="!isReadonly"
              @valid="updateUrlValidationState"
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
      </v-tab-item>
    </v-tabs-items>
    <div v-if="isEdit">
      <v-row
        dense
        class="mt-4"
      >
        <v-col>
          <gokb-text-field
            v-model="platform.name"
            :readonly="isReadonly"
            :label="$tc('component.general.name')"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <gokb-url-field
            ref="urlinput"
            v-model="platformUrl"
            :readonly="isReadonly"
            :api-errors="errors.primaryUrl"
            required
            @valid="updateUrlValidationState"
          />
        </v-col>
      </v-row>
    </div>
    <v-spacer />
    <gokb-button
      @click="close"
    >
      {{ $t('btn.cancel') }}
    </gokb-button>
    <gokb-button
      v-if="!isReadonly"
      is-submit
      :disabled="!isValid"
    >
      {{ submitButtonLabel }}
    </gokb-button>
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
        tab: null,
        errorMsg: undefined,
        errors: {},
        conflictLinks: [],
        platformUrl: undefined,
        platformName: undefined,
        items: [],
        validUrl: false,
        updateUrl: undefined,
        platform: {
          id: undefined,
          name: undefined,
          primaryUrl: undefined
        },
        queryFields: ['primaryUrl'],
        disableIfLinked: true,
        searched: false
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
        return !!this.pprops ? !this.pprops.editable : false
      },
      isEdit () {
        return !!this.selected
      },
      isValid () {
        return !!this.platform?.name && !!this.platform?.primaryUrl && this.validUrl
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
          return this.isReadonly ? this.$i18n.tc('component.platform.label') : this.$i18n.t('header.edit.label', [this.$i18n.tc('component.platform.label')])
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
          promise: platformServices.get(pid, this.cancelToken.token),
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
      },
      hasSearched () {
        this.searched = true
      },
      updateUrlValidationState (valid) {
        this.validUrl = valid
      },
      resetFields () {
        if (this.searched) {
          this.platformUrl = undefined
          this.platformName = undefined
          this.items = []
          this.updateUrl = undefined
          this.platform = {
            id: undefined,
            name: undefined,
            primaryUrl: undefined
          }
        }
      }
    }
  }
</script>
