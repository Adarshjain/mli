<template>
  <div>
    <div class="is-flex is-justify-content-space-between px-3 flex-wrap">
      <h1 class="is-size-3">{{customer.name}}'s Projects</h1>
      <router-link :to="`/customers/${customer.id}/projects/new`">
        <b-button>New Project</b-button>
      </router-link>
    </div>
    <b-table
        :data="data"
        :hoverable="true"
        :narrowed="true"
        :searcheable="true"
        :striped="true"
    >
      <template v-for="column in columns">
        <b-table-column :key="column.id" v-bind="column">
          <template v-if="column.searchable && !column.numeric" #searchable="props">
            <b-input
                v-model="props.filters[props.column.field]"
                icon="magnify"
                placeholder="Search..."
                size="is-small"
            />
          </template>
          <template v-slot="props">
            <span style="font-variant-numeric: tabular-nums;">
              {{ props.row[column.field] }}
            </span>
          </template>
        </b-table-column>
      </template>
      <b-table-column v-slot="props" label="Transactions">
        <router-link :to="`/customers/${customer.id}/projects/${props.row.id}`">View</router-link>
      </b-table-column>
    </b-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {formatDateFromSQLFormat} from "@/helpers";
import {execQuery, getCustomerByIdQuery, getProjectsByCustomerIdQuery} from "@/queries";

@Component({
  name: 'ProjectsByCustomer'
})
export default class ProjectsByCustomer extends Vue {
  customer: any = '';
  data: any[] = [];
  columns = [
    {
      field: 'name',
      label: 'Name',
      searchable: true
    },
    {
      field: 'specification',
      label: 'Specification',
      searchable: true
    },
    {
      field: 'project_date',
      label: 'Project Date'
    },
    {
      field: 'deliver_date',
      label: 'Deliver Date'
    },
    {
      field: 'amount',
      label: 'Project Value',
      numeric: true
    }
  ];

  async mounted() {
    const [customer] = await execQuery(getCustomerByIdQuery(this.$route.params.id))
    let projects = await execQuery(getProjectsByCustomerIdQuery(this.$route.params.id))
    projects = projects.map(d => {
      d.amount = d.amount.toLocaleString('en-IN', {minimumFractionDigits: 2});
      d.project_date = formatDateFromSQLFormat(d.project_date);
      d.deliver_date = formatDateFromSQLFormat(d.deliver_date);
      return d;
    })
    this.customer = customer;
    this.data = projects;
  }
}
</script>
