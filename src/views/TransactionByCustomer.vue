<template>
  <div class="p-3">
    <div class="is-size-4 has-text-centered">Balance:
      Rs.{{ balance.toLocaleString('en-IN', {minimumFractionDigits: 2}) }}
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
                size="is-small"/>
          </template>
          <template v-slot="props">
            <router-link v-if="column.field === 'project_name'"
                      :to="`${$route.params.id}/projects/${props.row['project_id']}`">
              {{ props.row[column.field] }}
            </router-link>
            <span v-else style="font-variant-numeric: tabular-nums;">
              {{ props.row[column.field] }}
            </span>
          </template>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {formatDateFromSQLFormat} from "@/helpers";
import {execQuery, getProjectByIdQuery, getTransactionByCustomerIdQuery} from "@/queries";

@Component({
  name: 'TransactionPerCustomer'
})
export default class TransactionPerCustomer extends Vue {
  columns: any = [
    {
      field: 'transact_date',
      label: 'Date'
    },
    {
      field: 'narration',
      label: 'Narration',
      searchable: true
    },
    {
      field: 'project_name',
      label: 'Project Name',
      searchable: true
    },
    {
      field: 'credit_amount',
      label: 'Credit',
      numeric: true
    },
    {
      field: 'debit_amount',
      label: 'Debit',
      numeric: true
    },
  ]
  data: any[] = [];
  balance = 0;


  async mounted() {
    const transactions = await execQuery(getTransactionByCustomerIdQuery(this.$route.params.id))

    let balance = 0;
    const data = await Promise.all(transactions.map(async t => {
      t.transact_date = formatDateFromSQLFormat(t.transact_date)
      if (t.project_id) {
        const transactions = await execQuery(getProjectByIdQuery(t.project_id))
        const [{name}] = transactions
        t.project_name = name;
      }
      if (t.credit_amount) {
        balance += t.credit_amount;
        t.credit_amount = t.credit_amount.toLocaleString('en-IN', {minimumFractionDigits: 2});
      }
      if (t.debit_amount) {
        balance -= t.debit_amount;
        t.debit_amount = t.debit_amount.toLocaleString('en-IN', {minimumFractionDigits: 2});
      }
      return t
    }))
    this.data = data;
    this.balance = balance;
  }
}
</script>
