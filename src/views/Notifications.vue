<template>
  <div class="bg-lightGray rounded-3" style="min-height: 100vh;">
    <Loading v-if="loading" style="width: 100px; padding-top: 50px;" color="#42b983"/>
    <div v-else>
      
      <div class="pt-4">
          <div class="position-relative">
            <span class="rounded-circle ms-4 mt-1 p-2 bg-success position-absolute"></span>
            <div class="me-5">خبر خوب</div>
            
            <span class="rounded-circle ms-4 mt-1 p-2 bg-info position-absolute"></span>
            <div class="me-5">جهت اطلاع</div>

            <span class="rounded-circle ms-4 mt-1 p-2 bg-warning position-absolute"></span>
            <div class="me-5">هشدار</div>

            <span class="rounded-circle ms-4 mt-1 p-2 bg-danger position-absolute"></span>
            <div class="me-5">فوری</div>
          </div>
      </div>
      <hr>
      <h3 v-if="!notifData[0]"> اطلاعیه ای وجود ندارد </h3>
      <div :class="'position-relative bg-light p-3 border border-2 rounded my-5 hover-shadow border-'+notif.color" v-for="(notif, index) in notifData" :key="index">
          <span :class="'position-absolute top-25 start-0 ms-4 text-dark rounded-circle p-2 bg-'+ notif.color"> </span>
          <strong dir="rtl"> {{ notif.title }} </strong>
          <hr :class="'pb-1 text-'+notif.color">
          <p dir="rtl" v-html="notif.description" class="py-3"></p>
          <hr :class="'pb-1 text-'+notif.color">
          <small class="text-muted"> {{ notif.date }} </small>
      </div>  
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import axios from 'axios'
import Loading from './Loading.vue';
export default {
    setup() {
        let loading = ref(true);
        let notifData = ref([]);
        function getNotifications() {
            axios
                .post("/GetMyNotification/", {
                token: localStorage.getItem("access")
            })
                .then((res) => {
                notifData.value = res.data.data;
                loading.value = false;
            }).catch(() => {
                loading.value = false;
            });
        }
        getNotifications();
        return { loading, notifData };
    },
    components: { Loading }
}
</script>

<style>

</style>