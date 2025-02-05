<template>
  <div>
    <v-row>
      <v-col>
        <gokb-state-field
          v-model="officeType"
          message-path="component.office.type"
          width="100%"
          return-object
          url="refdata/categories/Office.Function"
          :label="$t('component.office.type.label')"
        />
      </v-col>
      <v-col cols="4">
        <gokb-select-language-field
          v-model="language"
          width="100%"
          :label="$t('component.general.language.label')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="name"
          :disabled="disabled"
          required
          :label="'Name'"
          :append-icon="deleteIcon"
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-email-field
          v-model="email"
          :disabled="disabled"
          required
          :label="$t('component.user.email')"
          :append-icon="deleteIcon"
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbOfficeField',
    components: { GokbTextField },
    emits: ['update:model-value', 'delete'],
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
        default: () => ({ name: undefined, type: undefined, email: undefined, language: undefined })
      },
    },
    data () {
      return {
        localObj: {
          type: undefined,
          name: undefined,
          email: undefined,
          language: undefined,
          localType: undefined,
          localLanguage: undefined
        }
      }
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localValue: {
        get () {
          return this.modelValue
        },
        set (value) {
          this.$emit('update:model-value', value)
        }
      },
      officeType: {
        get () {
          return this.modelValue.function
        },
        set (type) {
          this.localObj.function = type

          if (type) {
            this.localObj.localType = this.$i18n.t('component.office.type.' + type.value + '.label')
          }
          this.localValue = this.localObj
        }
      },
      language: {
        get () {
          return this.modelValue.language
        },
        set (language) {
          this.localObj.language = language
          if (language) {
            this.localObj.localLanguage = language.value
          }
          this.localValue = this.localObj
        }
      },
      name: {
        get () {
          return this.modelValue.name
        },
        set (name) {
          this.localObj.name = name
          this.localValue = this.localObj
        }
      },
      email: {
        get () {
          return this.modelValue.email
        },
        set (email) {
          this.localObj.email = email
          this.localValue = this.localObj
        }
      },
    }
  }
</script>
