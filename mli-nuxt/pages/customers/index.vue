<template>
  <div class="p-3">
    <div class="is-flex is-justify-content-space-between">
      <h1 class="is-size-3">Customers</h1>
      <NuxtLink to="/customers/new">
        <b-button>New Customer</b-button>
      </NuxtLink>
    </div>
    <div
      v-for="customer in customers"
      :key="customer.id"
      class="box p-2 pt-1 mb-2"
    >
      <div class="is-size-5">{{ customer.name }}</div>
      <div class="is-size-6">{{ customer.company }}</div>
      <div>
        <a :href="`tel:${customer.phone}`" class="is-size-6">{{ customer.phone }}</a>
      </div>
      <NuxtLink
        :to="`/customers/${customer.id}/projects`"
      >
        <b-button>Projects</b-button>
      </NuxtLink>
      <NuxtLink
        :to="`/customers/${customer.id}`"
      >
        <b-button>All transactions</b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {tableNames} from "~/constants/constants";

@Component({
  name: 'HomeView'
})
export default class Customers extends Vue {
  async asyncData({$axios}) {
    return {customers: await $axios.$get(`/api/${tableNames.customers}`)};
  }
}
</script>
