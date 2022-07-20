<template>
<div class="modal fade" id="AuthenticationModal" tabindex="-1" aria-labelledby="AuthenticationModalLabel" data-bs-backdrop="static" data-bs-keyboard="false"  aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
            <h5 class="modal-title pe-3" id="AuthenticationModalLabel"> احراز هویت </h5>
          </div>
          <div v-if="isSending" style="margin-bottom: 200px; margin-top: 200px">
            <i class="fad fa-circle-notch fa-spin text-green mt-5" style="font-size: 400%"></i>
            <h4 class="mt-3 text-success">درحال ارسال</h4>
          </div>
          <div v-else class="modal-body p-0">
            <i v-if="loading" class="fad fa-circle-notch fa-spin text-green mt-5" style="font-size: 400%"></i>
            <div v-else class="mt-3">
              <span> وضعیت احراز هویت شما: </span>
              <strong v-if="is_authenticated" class="text-success text-decoration-underline"> احراز هویت شده </strong>
              <strong v-if="is_waiting" class="text-success text-decoration-underline"> در انتظار تایید </strong>
              <button v-if="is_waiting" @click="enableForm" class="btn btn-outline-dark"> تغییر اطلاعات </button>
              <strong v-if="!is_waiting && !is_authenticated " class="text-danger text-decoration-underline"> احراز هویت نشده </strong>
            </div>

            <div>
              <div class="row m-0 pb-5 gx-5 gy-4" dir="rtl" >
              <hr>

                <div class="col-12 col-lg-6 text-end">
                  <label class="form-label" for="name"> نام و نام خانوادگی <span class="text-danger">*</span> </label>
                  <input type="text" id="name" v-model.lazy.trim="managerForm.full_name" :disabled="disableForm" class="form-control shadow">
                </div>

                <div class="col-12 col-lg-6 text-end">
                  <label class="form-label" for="idCode"> کدملی <span class="text-danger">*</span> </label>
                  <input type="text" id="idCode" v-model.lazy.trim="managerForm.id_number" :disabled="disableForm" class="form-control shadow" maxlength="10">
                </div>

                <div class="col-12 col-lg-6 text-end">
                  <label class="form-label" for="comapnyName"> نام شرکت <span class="text-danger">*</span> </label>
                  <input type="text" id="comapnyName" v-model.lazy.trim="managerForm.company_name" :disabled="disableForm" class="form-control shadow">
                </div>


                <div class="col-12 col-lg-6 text-end">
                  <label class="form-label" for="companyAddress1"> آدرس محل شرکت حمل و نقل <span class="text-danger">*</span> </label>
                  <input type="text" id="companyAddress1" v-model.lazy.trim="managerForm.company_address" :disabled="disableForm" class="form-control shadow">
                </div>

                <hr>
                <div class="col-12 col-lg-6 text-end">
                  <label class="form-label" for="managerIdCardPic">  عکس کارت ملی <span class="text-danger">*</span> <button class="btn p-1 btn-outline-danger" v-if="pic3 && !is_authenticated && !disableForm" @click="removePic(3)"> تغییر عکس </button> </label>
                  <div class="border shadow position-relative">
                    <img v-if="pic3" :src="pic3" class="w-100">
                    <input v-show="!pic3" type="file" :disabled="disableForm" @change="ChangePicInput(3, $event)" id="managerIdCardPic" class="py-5 w-100 opacity-0 cursor-pointer position-relative" style="font-size: 1%; z-index: 2">
                    <span v-if="!pic3" class="position-absolute fs-2" style="top: 25%; left: 45%;"> <i class="fad fa-cloud-upload" style="color: #42b983"></i> </span>
                  </div>
                  <span v-if="!pic3" class="text-danger me-2"> حداکثر حجم عکس 2MB </span>
                </div>


                <div class="col-12 col-lg-6 text-end">
                  <label class="form-label" for="description1"> توضیحات </label>
                  <textarea id="description1" :disabled="disableForm"  class="form-control shadow p-2" rows="3"></textarea>
                </div>

              </div>

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn w-100 text-light py-2 shadow" style="background-color: #42b983" @click="submitAuthenticate" :disabled="disableForm"> ثبت </button>
          </div>

        </div>
      </div>
    </div>
  




</template>

<script>
import axios from 'axios'
import { reactive, ref } from '@vue/reactivity'
import Swal from 'sweetalert2'
import { watch } from '@vue/runtime-core'
export default {
  props: ['open'],
  setup(props){

    const localAuth = localStorage.getItem('isAuthenticated')
    const isAuthenticated = (localAuth === 'true')
    const loading = ref(false)
    const isSending = ref(false)
    const is_waiting = ref(false)
    const is_authenticated = ref(false)
    let pic1 = ref()
    let pic2 = ref()
    let pic3 = ref()

    const disableForm = ref(false)

    watch(()=> props.open, () =>{
      run()
    })

    function run(){
      loading.value = true
      axios
      .post('/CheckAuthenticate/').then((res)=>{

        if(!res.data){
          loading.value = false
          return
        }

      
        managerForm.full_name = res.data.name
        managerForm.id_number = res.data.id_number
        managerForm.company_name = res.data.company_name
        managerForm.company_address = res.data.company_address
        pic3.value = res.data.id_card_picture
        is_waiting.value = res.data.is_waiting
        is_authenticated.value = res.data.is_authentication
        disableForm.value = true
        

        loading.value = false
      }).catch(()=>{
        loading.value = false
      })
    }

    const managerForm = reactive({
      full_name  : '',
      id_number : '',
      company_name : '',
      company_address : '',
    })

    function submitAuthenticate(){
      var formData = new FormData();
      var managerIdCardPic
      managerIdCardPic = document.querySelector('#managerIdCardPic')
      formData.append('full_name', managerForm.full_name)
      formData.append('id_number', managerForm.id_number)
      formData.append('company_name', managerForm.company_name)
      formData.append('company_address', managerForm.company_address)
      formData.append('id_card_picture', managerIdCardPic.files[0])
      isSending.value = true
      
      axios
      .post('/Authenticate/', formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
      }
      })
      .then(()=>{
        isSending.value = false
        Swal.fire('فرم احراز هویت شما ثبت شد', 'به محض چک شدن اطلاعات شما توسط تیم پشتیبانی پیامک تایید احراز هویت به شماره شما ارسال میشود.', 'success')
      }).catch(()=>{
        isSending.value = false
      })
    }

    function enableForm(){
      disableForm.value = false
    }

    function ChangePicInput(num, e){
      let file = e.target.files[0]
      let url = URL.createObjectURL(file)
      if(num == 1){
        pic1.value = url
      }else if(num == 2){
        pic2.value = url
      }else if(num ==3){
        pic3.value = url
      }
    }

    function removePic(num){
      if(num == 1){
        pic1.value = ''
      }
      if(num == 2){
        pic2.value = ''
      }
      if(num == 3){
        pic3.value = ''
      }
    }


    return{isAuthenticated, submitAuthenticate, managerForm, loading, is_waiting, is_authenticated, pic1, pic2, pic3, disableForm, enableForm,
    ChangePicInput, removePic, isSending
    }
  }
}
</script>

<style>
.cursor-pointer{
  cursor: pointer !important;
}
</style>