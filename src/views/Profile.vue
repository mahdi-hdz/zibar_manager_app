<template>
  <div style="min-height: 100vh;">
    <div class="profile-header">
      <span><i class="fa-duotone fa-user-circle text-light mt-5" style="font-size: 5rem;"></i></span>
        <div dir="rtl" class="fs-5 text-light fw-bold pt-2 pb-5" style="text-shadow: 1px 1px 1px black"> {{ name }} <i v-if="isAuthenticated == 'true'" class="fa fa-check-circle text-primary" title="احراز هویت شده"></i> </div>
        <div class="credit-gradient fs-6 py-3" dir="rtl"> <i class="fa-duotone fa-coins"></i> اعتبار شما:   <span> ۰ </span> تومان </div>
    </div>
    <div id="profileMenu" class="mx-0 row">
        <button @click="openAuthenticationPage = !openAuthenticationPage" data-bs-toggle="modal" data-bs-target="#AuthenticationModal" class="btn btn-lg py-3  border"> احراز هویت <i class="fa-duotone fa-id-card ps-2"></i> </button>
        <button data-bs-toggle="modal" data-bs-target="#shareModal" class="btn btn-lg py-3  border">  معرفی به دوستان <i class="fa-duotone fa-users ps-2"></i></button>
        <button data-bs-toggle="modal" data-bs-target="#PayMentModal" class="btn btn-lg py-3  border">  افزایش موجودی <i class="fa-duotone fa-credit-card ps-2"></i> </button>
        <button data-bs-toggle="modal" data-bs-target="#rulesModal" class="btn btn-lg py-3  border">  قوانین استفاده از سامانه<i class="fa-duotone fa-balance-scale ps-2"></i> </button>
        <button data-bs-toggle="modal" data-bs-target="#FAQModal" class="btn btn-lg py-3  border">  سوالات متداول  <i class="fa-duotone fa-question-circle"></i> </button>
        <button @click="exitFromAccount" class="btn btn-lg btn-danger my-1"> خروج از حساب کاربری <i class="fa-duotone fa-sign-out ps-2"></i> </button>

    </div>

    <!-- ==================== Authentication ===================== -->

      <authentication :open="openAuthenticationPage" />

    <!-- ==================== Share ===================== -->

    <div class="modal fade" id="shareModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
            <h5 class="modal-title pe-3" id="shareModalLabel"> معرفی به دوستان </h5>
          </div>

          <div class="modal-body p-0">
            <Share/>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn w-100 text-light py-2 shadow" style="background-color: #42b983" data-bs-dismiss="modal"> دعوت از دوستان </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ==================== PayMent =================== -->

    <div class="modal fade" id="PayMentModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
            <h5 class="modal-title pe-3" id="PayMentModalLabel"> افزایش موجودی </h5>
          </div>

          <div class="modal-body p-0">
            <pay-ment/>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn w-100 text-light py-2 shadow" style="background-color: #42b983" data-bs-dismiss="modal"> متوجه شدم </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ==================== FAQ ===================== -->

    <div class="modal fade" id="FAQModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
            <h5 class="modal-title pe-3" id="rulesModalLabel"> سوالات متداول </h5>
          </div>

          <div class="modal-body">
            <FAQ/>
          </div>

        </div>
      </div>
    </div>

    <!-- ==================== Rules ===================== -->

    <div class="modal fade" id="rulesModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
            <h5 class="modal-title pe-3" id="rulesModalLabel"> قوانین استفاده از سامانه </h5>
          </div>

          <div class="modal-body">
            <Rules/>
          </div>

        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import Authentication from './profile components/Authentication.vue'
import Share from './profile components/Share.vue'
import Rules from './profile components/Rules.vue'
import PayMent from './profile components/PayMent.vue'
import router from '../router/index.js'
import FAQ from './profile components/FAQ.vue'
import Swal from 'sweetalert2'

export default {
  components: { 
    Authentication,
    Share,
    Rules,
    PayMent,
    FAQ
  },
  setup() {
    
    const openAuthenticationPage = ref(false)

    const name = localStorage.getItem('name')
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    

  function exitFromAccount(){
    Swal.fire({
      title: 'از حساب کاربردی خود خارج میشوید؟',
      showDenyButton: true,
      confirmButtonText: 'بله',
      denyButtonText: `خیر`,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear()
          router.replace('/login')
      }
    })
          
      }
  return{exitFromAccount, name, isAuthenticated, openAuthenticationPage}
}
}
</script>

<style>
a>div:hover{
  background: rgb(209, 208, 208) !important;
  transition: background 100ms linear;
}

button>div:hover{
  background: rgb(209, 208, 208) !important;
  transition: background 100ms linear;
}

.text-green{
  color: #42b983 !important;
}

.profile-header{
 background: rgb(66,185,131);
background: linear-gradient(43deg, rgba(66,185,131,1) 50%, rgba(69,185,66,1) 100%); 
}
.credit-gradient{
  background: rgb(251,255,7);
  background: linear-gradient(43deg, rgba(251,230,7,1) 0%, rgba(255,193,7,1) 50%); 
}
 </style>