<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'

  const NO_MAINTENANCE_CYCLE = 'no-maintenance-cycle'
  const MONTHLY_MAINTENANCE_CYCLE = 'monthly-maintenance-cycle'
  const QUARTER_MAINTENANCE_CYCLE = 'quarter-maintenance-cycle'
  const HALF_YEARLY_MAINTENANCE_CYCLE = 'half-yearly-maintenance-cycle'
  const YEARLY_MAINTENANCE_CYCLE = 'yearly-maintenance-cycle'

  export default {
    name: 'GokbMaintenanceCycleField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Turnus',
      }
    },
    created () {
      this.items = [
        {
          id: NO_MAINTENANCE_CYCLE,
          name: 'Kein Turnus',
          createMaintenanceDate: fromDate => undefined
        },
        {
          id: MONTHLY_MAINTENANCE_CYCLE,
          name: 'Monatlich',
          createMaintenanceDate: fromDate => new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate())
        },
        {
          id: QUARTER_MAINTENANCE_CYCLE,
          name: 'Quartalsweise',
          createMaintenanceDate: fromDate => new Date(fromDate.getFullYear(), fromDate.getMonth() + 3, fromDate.getDate())
        },
        {
          id: HALF_YEARLY_MAINTENANCE_CYCLE,
          name: 'Halbjährlich',
          createMaintenanceDate: fromDate => new Date(fromDate.getFullYear(), fromDate.getMonth() + 6, fromDate.getDate())
        },
        {
          id: YEARLY_MAINTENANCE_CYCLE,
          name: 'Jährlich',
          createMaintenanceDate: fromDate => new Date(fromDate.getFullYear() + 1, fromDate.getMonth(), fromDate.getDate())
        },
      ]
    }
  }
</script>
