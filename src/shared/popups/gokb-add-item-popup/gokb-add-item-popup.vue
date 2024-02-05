<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('header.add.label', [component.name])"
    :is-valid="isValid"
    :width="width"
    @submit="addItem"
  >
    <component
      :is="component.type"
      v-model="item"
      v-bind="component.properties"
    />
    <v-spacer />
    <gokb-button
      text
      @click="close"
    >
      {{ $t('btn.cancel') }}
    </gokb-button>
    <gokb-button
      :disabled="!isValid"
      default
    >
      {{ $t('btn.add') }}
    </gokb-button>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbAddItemPopup',
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      component: {
        type: Object,
        required: true
      },
      width: {
        type: [Number, String],
        required: false,
        default: 400
      }
    },
    data () {
      return {
        item: undefined,
        isValid: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    },
    watch: {
      item: {
        deep: true,
        handler () {
          this.isValid = this.$refs.comp.$refs.form.validate()
        }
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
