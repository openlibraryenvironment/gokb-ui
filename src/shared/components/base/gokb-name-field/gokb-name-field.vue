<template>
  <div>
    <span class="text-caption v-label">
      {{ label }}
      <span
        v-if="!disabled && markRequired"
        style="color:red"
      >
        *
      </span>
    </span>
    <v-banner class="bg-card">
      <div class="font-weight-bold" style="font-size: 1.1rem;">
        {{ currentName || modelValue.name }}
      </div>
      <template v-slot:actions>
        <gokb-dialog
          v-if="editNamePopupVisible"
          v-model="editNamePopupVisible"
          :title="editNamePopupLabel"
          :width="dialogWidth"
          @submit="selectNewName"
        >
          <gokb-text-field
            ref="nameTextField"
            v-model="editedVal"
            :rules="rules"
          />
          <v-checkbox
            v-if="currentName"
            v-model="keepCurrent"
            class="ml-2 mt-4"
            :label="keepCurrentLabel"
          />
          <v-spacer />
          <gokb-button
            text
            @click="close"
          >
            {{ $i18n.t('btn.cancel') }}
          </gokb-button>
          <gokb-button
            class="ml-4"
            :disabled="!editedVal || editedVal === currentName || editedVal === inValidName"
            is-submit
          >
            {{ $i18n.t('btn.confirm') }}
          </gokb-button>
        </gokb-dialog>
        <gokb-confirmation-popup
          v-model="confirmationPopUpVisible"
          :message="messageToConfirm"
          @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
        />
        <gokb-button
          v-if="!disabled"
          color="primary"
          @click="showEditName"
        >
          {{ $i18n.t('header.edit.label', [$i18n.t('component.general.name')]) }}
        </gokb-button>
      </template>
    </v-banner>
  </div>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import genericServices from '@/shared/services/generic-entity-services'

  import { createCancelToken } from '@/shared/services/http'

  export default {
    name: 'GokbNameField',
    components: { GokbConfirmationPopup },
    emits: ['name'],
    props: {
      modelValue: {
        required: true,
        default: undefined,
        type: [Object, String]
      },
      disabled: {
        type: Boolean,
        required: false,
        default: true
      },
      label: {
        type: String,
        required: false,
        default: 'Name'
      },
      dialogWidth: {
        type: Number,
        required: false,
        default: 800
      },
      markRequired: {
        type: Boolean,
        required: false,
        default: true
      },
      checkDupes: {
        type: String,
        required: false,
        default: undefined
      },
      itemId: {
        type: Number,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        editNamePopupVisible: false,
        confirmationPopUpVisible: false,
        editedVal: undefined,
        keepCurrent: false,
        currentName: undefined,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        cancelToken: undefined,
        inValidName: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('name', localValue)
        }
      },
      keepCurrentLabel () {
        return this.$i18n.t('popups.name.keepCurrent')
      },
      editNamePopupLabel () {
        return this.$i18n.t('header.edit.label', [this.$i18n.t('component.general.name')])
      },
      rules () {
        return [
          value => value?.length > 0 || this.$i18n.t('validation.missingName'),
          value => !/.*([(\-]|\(\))$/.test(value) || this.$i18n.t('error.general.name.malformedEnding'),
          value => !this.inValidName || value.trim().toLowerCase() !== this.inValidName || this.$i18n.t('error.general.name.notUnique')
        ]
      },
      valid () {
        return !!this.editedVal
      }
    },
    watch: {
      'localValue.name' (val) {
        this.currentName = val
      }
    },
    methods: {
      validate ({ def }) {
        if (this.$refs.nameTextField) {
          this.$refs.nameTextField.validate({ def })
        }
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substr(2, 5)
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      showEditName () {
        this.editNamePopupVisible = true
        this.currentName = this.localValue.name
        this.editedVal = this.localValue.name
      },
      close () {
        this.localValue.name = this.currentName
        this.editNamePopupVisible = false
      },
      async selectNewName () {
        this.editedVal = this.editedVal.trim()

        if (this.checkDupes) {
          this.inValidName = undefined
          var dupes = await this.checkForDupes(this.checkDupes)

          if (dupes === true) {
            this.inValidName = this.editedVal.toLowerCase()
            this.validate(false)
          } else {
            this.setNewName()
          }
        } else {
          this.setNewName()
        }
      },
      setNewName () {
        if (!!this.currentName && this.keepCurrent && !this.localValue.alts.find(({ variantName }) => variantName === this.currentName)) {
          this.localValue.alts.push({ id: this.tempId(), variantName: this.currentName, isDeletable: true })
        }
        this.currentName = this.editedVal
        this.localValue.name = this.editedVal
        this.editNamePopupVisible = false
      },
      async checkForDupes (type) {
        this.cancelToken = createCancelToken()
        var response = await genericServices('rest/entities').checkNewName(
          encodeURIComponent(this.editedVal),
          type,
          this.cancelToken.token
        )

        if (response?.status < 400) {
          if (response.data.result === 'ERROR') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
  }
</script>

<style scoped>
</style>
