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
          v-model="platformName"
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
          v-model="platformUrl"
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
          label: undefined,
          url: undefined,
          title: undefined
        }
      }
    },
    computed: {
      platformId () {
        return this.selected?.id ? this.selected.id : undefined
      },
      platformName: {
        get () {
          return this.selected?.name ? this.selected.name : undefined
        },
        set (localName) {
          this.selected.name = localName
        }
      },
      platformUrl: {
        get () {
          return this.selected?.primaryUrl ? this.selected.primaryUrl : undefined
        },
        set (localUrl) {
          this.selected.primaryUrl = localUrl
        }
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
    methods: {
      close () {
        this.localValue = false
        this.editPlatformPopupVisible = false
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
          id: this.platformId,
          platformName: this.platformName,
          platformUrl: this.platformUrl,
          status: this.platform.status?.id || null,
          version: this.version,
          activeGroup
        }

        const response = await this.catchError({
          promise: platformServices.createOrUpdatePlatform(newPlatform, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          this.$emit('edit', this.selected)
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
