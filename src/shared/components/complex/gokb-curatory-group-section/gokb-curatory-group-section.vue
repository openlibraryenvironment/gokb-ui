<template>
  <gokb-section
    :expandable="expandable"
    :title="title"
    :sub-title="subTitle"
    :items-total="totalNumberOfItems"
  >
    <gokb-add-item-popup
      v-if="addCuratoryGroupPopupVisible"
      v-model="addCuratoryGroupPopupVisible"
      :component="{ type: 'GokbCuratoryGroupField', name: $tc('component.curatoryGroup.label'), properties: { returnObject: true } }"
      @add="addNewCuratoryGroup"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click.prevent="showAddNewCuratoryGroup"
      >
        {{ $t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="mdi-delete"
        color="primary"
        :disabled="isDeleteSelectedDisabled"
        @click.prevent="confirmDeleteSelectedItems"
      >
        {{ $t('btn.remove') }}
      </gokb-button>
    </template>
    <template #actions>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="curatoryGroupsTableHeaders"
      :items="curatoryGroups"
      :editable="isEditable"
      :selected-items="selectedCuratoryGroups"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="curatoryGroupsOptions"
      :hide-select="!isEditable"
      @selected-items="selectedCuratoryGroups = $event"
      @delete-item="confirmDeleteItem"
    />
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbCuratoryGroupSection',
    emits: ['update:model-value'],
    components: {
      GokbAddItemPopup,
      GokbConfirmationPopup
    },
    props: {
      modelValue: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: false,
        default: undefined
      },
      subTitle: {
        type: String,
        required: false,
        default: undefined
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
      expandable: {
        type: Boolean,
        required: false,
        default: true
      },
      filterAlign: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        addCuratoryGroupPopupVisible: false,
        curatoryGroupsOptions: {
          page: 1,
          sortBy: [],
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedCuratoryGroups: [],

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined },
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      curatoryGroups () {
        return [...this.modelValue]
          .sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .map(group => ({ ...group, popup: { value: group.name, label: 'name', type: 'GokbCuratoryGroupPopup' } }))
          .slice((this.curatoryGroupsOptions.page - 1) * ROWS_PER_PAGE, this.curatoryGroupsOptions.page * ROWS_PER_PAGE)
      },
      isDeleteSelectedDisabled () {
        return !this.selectedCuratoryGroups.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
      isEditable () {
        return !this.disabled
      },
      curatoryGroupsTableHeaders () {
        return [
          { title: this.$i18n.t('component.general.name'), align: 'start', width: '100%', value: 'popup', sortable: false }
        ]
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedCuratoryGroups'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedCuratoryGroups.length, this.$i18n.tc('component.curatoryGroup.label', this.selectedCuratoryGroups.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, name }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', name] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedCuratoryGroups () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedCuratoryGroups
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedCuratoryGroups = []
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedCuratoryGroups = this.selectedCuratoryGroups.filter(({ id }) => id !== idToDelete)
      },
      showAddNewCuratoryGroup () {
        this.addCuratoryGroupPopupVisible = true
      },
      addNewCuratoryGroup ({ id, name }) {
        !this.localValue.find(({ id: idInAll }) => id === idInAll) &&
          this.localValue.push({ id, name, isDeletable: true })
      },
    }
  }
</script>
