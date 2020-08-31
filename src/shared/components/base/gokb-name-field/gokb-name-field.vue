<template>
  <v-banner>
    <span class="title">
      {{ value.name }}
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
        v-if="editable"
        @click="showEditName"
      >
        Bearbeiten
      </v-btn>
    </template>
  </v-banner>
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
      editable: {
        type: Boolean,
        required: false,
        default: true
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
        this.$refs.textField.validate(true)
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substr(2, 5)
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      showEditName () {
        this.editNamePopupVisible = true
      },
      close () {
        this.editNamePopupVisible = false
      },
      selectNewName (name) {
        if (this.value.name !== name) {
          if (!this.value.alts.find(({ variantName }) => variantName === name)) {
            this.value.alts.push({ id: this.tempId(), variantName: name, isDeletable: true })
          }

          this.value.name = name
          this.editNamePopupVisible = false
        } else {
          this.$refs.textField.error = true
        }
      },
    }
  }
</script>

<style scoped>
</style>
