<template>
  <div>
    <v-row style="min-height:90px">
      <v-col>
        <v-banner v-if="successor">
          <span class="font-weight-bold">
            {{ sourceItem.name }}
          </span>
        </v-banner>
        <gokb-title-field
          v-else
          v-model="localTitle"
          :disabled="disabled"
          :show-link="true"
          :required="true"
          :label="$tc('component.title.label')"
          type-filter="Journal"
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-label
          for="toggle-type"
        >
          {{ $t('component.title.history.add.changedTo.label') }}
        </v-label>
        <v-btn
          id="toggle-type"
          icon
          @click="toggleTypeSwitch"
        >
          <v-icon>mdi-swap-vertical</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row style="min-height:90px">
      <v-col>
        <gokb-title-field
          v-if="successor"
          v-model="localTitle"
          :disabled="disabled"
          :show-link="true"
          :required="true"
          :label="$tc('component.title.label')"
          return-object
          type-filter="Journal"
          @click:append="$emit('delete', value)"
        />
        <v-banner v-else>
          <span class="font-weight-bold">
            {{ sourceItem.name }}
          </span>
        </v-banner>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="2"
        align-self="center"
      >
        <v-label
          for="event-date"
          class="pb-1"
        >
          {{ $t('component.title.history.add.changedTo.on') }}
        </v-label>
      </v-col>
      <v-col>
        <gokb-date-field
          id="event-date"
          v-model="localDate"
          :required="true"
          :label="$t('component.title.history.date.label')"
          width="80%"
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
  export default {
    name: 'GokbHistoryEventField',
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      value: {
        type: Object,
        required: true,
        default: () => ({ date: undefined, item: undefined, successor: undefined })
      },
      sourceItem: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        successor: true,
      }
    },
    computed: {
      localDate: {
        get () {
          return this.value.date
        },
        set (date) {
          this.$emit('input', { date, successor: this.successor, item: this.value.item })
        }
      },
      localTitle: {
        get () {
          return this.value.item
        },
        set (item) {
          this.$emit('input', { date: this.value.date, successor: this.successor, item })
        }
      },
    },
    methods: {
      toggleTypeSwitch () {
        this.successor = !this.successor
      }
    }
  }
</script>
