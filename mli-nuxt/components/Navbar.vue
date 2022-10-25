<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="/img.png">
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  name: 'Navbar'
})
export default class Navbar extends Vue {

}
</script>
