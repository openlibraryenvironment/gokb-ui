<script>
  import BaseSearch from './base-search-view'
  import account from '@/shared/models/account-model'
  import reviewServices from '@/shared/services/review-services'

  export default {
    name: 'SearchReview',
    extends: BaseSearch,
    data () {
      return {
        searchFilters: {
          curatoryGroupIds: [],
          identifierValue: undefined,
          componentToReview: undefined,
          status: undefined,
          name: undefined,
        },
        allStates: [
          { name: this.$i18n.t(), id: 'Open' },
          { name: this.$i18n.t(), id: 'Closed' }
        ]
      }
    },
    computed: {
      isCloseSelectedDisabled () {
        return this.isReadonly || !this.selectedItems.length || this.selectedItems.filter(item => (item.updateUrl === false)).length > 0
      },
      resultActionButtons () {
        return [
          {
            icon: 'mdi-close',
            label: this.$i18n.t('btn.close'),
            disabled: 'isCloseSelectedDisabled',
            action: '_confirmCloseSelectedItems',
          }
        ]
      },
      title () {
        return this.$i18n.tc('component.review.label', 2)
      },
      resultHeaders () {
        return [
          {
            text: this.$i18n.t('component.review.componentToReview.label'),
            align: 'left',
            sortable: true,
            value: 'popup'
          },
          {
            text: this.$i18n.t('component.review.type.label'),
            align: 'left',
            sortable: true,
            value: 'type'
          },
          {
            text: this.$i18n.tc('component.review.stdDesc.label'),
            align: 'left',
            sortable: true,
            value: 'localDesc'
          },
          {
            text: this.$i18n.t('component.general.dateCreated'),
            align: 'left',
            width: '150px',
            sortable: true,
            value: 'dateCreated'
          }
        ]
      },
      searchInputFields () {
        return [
          [
            {
              type: 'GokbTextField',
              name: 'cause',
              properties: {
                label: this.$i18n.t('component.review.cause.label')
              }
            },
            {
              type: 'GokbCuratoryGroupField',
              name: 'allocatedGroups',
              value: 'curatoryGroupIds',
              properties: {
                label: this.$i18n.tc('component.curatoryGroup.label'),
                width: '100%',
                returnObject: false
              }
            }
          ],
          [
            {
              type: 'GokbSearchEntityField',
              name: 'componentToReview',
              value: 'componentToReview',
              properties: {
                label: this.$i18n.t('component.review.componentToReview.label'),
              }
            },
            {
              type: 'GokbStateField',
              name: 'stdDesc',
              value: 'stdDesc',
              properties: {
                label: this.$i18n.tc('component.review.stdDesc.label'),
                messagePath: 'component.review.stdDesc',
                url: 'refdata/categories/ReviewRequest.StdDesc',
                width: '100%'
              }
            }
          ],
          [
            {
              type: 'GokbStateField',
              name: 'status',
              value: 'status',
              properties: {
                label: this.$i18n.t('component.general.status.label'),
                initItem: this.$i18n.t('component.review.status.Open.label'),
                messagePath: 'component.review.status',
                url: 'refdata/categories/ReviewRequest.Status',
                width: '100%'
              }
            }
          ]
        ]
      },
      isContributor () {
        return account.loggedIn() && account.hasRole('ROLE_CONTRIBUTOR')
      }
    },
    watch: {
      isContributor (acc) {
        if (acc) {
          this.accessible = true
        } else {
          this.accessible = false
        }
      }
    },
    created () {
      this.component = 'g:reviewRequests'
      this.searchServicesUrl = 'rest/reviews'
      this.linkValue = 'componentToReview'
      this.staticParams = { titlereviews: true }
      this.initVals = {
        status: 'setInit'
      }
      this.linkSearchParameterValues = {
        popup: 'componentToReview',
        localDesc: 'stdDesc'
      }

      if (!this.isContributor) {
        this.accessible = false
      }
    },
    methods: {
      _transformForTable (data) {
        const componentRoutes = {
          package: '/package',
          org: '/provider',
          title: '/title',
          journal: '/title',
          book: '/title',
          database: '/title'
        }

        return data.map(({ id, reviewRequest, dateCreated, _embedded: { allocatedGroups }, componentToReview, descriptionOfCause, status, stdDesc, _links }) => ({
          id,
          component: componentToReview,
          componentId: componentToReview.id,
          type: this.$i18n.tc('component.' + componentToReview.type.toLowerCase() + '.label'),
          dateCreated: new Date(dateCreated).toISOString().substr(0, 10),
          allocatedGroups,
          request: reviewRequest,
          description: descriptionOfCause,
          status,
          stdDesc,
          localDesc: stdDesc?.name ? this.$i18n.tc('component.review.stdDesc.' + stdDesc.name + '.label') : undefined,
          popup: { value: (componentToReview.name || componentToReview.type + ' ' + componentToReview.id), label: 'review', type: 'GokbAddReviewPopup' },
          link: { value: componentToReview.name, route: componentRoutes[componentToReview.type.toLowerCase()], id: 'componentId' },
          updateUrl: _links?.update?.href,
          deleteUrl: _links?.delete?.href
        }))
      },
      _confirmCloseSelectedItems () {
        this.actionToConfirm = '_closeSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.close.list', vars: [this.selectedItems.length, this.$i18n.tc('component.review.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      async _closeSelectedItems () {
        await Promise.all(this.selectedItems.map(({ id }) =>
          this.catchError({
            promise: reviewServices.closeReview(id, this.cancelToken.token),
            instance: this
          })
        ))
        this.resultPaginate(this.resultOptions.page)
      }
    }
  }
</script>
