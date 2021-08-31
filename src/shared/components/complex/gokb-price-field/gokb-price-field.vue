<template>
  <v-row class="mt-4">
    <v-col cols="8">
      <vuetify-money
        v-model="localPrice"
        :label="$tc('component.tipp.prices.price.label')"
        :disabled="disabled"
        dense
      />
    </v-col>
    <v-col cols="4">
      <gokb-select-field
        v-model="localCurrency"
        :items="allCurrencies"
        return-object
        required
        dense
        :label="$tc('component.tipp.prices.currency.label')"
      />
    </v-col>
  </v-row>
</template>
<script>
  const CURRENCIES = [{ name: 'EUR' }, { name: 'GBP' }, { name: 'USD' }]

  export default {
    name: 'GokbPriceField',
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
      allCurrencies () {
        return CURRENCIES
      }
    }
  }
</script>
