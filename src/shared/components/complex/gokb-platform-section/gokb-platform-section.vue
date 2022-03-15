<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.platform.label', 2)"
    :items-total="totalNumberOfItems"
    :errors="!!apiErrors"
  >
    <gokb-edit-platform-popup
      v-if="editPlatformPopupVisible"
      v-model="editPlatformPopupVisible"
      :provider-id="providerId"
      @edit="editPlatform"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click="showAddPlatformPopup"
      >
        {{ $t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="mdi-delete"
        color="primary"
        :disabled="isDeleteSelectedDisabled"
        @click="confirmDeleteSelectedItems"
      >
        {{ $t('btn.delete') }}
      </gokb-button>
    </template>

    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="tableHeaders"
      :items="platforms"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
      @edit="editPlatform"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbEditPlatformPopup from '@/shared/popups/gokb-edit-platform-popup'

  const ROWS_PER_PAGE = 10

  const TABLE_HEADERS = [
    { text: 'Name', align: 'start', value: 'popup', sortable: false, width: '40%' },
    { text: 'URL', align: 'start', value: 'primaryUrl', sortable: false, width: '60%' }
  ]

  export default {
    name: 'GokbPlatformSection',
    components: {
      GokbConfirmationPopup,
      GokbEditPlatformPopup
    },
    props: {
      value: {
        type: Array,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      },
      providerId: {
        type: [String, Number],
        required: true
      },
    },
    data () {
      return {
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        confirmationPopUpVisible: false,
        editPlatformPopupVisible: false,
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
          this.$emit('input', localValue)
        }
      },
      platforms () {
        return [...this.localValue]
          .map(item => ({
            ...item,
            popup: { value: item.name, label: 'platform', type: 'GokbEditPlatformPopup', otherProps: { providerId: this.providerId } }
          }))
          .sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .slice((this.options.page - 1) * ROWS_PER_PAGE, this.options.page * ROWS_PER_PAGE)
      },
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
      isEditable () {
        return !this.disabled
      }
    },
    created () {
      this.tableHeaders = TABLE_HEADERS
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.platform.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, name }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', name] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedItems () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
        this.$emit('update', 'platforms')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
        this.$emit('update', 'platforms')
      },
      showAddPlatformPopup () {
        this.editPlatformPopupVisible = true
      },
      editPlatform (value) {
        const platformMatch = this.localValue.filter(({ id }) => id === value.id)
        var existingPlatform

        if (platformMatch.length === 1) {
          existingPlatform = platformMatch[0]
        }

        if (existingPlatform) {
          const index = this.localValue.indexOf(existingPlatform)
          // edit existing platform
          existingPlatform.name = value.name
          existingPlatform.primaryUrl = value.primaryUrl
          this.successMsg = 'success.update'
          this.localValue[index] = existingPlatform
        } else {
          // add new platform
          this.successMsg = 'success.create'
          this.localValue.push({ name: value.name, primaryUrl: value.primaryUrl, id: value.id, isDeletable: true })
        }
        this.$emit('setsuccessmsg', this.successMsg)
      }
    }
  }
</script>
