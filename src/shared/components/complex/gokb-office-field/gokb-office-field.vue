<template>
  <div>
    <v-row>
      <v-col>
        <gokb-state-field
          v-model="localType"
          message-path="component.office.type"
          width="100%"
          return-object
          url="refdata/categories/Office.Type"
          :label="$t('component.office.type.label')"
        />
      </v-col>
      <v-col cols="4">
        <gokb-state-field
          v-model="localLanguage"
          width="100%"
          return-object
          url="refdata/categories/KBComponent.Language"
          :label="$t('component.general.language.label')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="localName"
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
          v-model="localEmail"
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
        default: () => ({ name: undefined, type: undefined, email: undefined, language: undefined })
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localValue: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      localType: {
        get () {
          return this.value.type
        },
        set (type) {
          this.localValue = {
            type,
            name: this.value.name,
            email: this.value.email,
            language: this.value.language
          }
        }
      },
      localLanguage: {
        get () {
          return this.value.language
        },
        set (language) {
          this.localValue = {
            type: this.value.type,
            name: this.value.name,
            email: this.value.email,
            language
          }
        }
      },
      localName: {
        get () {
          return this.value.name
        },
        set (name) {
          this.localValue = {
            type: this.value.type,
            name,
            email: this.value.email,
            language: this.value.language
          }
        }
      },
      localEmail: {
        get () {
          return this.value.email
        },
        set (email) {
          this.localValue = {
            type: this.value.type,
            name: this.value.name,
            email,
            language: this.value.language
          }
        }
      },
    }
  }
</script>
