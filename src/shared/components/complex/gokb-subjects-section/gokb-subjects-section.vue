<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :errors="!!apiErrors"
    :sub-title="title"
    :items-total="totalNumberOfItems"
  >
    <gokb-add-subject-popup
      v-if="addItemPopupVisible"
      v-model="addItemPopupVisible"
      width="500px"
      @add="addItem"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click="showAddSubject"
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
    <span v-if="errorMessage">
      <v-alert
        v-model="showErrorMessage"
        type="error"
        dismissible
      >
        {{ errorMessage }}
      </v-alert>
    </span>
    <gokb-table
      :headers="tableHeaders"
      :items="subjects"
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
  import GokbAddSubjectPopup from '@/shared/popups/gokb-add-subject-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import DDC from '@/resources/ddc_list.json'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbSubjectsSection',
    components: { GokbAddSubjectPopup, GokbConfirmationPopup },
    ddcList: DDC,
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
          itemsPerPage: ROWS_PER_PAGE
        },
        errorMessage: undefined,
        showErrorMessage: false,
        selectedItems: [],
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: {
          text: undefined,
          vars: undefined
        },
        knownSchemes: {
          DDC: {
            lookupOnly: true,
            itemValue: 'notation',
            itemText: 'label'
          }
        },
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
      subjects () {
        return [...this.value]
          .map(item => ({
            ...item,
            schemeName: item.scheme.name,
            label: this.knownSchemes[item.scheme.name] ? this.$options.ddcList.find(cls => (cls.notation === item.heading)).label[this.$i18n.locale] : item.heading,
            markError: this.apiErrors?.find(e => (e.baddata.scheme === item.scheme && e.baddata.heading === item.heading))
              ? this.$i18n.t('component.subject.error.' + this.apiErrors.find(e => (e.baddata.scheme === item.scheme && e.baddata.heading === item.heading)))
              : null
          }))
          .sort(({ scheme: first }, { scheme: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
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
          { text: this.$i18n.tc('component.subject.scheme.label'), align: 'start', value: 'schemeName', sortable: false },
          { text: this.$i18n.tc('component.subject.heading.label'), align: 'start', value: 'label', sortable: false },
        ]
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.subject.label', 2) : undefined
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substring(2, 5)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelected'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.subject.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, scheme, heading }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', '' + scheme.name + ':' + heading] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        // console.log('_deleteSelected')
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
        this.$emit('update', 'subjects')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
        this.$emit('update', 'subjects')
      },
      showAddSubject () {
        this.addItemPopupVisible = true
      },
      addItem (item) {
        if (!this.localValue.find(({ heading, scheme }) => heading === item.heading && scheme.id === item.scheme.id )) {
          this.localValue.push({ id: this.tempId(), heading: item.heading, scheme: item.scheme, isDeletable: true, _pending: 'added' })
          this.$emit('update', 'subjects')
        } else {
          this.errorMessage = this.$i18n.t('component.subject.error.duplicate', ['' + item.scheme.name + ':' + item.heading])
          this.showErrorMessage = true
        }
      }
    }
  }
</script>
