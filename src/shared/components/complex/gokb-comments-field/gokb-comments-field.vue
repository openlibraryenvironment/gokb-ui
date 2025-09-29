<template>
  <div>
    <div>
      <gokb-add-comment-popup
        v-if="addCommentPopupVisible"
        v-model="addCommentPopupVisible"
        :existing-langs="currentLanguages"
        @add="addNewComment"
      />
      <gokb-confirmation-popup
          v-model="confirmDeleteVisible"
          :message="confirmDeletionMessage"
          @confirmed="deleteComment"
        />
      <div v-if="showTitle" class="text-primary mb-2">
        {{ $t('component.general.comment.label', 2) }}
      </div>
      <span v-for="comment in localValue">
        <v-chip
          v-if="activeLang === comment.language.name"
          class="font-weight-bold mx-1"
          variant="elevated"
          color="info"
          style="cursor:default"
          density="comfortable"
          label>
          {{ $t('default.languages.' + comment.language.name) }}
        </v-chip>
        <v-chip
          v-else
          class="text-underlined mx-1"
          variant="outlined"
          style="cursor:pointer"
          density="comfortable"
          label
          @click="selectActiveLang(comment.language.name)"
        >
          {{ $t('default.languages.' + comment.language.name) }}
        </v-chip>
      </span>
      <v-btn
        v-if="localValue.length < knownLanguages.length"
        color="primary"
        size="small"
        class="ml-2"
        @click="showAddCommentPopup"
      >
        <v-icon>mdi-plus-thick</v-icon>
      </v-btn>
    </div>
    <div v-for="comment in localValue" class="mt-2">
      <v-textarea
        v-if="comment.language.name === activeLang"
        v-model="comment.value"
        :disabled="disabled"
        :readonly="!disabled && !editEnabled"
      >
        <template #append-inner>
          <v-icon
            v-if="!disabled && !editEnabled"
            :title="$t('btn.edit')"
            @click="editEnabled = true"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-else-if="!disabled"
            :title="$t('btn.confirm')"
            @click="editEnabled = false"

          >
            mdi-check-bold
          </v-icon>
          <v-icon
            v-if="!disabled"
            :title="$t('btn.delete')"
            @click="showDeleteConfirm"
          >
            mdi-close-thick
          </v-icon>
        </template>
      </v-textarea>
    </div>
    <v-card v-if="!activeLang" class="py-10 my-3">
      <v-card-text class="justify-center">
        <span>{{ $t('component.general.comment.notFound') }}</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import GokbAddCommentPopup from '@/shared/popups/gokb-add-comment-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import languageService from '@/shared/services/language-services'

  export default {
    name: 'GokbCommentsField',
    components: { GokbAddCommentPopup, GokbConfirmationPopup },
    emits: ['update:model-value', 'update'],
    props: {
      modelValue: {
        type: Array,
        required: true
      },
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        addCommentPopupVisible: false,
        showError: false,
        activeLang: undefined,
        editEnabled: false,
        knownLanguages: ['eng', 'ger'],
        currentLanguages: [],
        confirmDeleteVisible: false,
        confirmDeletionMessage: undefined
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
      },
      currentLocale () {
        return this.$i18n.locale
      }
    },
    watch: {
    },
    created () {
      this.selectActiveLang(this.currentLocale)

      this.currentLanguages = this.localValue.map(cmt => (cmt.language.name))
    },
    methods: {
      tempId () {
        return 'tempId' + Math.random().toString(36).substring(2, 5)
      },
      addNewComment (cmt) {
        if (this.localValue.some(item => (item.language.name == cmt.language.name))) {
          this.errorMessage = this.$i18n.t('component.comments.validation.list.duplicate')
          this.showError = true
        }
        else {
          this.localValue.push({
            id: this.tempId(),
            value: cmt.value,
            language: cmt.language,
            isDeletable: undefined,
            _pending: 'added'
          })

          this.currentLanguages.push(cmt.language.name)
        }

        this.selectActiveLang(cmt.language.name)

        this.$emit('update', 'comments')
      },
      selectActiveLang(lang) {
        let cmt_eng = this.localValue.filter(item => (item.language.name === 'eng')).length > 0
        let cmt_ger = this.localValue.filter(item => (item.language.name === 'ger')).length > 0

        if (lang === 'en') {
          this.activeLang = !!cmt_eng ? 'eng' : undefined
        }
        else if (lang === 'de') {
          this.activeLang = !!cmt_ger ? 'ger' : (!!cmt_eng ? 'eng' : undefined)
        }
        else {
          this.activeLang = this.localValue.filter(item => (item.language.name === lang)) ? lang : undefined
        }
      },
      showAddCommentPopup() {
        this.addCommentPopupVisible = true
      },
      showDeleteConfirm () {
        this.confirmDeletionMessage = {
          text: 'popups.confirm.deleteComment.label',
          vars: [languageService.getLanguage(this.activeLang, this.currentLocale)]
        }

        this.confirmDeleteVisible = true
      },
      deleteComment() {
        this.localValue = this.localValue.filter(v => v.language.name !== this.activeLang)
        this.selectActiveLang(this.currentLocale)
      }
    }
  }
</script>
