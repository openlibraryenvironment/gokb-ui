<template>
  <gokb-dialog
    v-model="localValue"
    :title="$t('popups.confirm.label')"
    persistent
    @submit="submit"
  >
    <v-sheet>
      <span v-if="typeof message === 'string'">
        {{ $t(message) }}
      </span>
      <i18n-t
        v-else-if="!!message.vars"
        :keypath="message.text"
        scope="global"
      >
        <b v-for="(v, i) in message.vars">{{ v }}</b>
      </i18n-t>
      <span v-else> {{ $t(message.text) }} </span>

      <div
        v-if="typeof message !== 'string' && !!message.bullets && message.bullets.length > 0"
        class="ml-4 mt-4"
      >
        <ul>
          <li v-for="b in message.bullets">
            <span v-if="typeof b === 'string'">
              {{ $t(b) }}
            </span>
            <i18n-t
              v-else-if="!!b.vars"
              :keypath="b.text"
              scope="global"
            >
              <b v-for="(v, i) in b.vars">{{ v }}</b>
            </i18n-t>
            <span v-else> {{ $t(b.text) }} </span>
          </li>
        </ul>
      </div>
    </v-sheet>

    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.prevent="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button is-submit>
        {{ $t('btn.confirm') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbConfirmationPopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'confirmed'],
    props: {
      modelValue: {
        type: Boolean,
        required: true,
        default: false
      },
      message: {
        type: [Object, String],
        required: true,
        default: ''
      },
    },
    data () {
      return {
        error: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (value) {
          this.$emit('update:model-value', value)
        }
      },
    },
    async created () {
    },
    methods: {
      submit () {
        this.close()
        this.$emit('confirmed', true)
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
