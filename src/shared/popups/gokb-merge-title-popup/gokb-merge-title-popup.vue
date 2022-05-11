<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    title="Merge Title"
    :width="width"
    @submit="addItem"
  >
    <v-row>
      <v-col>
        <gokb-title-field
          v-if="component"
          v-model="options.target"
          :type-filter="component.type"
          :label="$tc('component.title.label')"
          dense
          show-link
          return-object
        />
      </v-col>
    </v-row>
    <v-row v-if="options.target">
      <v-col>
        {{ $t('workflow.title.merge.howto') }}
      </v-col>
    </v-row>
    <v-row v-if="options.target">
      <v-col class="font-weight-bold">
        {{ component.name }}
      </v-col>
      <v-col class="font-weight-bold">
        {{ options.target.name }}
      </v-col>
    </v-row>
    <v-row v-if="options.target">
      <v-col>
        <div class="text--caption">{{ $tc('component.identifier.label', 2) }}</div>
        <v-divider class="mb-4" />
        <v-checkbox
          v-for="idobj in component.ids"
          :label="`${idobj.nslabel}: ${idobj.value}`"
          :key="idobj.id"
          :value="idobj.id"
        />
      </v-col>
      <v-divider vertical />
      <v-col>
        <div class="text--caption">{{ $tc('component.identifier.label', 2) }}</div>
        <v-divider />
        <v-list dense>
          <v-list-item-group>
            <v-list-item
              v-for="idobj in options.target._embedded.ids"
              :key="idobj.id"
              class="v-label"
              inactive
            >
              {{idobj.namespace.name || idobj.namespace.value }}: {{idobj.value}}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-row v-if="options.target">
      <v-col>
        <div class="text--caption">{{ $tc('component.tipp.label', 2) }}</div>
        <v-divider class="mb-4" />
        <v-list dense>
          <v-list-item-group>
            <v-list-item
              v-for="tippobj in component.tipps"
              :key="tippobj.id"
              class="v-label"
              inactive
            >
              {{tippobj.name}}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbMergeTitlePopup',
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
        default: 800
      }
    },
    data () {
      return {
        options: {
          target: undefined,
          tipps: [],
          mergeTipps: true,
          ids: [],
          mergeIds: false
        }
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
    methods: {
      addItem () {
        this.$emit('submit', this.options)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
