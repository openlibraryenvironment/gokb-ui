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
      v-if="componentRoute"
      :style="{ color: 'primary', fontSize: '1.1rem' }"
      :to="{ name: componentRoute, params: { 'id': value.id } }"
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
    :search-input.sync="search"
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
    <template #item="{ item }">
      <span>
        <div :style="{ color: (item.disabled ? '#888888' : 'inherit') }">
          {{ item[itemText] }}
          <span
            v-if="!!item.status"
          >
            <v-icon :color="statusColor(item.status)">
              {{ statusIcon(item.status) }}
            </v-icon>
          </span>
          <v-chip
            v-if="item.disabled && !!item.disabledMessage"
            color="error"
          >
            <span> {{ $t(item.disabledMessage) }} </span>
          </v-chip>
        </div>
      </span>
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
    :search-input.sync="search"
    :item-title="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
    no-filter
    clearable
    hide-no-data
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
    <template v-slot:selection="data">
      <router-link
        v-if="showLink"
        :style="{ color: 'accent', fontSize: '1.1rem', maxWidth: '75%' }"
        class="text-truncate"
        color="accent"
        :to="{ name: componentRoute, params: { 'id': data.item.id } }"
      >
        <span
          :title="data.item[itemText]"
        >
          {{ data.item[itemText] }}
        </span>
      </router-link>
      <span
        v-else
        style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:75%;"
      >
        <span
          :title="data.item[itemText]"
        >
          {{ data.item[itemText] }}
        </span>
      </span>
    </template>
    <template #item="{ item }">
      {{ item[itemText] }}
      <span
        v-if="!!item.status"
      >
        <v-icon :color="statusColor(item.status)">
          {{ statusIcon(item.status) }}
        </v-icon>
      </span>
      <v-chip
        v-if="item.disabled && !!item.disabledMessage"
        color="error"
      >
        <span> {{ $t(item.disabledMessage) }} </span>
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import searchServices from '@/shared/services/search-services'

  export default {
    name: 'GokbSearchField',
    extends: BaseComponent,
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
        return this.modelValue?.[this.itemText]
      },
      localValue: {
        get () {
          return this.returnObject ? this.modelValue : this.modelValue?.[this.itemValue]
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
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
    watch: {
      search (text) {
        // console.log('search', this.modelValue, this.localValue, this.search, value)
        text && text !== this.modelValue?.value && text.length > 2 && this.query({ text })
      },
      value (val) {
        if (!!this.modelValue && typeof this.modelValue !== 'object') {
          this.query({ id: val })
        }
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesResourceUrl)

      if (!!this.modelValue && typeof this.modelValue === 'object') {
        this.items = [this.modelValue]
      }
      else {
        this.items = []
      }
    },
    methods: {
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
          this.$refs.autocomplete.lazyValue = this.items[0]
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
