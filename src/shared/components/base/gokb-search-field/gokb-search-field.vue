<template>
  <div
    v-if="readonly"
    :class="[(dense ? '' : 'mt-2 pt-4')]"
  >
    <div
      v-if="localLabel"
      style="font-size:0.8rem"
    >
      <label class="text-caption">
        {{ label }}
        <span
          v-if="required"
          style="color:red"
        >
          *
        </span>
      </label>
    </div>
    <div
      v-else
      style="font-size:1.1rem"
    >
      <label class="text-caption">
        {{ label }}
        <span
          v-if="required"
          style="color:red"
        >
          *
        </span>
      </label>
    </div>
    <router-link
      v-if="!!componentRoute && !!selectedVal"
      class="text-anchor"
      :style="{ fontSize: '1.1rem' }"
      :to="{ name: componentRoute, params: { 'id': selectedVal.id } }"
    >
      {{ localLabel }}
    </router-link>
    <span
      v-else
      style="font-size:1.1rem"
    >
      <label class="v-label">
        {{ localLabel }}
      </label>
    </span>
    <v-divider />
  </div>
  <v-combobox
    v-else-if="allowNewValues"
    v-model="localValue"
    :items="items"
    :label="label"
    :loading="loading"
    :placeholder="placeholder"
    :rules="activeRules"
    :dense="dense"
    :item-title="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
    :clearable="allowClear"
    hide-details
    hide-no-data
    no-filter
  >
    <template #label>
      {{ label }}
      <span
        v-if="required"
        style="color:red"
      >
        *
      </span>
    </template>
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <div :style="{ color: (item.raw.disabled ? '#888888' : 'inherit') }">
          {{ item.raw[itemText] }}
          <span
            v-if="!!item.raw.status"
          >
            <v-icon :color="statusColor(item.raw.status)">
              {{ statusIcon(item.raw.status) }}
            </v-icon>
          </span>
          <v-chip
            v-if="item.raw.disabled && !!item.raw.disabledMessage"
            color="error"
          >
            <span> {{ $t(item.raw.disabledMessage) }} </span>
          </v-chip>
        </div>
      </v-list-item>
    </template>
  </v-combobox>
  <v-autocomplete
    v-else
    ref="autocomplete"
    v-model="localValue"
    :items="items"
    :label="label"
    :loading="loading"
    :placeholder="placeholder"
    :rules="activeRules"
    :dense="dense"
    :item-title="itemText"
    :item-value="itemValue"
    variant="underlined"
    no-filter
    persistent-clear
    clearable
    auto-select-first
    hide-no-data
    return-object
    @update:search="prepareQuery"
  >
    <template #label>
      {{ label }}
      <span
        v-if="required"
        style="color:red"
      >
        *
      </span>
    </template>
    <template #selection="{ item }">
      <v-list-item
        :title="undefined"
        class="pl-0"
      >
        <router-link
          v-if="showLink"
          :style="{ fontSize: '1.1rem', maxWidth: '75%' }"
          class="text-anchor"
          color="accent"
          :to="{ name: componentRoute, params: { 'id': item.raw.id } }"
        >
          <span
            :title="item.raw[itemText]"
          >
            {{ item.raw[itemText] }}
          </span>
        </router-link>
        <span
          v-else
          style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:75%;"
        >
          <span>
            {{ item.raw[itemText] }}
          </span>
        </span>
      </v-list-item>
    </template>
    <template #item="{ props, item }">
      <v-list-item v-bind="props" :title="undefined">
        <span> {{ item.raw[itemText] }} </span>
        <span
          v-if="!!item.raw.status"
        >
          <v-icon :color="statusColor(item.raw.status)">
            {{ statusIcon(item.raw.status) }}
          </v-icon>
        </span>
        <v-chip
          v-if="item.rawdisabled && !!item.raw.disabledMessage"
          color="error"
        >
          <span> {{ $t(item.disabledMessage) }} </span>
        </v-chip>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import searchServices from '@/shared/services/search-services'

  export default {
    name: 'GokbSearchField',
    extends: BaseComponent,
    emits: ['update:model-value', 'searched'],
    searchServicesResourceUrl: undefined,
    searchParams: {},
    props: {
      modelValue: {
        required: true,
        validator: function (value) {
          return value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'object'
        }
      },
      allowNewValues: {
        type: Boolean,
        required: false,
        default: false
      },
      itemText: {
        type: String,
        required: false,
        default: 'name'
      },
      itemValue: {
        type: String,
        required: false,
        default: 'id'
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      },
      returnObject: {
        type: Boolean,
        required: false,
        default: false
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      showLink: {
        type: Boolean,
        required: false,
        default: false
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      label: {
        type: String,
        required: false,
        default: undefined
      },
      rules: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      queryFields: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      allowClear: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        placeholder: undefined,
        loading: false,
        mainParam: 'q',
        items: [],
        selectedVal: null,
        search: null,
        knownRoutes: {
          Organization: '/provider',
          Org: '/provider',
          Title: '/title',
          TitleInstance: '/title',
          Journal: '/title',
          JournalInstance: '/title',
          Book: '/title',
          BookInstance: '/title',
          Database: '/title',
          DatabaseInstance: '/title',
          Package: '/package',
          TIPP: '/package-title',
          TitleInstancePackagePlatform: '/package-title'
        }
      }
    },
    computed: {
      localLabel () {
        return this.selectedVal?.[this.itemText]
      },
      localValue: {
        get () {
          return this.modelValue
        },
        set (val) {
          this.selectedVal = val
          this.$emit('update:model-value', this.returnObject ? val : val.id)
        }
      },
      componentRoute () {
        return this.knownRoutes[this.modelValue?.type || this.modelValue?.componentType] || null
      },
      activeRules () {
        if (this.rules.length > 0 && this.rules[0].length > 0){
          return this.rules
        }
        return [v => !!v || !this.required || this.$i18n.t('validation.missingSelection')]
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesResourceUrl)
    },
    methods: {
      prepareQuery (term) {
        if (term?.length > 2) {
          this.query({ text: term})
        }
      },
      async query ({ id, text }) {
        this.loading = true
        var primaryParam = {}

        if (!!id) {
          primaryParam['id'] = id
        }
        else {
          primaryParam[this.mainParam] = text || this.modelValue?.id
        }

        if (this.queryFields?.length > 0) {
          this.searchParams['qfields'] = this.queryFields
        }

        const result = await this.catchError({
          promise: this.searchServices.search({
            ...this.searchParams,
            ...primaryParam,
          }, this.cancelToken.token),
          instance: this
        })
        this.loading = false
        this.items = this.transform(result)

        if (!!id) {
          this.selectedVal = this.items[0]
        }

        this.$emit('searched', true)
      },
      transform (result) {
        const { data: { data } } = result
        return data
      },
      clear () {
        this.search = null
        this.items = []
        this.localValue = undefined
        this.$refs.autocomplete.lazyValue = undefined
      },
      statusColor (status) {
        if (status?.name == "Current") return "success"
        if (status?.name == "Deleted") return "red"
        if (status?.name == "Expected") return "info"
        if (status?.name == "Retired") return "amber"
        return "default"
      },
      statusIcon (status) {
        if (status?.name == "Current") return "mdi-check-circle"
        if (status?.name == "Deleted") return "mdi-delete"
        if (status?.name == "Expected") return "mdi-clock"
        if (status?.name == "Retired") return "mdi-close-circle"
        return undefined
      }
    }
  }
</script>
