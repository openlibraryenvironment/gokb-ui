<template>
  <div style="margin-top:-8px">
    <div style="font-size:13px;margin-bottom:4px"> {{ $tc('component.subject.label') }} </div>
    <v-row dense>
      <v-col cols="4">
        <gokb-state-field
          v-model="scheme"
          width="100%"
          message-path="component.subject.scheme"
          url="refdata/categories/Subject.Scheme"
          :placeholder="$tc('component.subject.scheme.label')"
          dense
          return-object
        />
      </v-col>
      <v-col cols="8">
        <v-autocomplete
          v-if="!!scheme && schemeName === 'DDC'"
          v-model="val"
          :disabled="!scheme"
          :items="$options.ddcList"
          :item-text="currentLabel"
          item-value="notation"
          :placeholder="$tc('component.subject.heading.label')"
          return-object
          clearable
          dense
          @click:append="$emit('delete', value)"
        />
        <v-text-field
          v-else
          v-model="val"
          :label="$tc('component.subject.heading.label')"
          disabled
          dense
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import DDC from '@/resources/ddc_list.json'

  export default {
    name: 'GokbSubjectFilterField',
    ddcList: DDC,
    props: {
      value: {
        required: true,
        default: '',
      }
    },
    data () {
      return {
        scheme: undefined,
        val: undefined,
        currentLabel: undefined,
        knownSchemes: {
          DDC: {
            lookupOnly: true,
            itemValue: 'notation',
            itemText: 'label'
          }
        }
      }
    },
    computed: {
      schemeName () {
        return !!this.scheme ? (this.scheme.name || this.scheme.value) : undefined
      }
    },
    watch: {
      value (val) {
        if (!!val && !this.scheme && !this.val) {
          var splitVal = val.split(';')

          this.scheme = splitVal[0]

          if (splitVal !== '*') {
            this.val = splitVal[0] === 'DDC' ? this.$options.ddcList.filter(cls => (cls.notation === splitVal[1]))[0] : splitVal[1]
          }
        }
      },
      scheme (val) {
        if (!val) {
          this.val = undefined
          this.currentLabel = undefined
        } else {
          this.currentLabel = this.knownSchemes[this.scheme.value] ? this.knownSchemes[this.scheme.value].itemText + '.' + this.$i18n.locale : 'label'
        }

        this.emitFinal()
      },
      val () {
        this.emitFinal()
      }
    },
    methods: {
      emitFinal () {
        let result = undefined

        if (!!this.scheme) {
          result = this.scheme.value + ';' + (!!this.val ? (this.knownSchemes[this.scheme.value] ? this.val[this.knownSchemes[this.scheme.value].itemValue] : this.val) : '*')
        }

        this.$emit('input', result)
      }
    }
  }
</script>
