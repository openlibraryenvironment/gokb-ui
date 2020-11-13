<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.title.publisher.label', 2)"
    :items-total="totalNumberOfItems"
  >
    <gokb-add-item-popup
      v-if="addPublisherPopupVisible"
      v-model="addPublisherPopupVisible"
      :component="{ type: 'GokbSearchProviderField', name: $tc('component.title.publisher.label'), properties: {returnObject: true} }"
      @add="addNewPublisher"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="add"
        @click="showAddPublisherPopup"
      >
        {{ $i18n.t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="delete"
        :disabled="isDeleteSelectedDisabled"
        @click="confirmDeleteSelectedItems"
      >
        {{ $i18n.t('btn.delete') }}
      </gokb-button>
    </template>

    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="tableHeaders"
      :items="publishers"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
    />
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import { EDIT_PROVIDER_ROUTE } from '@/router/route-paths'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbPublisherSection',
    components: {
      GokbAddItemPopup,
      GokbConfirmationPopup
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
      }
    },
    data () {
      return {
        addPublisherPopupVisible: false,
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined },
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
      publishers () {
        return [...this.value]
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
      },
      tableHeaders () {
        return [
          { text: this.$i18n.tc('component.general.name'), align: 'left', value: 'link', sortable: false, width: '100%' }
        ]
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.title.publisher.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, name }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.$i18n.tc('component.title.publisher.label'), name] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedItems () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
      },
      showAddPublisherPopup () {
        this.addPublisherPopupVisible = true
      },
      addNewPublisher (item) {
        this.localValue.push({ id: item.id, name: item.name, link: { id: 'id', route: EDIT_PROVIDER_ROUTE, value: item.name }, isDeletable: true })
      },
      deleteItem (value) {
        this.localValue = this.localValue.filter(v => v !== value)
      }
    }
  }
</script>
