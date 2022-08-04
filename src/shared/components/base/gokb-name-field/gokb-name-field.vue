<template>
  <div>
    <span>
      {{ label }}
      <span
        v-if="!disabled && markRequired"
        style="color:red"
      >
        *
      </span>
    </span>
    <v-banner>
      <div
        style="font-size:1.1rem"
        class="font-weight-bold"
      >
        {{ currentName || value.name }}
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
          <template #buttons>
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
              :disabled="!editedVal || editedVal === currentName || editedVal === inValidName"
              default
            >
              {{ $i18n.t('btn.confirm') }}
            </gokb-button>
          </template>
        </gokb-dialog>
        <gokb-confirmation-popup
          v-model="confirmationPopUpVisible"
          :message="messageToConfirm"
          @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
        />
        <v-btn
          v-if="!disabled"
          @click="showEditName"
        >
          {{ $i18n.t('btn.edit') }}
        </v-btn>
      </template>
    </v-banner>
  </div>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import searchServices from '@/shared/services/search-services'
  import { createCancelToken } from '@/shared/services/http'

  export default {
    name: 'GokbNameField',
    components: { GokbConfirmationPopup },
    props: {
      value: {
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
      keepCurrent: {
        type: Boolean,
        required: false,
        default: false
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
        currentName: undefined,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        cancelToken: undefined,
        inValidName: undefined,
        hasMalformedEnding: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
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
          value => !this.inValidName || value.trim().toLowerCase() !== this.inValidName || this.$i18n.t('error.general.name.notUnique'),
          value => !this.hasMalformedEnding || this.$i18n.t('error.general.name.malformedEnding')
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

        if (!this.hasValidSyntax()){
          return
        }
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
        if (this.currentName && this.keepCurrent && !this.localValue.alts.find(({ variantName }) => variantName === this.editedVal)) {
          this.localValue.alts.push({ id: this.tempId(), variantName: this.currentName, isDeletable: true })
        }
        this.currentName = this.editedVal
        this.localValue.name = this.editedVal
        this.editNamePopupVisible = false
      },
      hasValidSyntax () {
        var malformedStringEndings = ["-", "(", "()", "!", "?"]
        if (malformedStringEndings.some(mse => this.editedVal.endsWith(mse))) {
          this.hasMalformedEnding = true
          return false
        }
        return true
      },
      async checkForDupes (type) {
        this.cancelToken = createCancelToken()
        var response = await searchServices('rest/entities').search({
          name: this.editedVal,
          status: 'Current',
          componentType: type,
          es: 'true',
          max: 20
        }, this.cancelToken.token)

        if (response?.status < 400) {
          var dupes = response.data?.data.filter(res => (res.name.toLowerCase() === this.editedVal.toLowerCase() && (!this.itemId || (this.itemId !== res.id))))

          if (dupes?.length > 0) {
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
