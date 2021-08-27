<template>
  <div>
    <span>{{ label }} <span v-if="!disabled && markRequired">(<span style="color:red">*</span>)</span></span>
    <v-banner>
      <span
        style="font-size:1.1rem"
        class="font-weight-bold"
      >
        {{ currentName || value.name }}
      </span>
      <template v-slot:actions>
        <gokb-dialog
          v-if="editNamePopupVisible"
          v-model="editNamePopupVisible"
          :title="editNamePopupLabel"
          :width="dialogWidth"
          @submit="selectNewName"
        >
          <gokb-text-field
            v-model="editedVal"
            :rules="rules"
          />
          <template #buttons>
            <v-spacer />
            <v-checkbox
              v-if="currentName"
              v-model="keepCurrent"
              class="mr-2"
              :label="keepCurrentLabel"
            />
            <gokb-button
              text
              @click="close"
            >
              {{ $i18n.t('btn.cancel') }}
            </gokb-button>

            <gokb-button
              :disabled="!valid"
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
          value => value?.length > 0 || this.$i18n.t('validation.missingName')
        ]
      },
      valid () {
        return !!this.editedVal
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
      selectNewName () {
        if (this.currentName !== this.editedVal) {
          if (this.currentName && this.keepCurrent && !this.localValue.alts.find(({ variantName }) => variantName === this.editedVal)) {
            this.localValue.alts.push({ id: this.tempId(), variantName: this.currentName, isDeletable: true })
          }
          this.currentName = this.editedVal
          this.localValue.name = this.editedVal
          this.editNamePopupVisible = false
        } else {
          this.validate(false)
        }
      },
    }
  }
</script>

<style scoped>
</style>
