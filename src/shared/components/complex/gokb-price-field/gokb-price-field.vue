<template>
  <div>
    <v-row class="mt-4">
      <v-col cols="8">
        <gokb-money-field
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
      modelValue: {
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
          return this.modelValue.price
        },
        set (price) {
          this.$emit('update:modelValue', {
            price,
            currency: this.modelValue.currency,
            priceType: this.modelValue.priceType,
            startDate: this.modelValue.startDate,
            endDate: this.modelValue.endDate,
            type: this.modelValue.type
          })
        }
      },
      localCurrency: {
        get () {
          return this.modelValue.currency
        },
        set (currency) {
          this.$emit('update:modelValue', {
            price: this.modelValue.price,
            currency,
            priceType: this.modelValue.priceType,
            startDate: this.modelValue.startDate,
            endDate: this.modelValue.endDate,
            type: this.modelValue.type
          })
        }
      },
      localStartDate: {
        get () {
          return this.modelValue.startDate
        },
        set (startDate) {
          this.$emit('update:modelValue', {
            price: this.modelValue.price,
            currency: this.modelValue.currency,
            priceType: this.modelValue.priceType,
            startDate,
            endDate: this.modelValue.endDate,
            type: this.modelValue.type,
          })
        }
      },
      localEndDate: {
        get () {
          return this.modelValue.endDate
        },
        set (endDate) {
          this.$emit('update:modelValue', {
            price: this.modelValue.price,
            currency: this.modelValue.currency,
            priceType: this.modelValue.priceType,
            startDate: this.modelValue.startDate,
            endDate,
            type: this.modelValue.type,
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
