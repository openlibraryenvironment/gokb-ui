<template>
  <v-row v-for="(statement, idx) in localValue"
    :key="idx">
    <v-col>
      <gokb-section
        no-tool-bar
        :style="{ border: statement.valid ? 'none' : '1 px red'}"
      >
        <v-row>
          <v-col cols="4">
            <gokb-state-field
              v-model="statement.coverageDepth"
              :readonly="readonly"
              :init-item="statement.coverageDepth"
              :label="$t('component.tipp.coverage.depth.label')"
              message-path="component.tipp.coverage.depth"
              url="refdata/categories/TIPPCoverageStatement.CoverageDepth"
            />
          </v-col>
          <v-col>
            <gokb-textarea-field
              v-model="statement.coverageNote"
              :disabled="readonly"
              :label="$t('component.tipp.coverage.note')"
            />
          </v-col>
          <v-col
            v-if="!readonly && localValue.length > 1"
            cols="1"
            class="pt-6 mr-2"
          >
            <v-btn
              icon
              :title="$t('btn.delete')"
              color="primary"
              @click.prevent="removeCoverage(idx)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="isJournal">
          <v-col md="4">
            <gokb-date-field
              v-model="statement.startDate"
              :readonly="readonly"
              dense
              :label="$t('component.tipp.coverage.startDate')"
              :api-errors="errors.startDate || undefined"
            />
          </v-col>
          <v-col md="4">
            <gokb-text-field
              v-model="statement.startVolume"
              :disabled="readonly"
              dense
              :label="$t('component.tipp.coverage.startVolume')"
            />
          </v-col>
          <v-col md="4">
            <gokb-text-field
              v-model="statement.startIssue"
              :disabled="readonly"
              dense
              :label="$t('component.tipp.coverage.startIssue')"
            />
          </v-col>
        </v-row>
        <v-row v-if="isJournal">
          <v-col md="4">
            <gokb-date-field
              v-model="statement.endDate"
              :readonly="readonly"
              dense
              :label="$t('component.tipp.coverage.endDate')"
              :api-errors="errors.endDate || undefined"
            />
          </v-col>
          <v-col md="4">
            <gokb-text-field
              v-model="statement.endVolume"
              :disabled="readonly"
              :rules="[(!statement.endVolume || !!statement.startVolume || $t('component.tipp.coverage.error.endVolume.noStart'))]"
              dense
              :label="$t('component.tipp.coverage.endVolume')"
            />
          </v-col>
          <v-col md="4">
            <gokb-text-field
              v-model="statement.endIssue"
              :disabled="readonly"
              :rules="[(!statement.endIssue || !!statement.startIssue || $t('component.tipp.coverage.error.endIssue.noStart'))]"
              dense
              :label="$t('component.tipp.coverage.endIssue')"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-embargo-field
              v-model="statement.embargo"
              :readonly="readonly"
              :api-errors="errors.embargo || undefined"
            />
          </v-col>
        </v-row>
      </gokb-section>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'GokbCoverageStatementSField',
    emits: ['update:model-value', 'valid', 'remove'],
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      modelValue: {
        type: Array,
        required: false,
        default: undefined
      },
      isJournal: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        coverageObject: {
          coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
          startDate: undefined,
          endDate: undefined,
          startVolume: undefined, // number
          endVolume: undefined, // number
          startIssue: undefined, // number
          endIssue: undefined, // number
          coverageNote: undefined, // note
          embargo: undefined
        },
        validStates: [],
        embargoStates: [],
        allValid: true,
        embargoValid: true,
        errors: {}
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      }
    },
    watch: {
      localValue: {
        handler(val) {
          let idx = 0

          for (const statement of val) {
            this.validStates[idx] = this.isStatementValid(statement)
            idx++
          }
        },
        deep: true
      },
      validStates: {
        handler(states) {
          if (states.some(s => (s === false))) {
            this.allValid = false
          }
          else {
            this.allValid = true
          }

          this.$emit('valid', this.allValid)
        },
        deep: true
      },

    },
    created() {
      for (const cs of this.localValue) {
        this.validStates.push(true)
      }
    },
    methods: {
      removeCoverage (idx) {
        this.$emit('remove', true)
        this.validStates.splice(idx, 1)
        this.localValue.splice(idx, 1)

        if (this.localValue.length === 0) {
          this.validStates.push(true)
          this.localValue.push(this.coverageObject)
        }
      },
      isStatementValid (statement) {
        let valid = true

        if (!!statement.endVolume && !statement.startVolume) {
          valid = false
        } else if (!!statement.endDate && !statement.startDate) {
          valid = false
        } else if (!!statement.endIssue && !statement.startIssue) {
          valid = false
        } else if (!!statement.embargo && statement.embargo.match(/^[P,R][0-9]*[D,M,Y]$/)) {
          valid = false
        }

        return valid
      }
    }
  }
</script>
