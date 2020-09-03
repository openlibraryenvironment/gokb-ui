<template>
  <div>
    <span>Name</span>
    <v-banner>
      <span style="font-size:1.1rem">
        {{ oldVal || value.name }}
      </span>
      <template v-slot:actions>
        <gokb-dialog
          v-if="editNamePopupVisible"
          v-model="editNamePopupVisible"
          :title="`Namen anpassen`"
          :width="dialogWidth"
          @submit="selectNewName"
        >
          <component
            :is="'GokbTextField'"
            ref="nameTextField"
            v-model="value.name"
          />
          <template #buttons>
            <v-spacer />
            <gokb-button
              text
              @click="close"
            >
              Abbrechen
            </gokb-button>
            <gokb-button
              :disabled="!value.name"
              default
            >
              Bestätigen
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
          Bearbeiten
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
        default: '',
        validator: function (value) {
          return value.name === undefined || value.name === null || typeof value.name === 'string'
        }
      },
      disabled: {
        type: Boolean,
        required: false,
        default: true
      },
      oldVal: {
        type: String,
        required: false,
        default: undefined
      },
      dialogWidth: {
        type: Number,
        required: false,
        default: 800
      }
    },
    data () {
      return {
        editNamePopupVisible: false,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value.name
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      }
    },
    methods: {
      validate () {
        this.$refs.nameTextField.validate(true)
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substr(2, 5)
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      showEditName () {
        this.editNamePopupVisible = true
        this.oldVal = this.value.name
      },
      close () {
        this.editNamePopupVisible = false
      },
      selectNewName (name) {
        if (this.value.name !== this.oldVal) {
          if (!this.value.alts.find(({ variantName }) => variantName === this.value.name)) {
            this.value.alts.push({ id: this.tempId(), variantName: this.oldVal, isDeletable: true })
          }

          this.editNamePopupVisible = false
          this.oldVal = undefined
        } else {
          this.$refs.nameTextField.error = true
        }
      },
    }
  }
</script>

<style scoped>
</style>
