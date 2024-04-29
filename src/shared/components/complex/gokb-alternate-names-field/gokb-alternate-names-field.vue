<template>
  <v-row>
    <v-col cols="8">
      <gokb-text-field
        v-model="variant"
        :disabled="disabled"
        :label="$tc('component.variantName.label')"
        required
      />
    </v-col>
    <v-col cols="4">
      <gokb-locale-field
        v-model="language"
        class="mr-4"
        :label="$t('component.general.language.label')"
        clearable
        return-object
      />
    </v-col>
  </v-row>
</template>
<script>
  import GokbLocaleField from '@/shared/components/simple/gokb-locale-field'
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbAlternateNamesField',
    components: { GokbLocaleField, GokbTextField },
    emits: ['update:model-value'],
    props: {
      namespaceFixed: {
        type: Boolean,
        required: false
      },
      targetType: {
        type: String,
        required: false,
        default: undefined
      },
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
        default: () => ({ variantName: undefined, locale: undefined })
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      language: {
        get () {
          return this.modelValue.locale?.name
        },
        set (locale) {
          this.$emit('update:model-value', { locale: locale?.name, variantName: this.variant })
        }
      },
      variant: {
        get () {
          return this.modelValue.variantName
        },
        set (variantName) {
          this.$emit('update:model-value', { locale: this.language, variantName })
        }
      }
    }
  }
</script>
