<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('header.add.label', [$t('component.general.comment.label')])"
    :width="width"
    @submit="addItem"
  >
    <div>
      <gokb-select-field
          v-model="item.language"
          :static-items="localLanguages"
          class="mr-4"
          :label="$t('component.general.language.label')"
          item-title="label"
          item-value="name"
          return-object
          required
        />
    </div>
    <div>
      <gokb-textarea-field
          v-model="item.value"
          :label="$tc('component.general.comment.label')"
          required
      />
    </div>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        :disabled="!isValid"
        is-submit
      >
        {{ $t('btn.add') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbAddCommentPopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'add'],
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      width: {
        type: [Number, String],
        required: false,
        default: 600
      }
    },
    data () {
      return {
        item: {
          value: undefined,
          namespace: undefined
        },
        failedValidation: false
      }
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localValue: {
        get () {
          return this.modelValue || true
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      isValid () {
        return !!this.item.value && !!this.item.language
      },
      localLanguages() {
        return [
          {
            "name": "eng",
            "label": this.$i18n.t('default.languages.en')
          },
          {
            "name": "ger",
            "label": this.$i18n.t('default.languages.de')
          }
        ]
      }
    },
    methods: {
      addItem () {
        this.$emit('add', this.item)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
