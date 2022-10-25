<template>
  <div class="p-3">
    <div class="is-size-4 has-text-centered">Balance: Rs.{{balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}}</div>
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
            <span style="font-variant-numeric: tabular-nums;">
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
import {tableNames} from "~/constants/constants";
import {formatDateFromSQLFormat} from "~/helpers";

@Component({
  name: 'TransactionPerCustomerPerProject'
})
export default class TransactionPerCustomerPerProject extends Vue {
  async asyncData({params, $axios}) {
    let transactions = await $axios.$get(`/api/${tableNames.customers}/${params.customer_id}/${tableNames.transactions}/${params.project_id}`);
    const headers: any = [
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
    let balance = 0;
    const data = await Promise.all(transactions.map(async t => {
      t.transact_date = formatDateFromSQLFormat(t.transact_date)
      if (t.project_id) {
        const [{name}] = await $axios.$get(`/api/${tableNames.projects}/${t.project_id}`);
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
      return t;
    }))
    return {
      columns: headers,
      data,
      balance
    }
  }
}
</script>
