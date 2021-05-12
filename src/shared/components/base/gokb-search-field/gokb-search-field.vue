<template>
  <div
    v-if="readonly"
    class="mt-2 pt-4"
  >
    <div
      v-if="localLabel"
      style="font-size:0.8rem"
    >
      <label class="text-caption">{{ label }}</label>
    </div>
    <div
      v-else
      style="font-size:1.1rem"
    >
      <label class="text-caption">{{ label }}</label>
    </div>
    <router-link
      v-if="componentRoute"
      :style="{ color: '#f2994a', fontSize: '1.1rem' }"
      :to="{ name: componentRoute, params: { 'id': value.id } }"
    >
      {{ localLabel }}
    </router-link>
    <span
      v-else
      style="font-size:1.1rem"
    >
      <label class="v-label">{{ localLabel }}</label>
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
    :rules="rules"
    :search-input.sync="search"
    :item-text="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
    clearable
    hide-details
    hide-no-data
    no-filter
  />
  <v-autocomplete
    v-else
    v-model="localValue"
    :items="items"
    :label="label"
    :loading="loading"
    :placeholder="placeholder"
    :rules="rules"
    :search-input.sync="search"
    :item-text="itemText"
    :item-value="itemValue"
    :return-object="returnObject"
    no-filter
    clearable
    hide-no-data
  >
    <template v-slot:selection="data">
      <router-link
        v-if="showLink"
        :style="{ color: '#f2994a', fontSize: '1.1rem', maxWidth: '75%' }"
        class="text-truncate"
        :to="{ name: knownRoutes[data.item.type], params: { 'id': data.item.id } }"
      >
        <span :title="data.item[itemText]">{{ data.item[itemText] }}</span>
      </router-link>
      <span
        v-else
        style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:75%;"
      >
        <span :title="data.item[itemText]">{{ data.item[itemText] }}</span>
      </span>
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
      value: {
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
      }
    },
    data () {
      return {
        placeholder: undefined,
        rules: undefined,
        loading: false,
        mainParam: 'q',
        items: [],
        search: null,
        knownRoutes: {
          Organization: '/provider',
          Title: '/title',
          Journal: '/title',
          Book: '/title',
          Database: '/title',
          Package: '/package'
        }
      }
    },
    computed: {
      localLabel () {
        return this.value?.[this.itemText]
      },
      localValue: {
        get () {
          // console.log('get', this.label, this.value)
          return this.returnObject ? this.value : this.value?.[this.itemValue]
        },
        set (localValue) {
          // console.log('set', this.label, localValue, this.items)
          this.$emit('input', localValue)
        }
      },
      componentRoute () {
        return this.knownRoutes?.[this.value?.type] || null
      }
    },
    watch: {
      search (text) {
        // console.log('search', this.value, this.localValue, this.search, value)
        text && text !== this.value?.value && text.length > 2 && this.query({ text })
      }
    },
    mounted () {
      this.searchServices = searchServices(this.searchServicesResourceUrl)
      this.items = this.value ? [this.value] : []
    },
    methods: {
      async query ({ id, text }) {
        this.loading = true
        var primaryParam = {}
        primaryParam[this.mainParam] = text || this.value?.id

        const result = await this.catchError({
          promise: this.searchServices.search({
            ...this.searchParams,
            ...primaryParam,
          }, this.cancelToken.token),
          instance: this
        })
        this.loading = false
        this.items = result?.data?.data
      }
    }
  }
</script>
