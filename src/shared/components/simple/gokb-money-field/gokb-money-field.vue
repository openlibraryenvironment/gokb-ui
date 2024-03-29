<template>
  <div>
    <v-text-field
      v-model="cmpValue"
      :label="label"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :outlined="outlined"
      :dense="dense"
      :hide-details="hideDetails"
      :error="error"
      :error-messages="errorMessages"
      :rules="rules"
      :clearable="clearable"
      :prefix="options.prefix"
      :suffix="options.suffix"
      v-bind="properties"
      @keypress="keyPress"
      @blur="onBlur"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  model: { prop: "value", event: "input" },
  props: {
    value: {
      // type: String,
      type: [String, Number],
      default: "0"
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: undefined
    },
    readonly: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: [Boolean, String],
      default: false
    },
    errorMessages: {
      type: [Array, String],
      default: () => []
    },
    rules: {
      type: [Array, String],
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    valueWhenIsEmpty: {
      type: String,
      default: "" // "0" or "" or null
    },
    valueOptions: {
      type: Object,
      default: function() {
        return {
          min: 0,
          minEvent: "SetValueMin"
        };
      }
    },
    options: {
      type: Object,
      default: function() {
        return {
          locale: "en",
          prefix: "",
          suffix: "",
          length: 11,
          precision: 2
        };
      }
    },
    // Other v-text-field properties
    properties: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: () => ({}),
  computed: {
    cmpValue: {
      get: function() {
        return this.value !== null && this.value !== ""
          ? this.humanFormat(this.value.toString())
          : this.valueWhenIsEmpty;
      },
      set: function(newValue) {
        this.$emit("input", this.machineFormat(newValue));
      }
    }
  },
  methods: {
    humanFormat: function(number) {
      if (isNaN(number)) {
        number = "";
      } else {
        number = Number(number).toLocaleString(this.$i18n.locale, {
          maximumFractionDigits: this.options.precision,
          minimumFractionDigits: this.options.precision
        });
      }
      return number;
    },
    machineFormat(number) {
      if (number) {
        number = this.cleanNumber(number);
        number = number.padStart(parseInt(this.options.precision) + 1, "0");
        number =
          number.substring(
            0,
            number.length - parseInt(this.options.precision)
          ) +
          "." +
          number.substring(
            number.length - parseInt(this.options.precision),
            number.length
          );
        if (isNaN(number)) {
          number = this.valueWhenIsEmpty;
        }
      } else {
        number = this.valueWhenIsEmpty;
      }
      if (this.options.precision === 0) {
        number = this.cleanNumber(number);
      }
      return number;
    },
    keyPress($event) {
      // console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      if (keyCode < 48 || keyCode > 57) {
        // 46 is dot
        $event.preventDefault();
      }
      if (this.targetLength()) {
        $event.preventDefault();
      }
    },
    cleanNumber: function(value) {
      let result = "";
      if (value) {
        let flag = false;
        let arrayValue = value.toString().split("");
        for (var i = 0; i < arrayValue.length; i++) {
          if (this.isInteger(arrayValue[i])) {
            if (!flag) {
              // Retirar zeros à esquerda
              if (arrayValue[i] !== "0") {
                result = result + arrayValue[i];
                flag = true;
              }
            } else {
              result = result + arrayValue[i];
            }
          }
        }
      }
      return result;
    },
    isInteger(value) {
      let result = false;
      if (Number.isInteger(parseInt(value))) {
        result = true;
      }
      return result;
    },
    targetLength() {
      if (
        Number(this.cleanNumber(this.value).length) >=
        Number(this.options.length)
      ) {
        return true;
      } else {
        return false;
      }
    },
    onBlur() {
      if (
        this.value.length === 0 ||
        parseFloat(this.value) <= this.valueOptions.min
      )
        this.$emit(
          this.valueOptions.minEvent || "SetValueMin",
          this.valueOptions.min
        );

      if (
        this.valueOptions.max &&
        parseFloat(this.value) >= this.valueOptions.max
      )
        this.$emit(
          this.valueOptions.maxEvent || "SetValueMax",
          this.valueOptions.max
        );
    }
  }
};
</script>
