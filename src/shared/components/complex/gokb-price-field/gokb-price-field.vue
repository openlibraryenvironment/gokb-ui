<template>
  <div>
    <v-row>
      <v-col>
        <gokb-state-field
          v-model="localPriceType"
          message-path="component.tipp.prices.priceType"
          url="refdata/categories/Price.type"
          return-object
          :label="$t('component.tipp.prices.priceType.label')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <gokb-number-field
          v-model="localPrice"
          :disabled="disabled"
          dense
          :label="$tc('component.tipp.prices.label')"
          :append-icon="deleteIcon"
          @click:append="$emit('delete', value)"
        />
      </v-col>
      <v-col cols="4">
        <gokb-select-field
          v-model="localCurrency"
          :items="allCurrencies"
          return-object
          dense
          :label="$tc('component.tipp.prices.currency.label')"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import GokbStateField from '@/shared/components/simple/gokb-state-field'
  import GokbNumberField from '@/shared/components/simple/gokb-number-field'

  const CURRENCIES = [{ name: 'EUR' }, { name: 'GBP' }, { name: 'USD' }]

  export default {
    name: 'GokbPriceField',
    components: { GokbStateField, GokbNumberField },
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      deleteable: {
        type: Boolean,
        required: false
      },
      value: {
        type: Object,
        required: true,
        default: () => ({ currency: undefined, price: undefined, priceType: undefined })
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localPrice: {
        get () {
          return this.value.price
        },
        set (price) {
          this.$emit('input', { price, currency: this.value.currency, priceType: this.value.priceType })
        }
      },
      localCurrency: {
        get () {
          return this.value.currency
        },
        set (currency) {
          this.$emit('input', { price: this.value.price, currency, priceType: this.value.priceType })
        }
      },
      localPriceType: {
        get () {
          return this.value.priceType
        },
        set (type) {
          this.$emit('input', { priceType: type, currency: this.value.currency, price: this.value.price })
        }
      },
      allCurrencies () {
        return CURRENCIES
      }
    }
  }
</script>
