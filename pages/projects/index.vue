<template>
  <div>
    <h1 class="is-size-3">Projects</h1>
    <NuxtLink to="/projects/new">
      <b-button>New Project</b-button>
    </NuxtLink>
    <b-table
      :bordered="true"
      :columns="columns"
      :data="data"
      :hoverable="true"
      :narrowed="true"
      :striped="true"
    />
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
    const resp = await $axios.$get(`/api/${tableNames.projects}`)
    const headers = [
      'name',
      'customer_id',
      'specification',
      'amount',
      'project_date',
      'deliver_date',
    ].map(field => ({
      field,
      label: field.split('_').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')
    }))
    return {
      columns: headers,
      data: resp
    }
  }
}
</script>
