import Vue from 'vue';
import { SharedElementDirective, NuxtSharedElementRouteGuard } from 'v-shared-element';

Vue.use(SharedElementDirective, <%= serialize(options) %>);

export default NuxtSharedElementRouteGuard;
