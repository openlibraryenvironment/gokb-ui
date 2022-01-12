<template>
  <gokb-dialog
    value=""
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
                v-model="platformId"
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
        <gokb-text-field
          v-model="platform.name"
          :label="$tc('component.platform.label')"
          required
          dense
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <gokb-url-field
          ref="platformUrl"
          v-model="platform.primaryUrl"
          :label="$tc('component.platform.url')"
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
      <gokb-button default>
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
        required: true
      }
    },
    data () {
      return {
        successMsg: undefined,
        errorMsg: undefined,
        updateUrl: undefined,
        platform: {
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
        return !!this.selected
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
        this.platform.primaryUrlrl = primaryUrl
        this.updateUrl = _links?.update?.href || undefined
      },
      async save () {
        const activeGroup = accountModel.activeGroup()

        const newPlatform = {
          id: this.platformId,
          name: this.platform.name,
          primaryUrl: this.platform.primaryUrl,
          version: this.version,
          activeGroup
        }

        const response = await this.catchError({
          promise: platformServices.createOrUpdatePlatform(newPlatform, this.cancelToken.token),
          instance: this
        })

        if (response?.status < 300) {
          this.$emit('edit', response.data)
          this.close()
        } else {
          if (response?.status === 409) {
            this.errorMsg = 'error.update.409'
          } else if (response?.status === 500) {
            this.errorMsg = 'error.general.500'
          } else {
            this.errors = response?.data.error
          }
        }
      }
    }
  }
</script>
