<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="title"
    :items-total="totalNumberOfItems"
    :errors="!!apiErrors"
  >
    <gokb-add-item-popup
      v-if="addItemPopupVisible"
      v-model="addItemPopupVisible"
      :component="{ type: 'GokbOfficeField', name: $tc('component.office.label') }"
      @add="addItem"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click="showAddItem"
      >
        {{ $i18n.t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="mdi-delete"
        color="primary"
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
      :items="offices"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      :hide-select="!isEditable"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import languageServices from '@/shared/services/language-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbOfficesSection',
    components: { GokbAddItemPopup, GokbConfirmationPopup },
    props: {
      modelValue: {
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
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        addItemPopupVisible: false,
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE,
          sortBy: ['popup'],
          desc: [false]
        },
        selectedItems: [],
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined }
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
      isEditable () {
        return !this.disabled
      },
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
        }
      },
      offices () {
        return [...this.modelValue]
          .map(item => ({
            ...item,
            lang: languageServices.getLanguage(item.language.name ? item.language.name : item.language, this.$i18n.locale).name
          }))
          .sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .slice((this.options.page - 1) * ROWS_PER_PAGE, this.options.page * ROWS_PER_PAGE)
      },
      tableHeaders () {
        return [
          { text: this.$i18n.tc('component.office.type.label'), align: 'start', value: 'function.name', sortable: false, width: '15%' },
          { text: this.$i18n.tc('component.office.name'), align: 'start', value: 'name', sortable: false, width: '15%' },
          { text: this.$i18n.tc('component.general.language.label'), align: 'start', value: 'lang', sortable: false, width: '15%' },
          { text: this.$i18n.tc('component.office.email'), align: 'start', value: 'email', sortable: false }
        ]
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.office.label', 2) : undefined
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substr(2, 5)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelected'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.office.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, name }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', name] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
        this.$emit('update', 'offices')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
        this.$emit('update', 'offices')
      },
      showAddItem () {
        this.addItemPopupVisible = true
      },
      addItem (item) {
        this.localValue.push({ ...item, id: this.tempId(), isDeletable: true, _pending: 'added' })
        this.$emit('update', 'offices')
      }
    }
  }
</script>
