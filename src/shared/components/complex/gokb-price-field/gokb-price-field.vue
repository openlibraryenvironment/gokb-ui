<template>
  <div>
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
    <v-row dense>
      <v-col>
        <gokb-date-field
          id="start-date"
          v-model="localStartDate"
          width="80%"
          :label="$t('component.tipp.prices.startDate.label')"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <gokb-date-field
          id="end-date"
          v-model="localEndDate"
          :rules="endDateRules"
          width="80%"
          :label="$t('component.tipp.prices.endDate.label')"
        />
      </v-col>
    </v-row>
  </div>
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
        default: () => ({
          currency: undefined,
          price: undefined,
          priceType: undefined,
          type: 'list',
          startDate: undefined,
          endDate: undefined
        })
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
          this.$emit('input', {
            price,
            currency: this.value.currency,
            priceType: this.value.priceType,
            startDate: this.value.startDate,
            endDate: this.value.endDate,
            type: this.value.type
          })
        }
      },
      localCurrency: {
        get () {
          return this.value.currency
        },
        set (currency) {
          this.$emit('input', {
            price: this.value.price,
            currency,
            priceType: this.value.priceType,
            startDate: this.value.startDate,
            endDate: this.value.endDate,
            type: this.value.type
          })
        }
      },
      localStartDate: {
        get () {
          return this.value.startDate
        },
        set (startDate) {
          this.$emit('input', {
            price: this.value.price,
            currency: this.value.currency,
            priceType: this.value.priceType,
            startDate,
            endDate: this.value.endDate,
            type: this.value.type,
          })
        }
      },
      localEndDate: {
        get () {
          return this.value.endDate
        },
        set (endDate) {
          this.$emit('input', {
            price: this.value.price,
            currency: this.value.currency,
            priceType: this.value.priceType,
            startDate: this.value.startDate,
            endDate,
            type: this.value.type,
          })
        }
      },
      endDateRules () {
        return [
          value => !value || (/^([12][0-9]{3})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/.test(value) && !isNaN(new Date(value))) || this.$i18n.t('validation.dateFormat'),
          value => !this.localStartDate || !value || (!!value && !isNaN(new Date(value)) && new Date(value) >= new Date(this.localStartDate)) || this.$i18n.t('validation.dateRange')
        ]
      },
      allCurrencies () {
        return CURRENCIES
      }
    }
  }
</script>
