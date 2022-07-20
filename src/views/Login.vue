<template>
    <div class="row m-0 bg-light" id="numberContainer" style="height: 100vh;">
        <div></div>
        <div><div class=""><h3> به <img src="../zibar.png" width="50"> خوش آمدید </h3></div></div>
        <div>
        
            <label for="phoneNum"> لطفا شماره همراه خود را وارد کنید </label>
            <div class="my-3 w-100 mx-auto">
                <div class="input-group">
                    <span class="input-group-text p-1 bg-green"><img src="../icons/mobile.svg" width="20" alt="test"></span>
                    <input v-model="phoneNumber" type="tel" id="phoneNum" class="form-control border-green border-2 text-center" maxlength="11">
                </div>
            </div>

            <div data-bs-toggle="modal" data-bs-target="#rulesModal" class="text-primary btn"> قوانین و شرایط استفاده را میپذیرم</div>
            <input v-model="acceptRules" type="checkbox">
            <br>
            <button :disabled='disable | loading' @click="submitNumber" class="btn btn-success mt-4 p-2 w-100" type="submit"><Loading v-if="loading" color="#fff" class="d-inline" style="width: 40px"/> تایید شماره تلفن</button>

        </div>
        <div></div>    
    </div>

    <div class="d-flex align-items-center d-none" id="smsContainer" style="min-height: 100vh;">
        <div class="col-12">
            <p> کد ارسالی به شماره {{ phoneNumber }} را وارد کنید </p>
            <button @click="backToPhone" class="border-0 bg-transparent text-primary"> تغییر شماره همراه </button>
            <br>
            <div class="row m-0">
                <form @submit.prevent class="col-10 mx-auto mt-5">
                    <input type="tel" v-model="smsCode" class="form-control text-center" inputmode="numeric" maxlength="4">
                    <button type="reset" :disabled='!reSend' @click="submitNumber" class="mt-3 mb-4 py-0 btn btn-primary"> ارسال مجدد </button> | <span> {{ time }} ثانیه</span>
                    <br>
                    <button type="submit" :disabled='smsDisable | loading' @click="submitSMS" class="btn btn-success mt-4 w-100"><Loading v-if="loading" color="#fff" class="d-inline" style="width: 40px"/> تایید کد ارسالی</button>
                </form>
            </div>
        </div>

  </div>

    <div class="modal fade" id="rulesModal" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">قوانین استفاده از زیبار</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Rules/>  
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success bg-green text-light w-100" @click="acceptRules = true" data-bs-dismiss="modal">قوانین و شرایط استفاده را میپذیرم</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted, ref, watch } from 'vue'
import Rules from './Rules.vue'
import Loading from './Loading.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import router from '@/router';

export default {
    setup() {
        onMounted(() => {
            document.getElementById("nav").classList.remove('d-flex')
            document.getElementById("nav").classList.add('d-none')
        })
        
        let phoneNumber = ref("");
        let disable = ref(true);
        let smsDisable = ref(true);
        let acceptRules = ref(false);
        let loading = ref(false)
        let time = ref()
        let reSend = ref(false)
        let smsCode = ref()

        watch([phoneNumber, acceptRules], ()=>{checkNumberDisable()})
        watch([smsCode], ()=>{checkSMSDisable()})

    
        function checkNumberDisable(){
            if(phoneNumber.value.length == 11 & acceptRules.value == true){
                disable.value = false
            }else{
                disable.value = true
            }
        }
        
        function submitNumber(){
            loading.value = true
            phoneNumber.value = fixDigits(phoneNumber.value)
            if(phoneNumber.value.length == 11 & acceptRules.value == true && isNaN(phoneNumber.value) == false){
                axios
                .post('/GetOTP/', {
                phone_number: phoneNumber.value
                },{
                headers:{
                    Authorization: ''
                }
                })
                .then(()=>{
                    loading.value = false
                    document.getElementById('numberContainer').style.display = 'none'
                    document.getElementById('smsContainer').classList.remove('d-none')
                    reSend.value = false
                    time.value = 120
                    timer()
                })
                .catch((res)=>{
                loading.value = false
                if(res.response.status == 406){

                    let timerInterval
                    Swal.fire({
                    title: res.response.data.status,
                    html: 'زمان باقی مانده <b></b> ثانیه',
                    timer: res.response.data.time_remaining,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                        b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                    })
                }
                })
                
            }else{
                Swal.fire('شماره تلفن به درستی وارد نشده یا قوانین را نپذیرفتید', '', 'warning')
            }
        }

        function fixDigits(num){
            let persianNumbers = '۰۱۲۳۴۵۶۷۸۹'
            let fixed = ''
            for (let i = 0; i < num.length; i++) {
                let digit = num[i]
                if(persianNumbers.indexOf(digit) > -1){
                    fixed += persianNumbers.indexOf(digit)
                }else{
                    fixed += digit
                }
            }
            return fixed
        }

        function timer(){
            if(time.value > 0){
                setTimeout(() => {
                time.value -= 1
                timer()
                }, 1000);
            }else if(time.value == 0){
                reSend.value = true
            }
            else {
                reSend.value = false
                time.value = 10
            }
        }

        function checkSMSDisable(){
            if(smsCode.value.length == 4){
                smsDisable.value = false
            } else{
                smsDisable.value = true
            }
        }

        function submitSMS(){
            loading.value = true
            smsCode.value = fixDigits(smsCode.value)
            if(smsCode.value.length == 4 & isNaN(smsCode.value) == false){
                loading.value = true
                axios.post('/Register/', {
                phone_number: phoneNumber.value,
                OTP: smsCode.value
                },{
                headers:{
                    Authorization: ''
                }
                })
                .then((res)=>{

                    localStorage.setItem("access", res.data.access)
                    localStorage.setItem("refresh", res.data.refresh)
                    localStorage.setItem('name', res.data.name)
                    localStorage.setItem('phoneNumber', res.data.phone_number)
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access');
                    
                    if(res.data.first_time == true){
                        axios.post('/SubmitPosition/', {position: 'manager'})
                        localStorage.setItem('isAuthenticated', false)
                        loading.value = false
                        document.getElementById("nav").classList.remove('d-none')
                        document.getElementById("nav").classList.add('d-flex')
                        router.push('/profile')
                        
                    }else{
                        if(res.data.position == "driver"){
                            loading.value = false
                            Swal.fire({
                                title: 'شماره شما قبلا بعنوان راننده ثبت شده', 
                                text: 'شما باید از اپلیکیشن مخصوص رانندگان استفاده کنید یا درصورت نیاز به تغییر موقعیت شغلی به پشتیبانی زیبار پیام بدهید.', 
                                icon: 'warning',
                                footer: '<a class="text-decoration-none" href="https://t.me/zibar_admin">  پیام به پشتیبانی <i class="fab fa-telegram ps-2"></i> </a>'
                            })
                            localStorage.clear()
                            return
                        }
                        localStorage.setItem('isAuthenticated', res.data.isAuthenticated)
                        loading.value = false
                        document.getElementById("nav").classList.remove('d-none')
                        document.getElementById("nav").classList.add('d-flex')
                        router.push('/profile')
                    }
                })
                .catch(()=>{
                    loading.value = false
                })

            }else{
                Swal.fire('کد چهاررقمی را به عدد وارد کنید', '', 'warning')
            }
        }
        function backToPhone(){
            document.getElementById('numberContainer').style.display = 'flex'
            document.getElementById('smsContainer').classList.add('d-none')
            time.value = ''
            }

        return { phoneNumber, disable, acceptRules, loading, submitNumber, smsDisable, smsCode, reSend, time, submitSMS, backToPhone};
    },
    components: { Rules, Loading }
}
</script>

<style>
    
</style>