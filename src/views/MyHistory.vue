<template>
    <div class="py-1 text-green h5 border-bottom border-green d-inline-block px-5"> سوابق اعلام بار </div>

    <div v-if="floatLoading" class="w-100 position-fixed" style="height: 100vh; background-color: rgba(0,0,0,.5);">
        <Loading style="width: 100px;top: 45%; left:50%;transform: translateX(-50%);" color="#fff" class="position-fixed"/>
    </div>
    <div style="min-height: 100vh; padding: 20px 0 50px 0;" class="bg-lightGray">
        <Loading v-if="firstLoading" style="width: 100px; padding-top: 50px;" color="#42b983"/>
        <div v-else>
            <h2 class="py-3" v-if="data == ''"> باری جهت نمایش وجود ندارد </h2>
            <div v-for="(bar, index) in data" :key="index" class="border rounded mx-1 pt-2 mb-2"  style="background-color: #fff">
            <div dir="rtl" class="pb-2 mb-2">
                <small>وضعیت بار:</small>
                <strong v-if="bar.isPast" class="text-warning px-2 py-1 rounded">رد شده</strong>
                <strong v-else-if="bar.isCanceled" class="text-danger px-2 py-1 rounded">لغو شده</strong>
                <strong v-else-if="!bar.isPast" class="text-green px-2 py-1 rounded">جاری</strong>
            </div>
                
                

            <small v-if="bar.distance" class="rounded border border-green text-green px-1" title="مسافت ها بر اساس دیتا نقشه نشان بضورت مناسبترین مسافت جاده ای محاسبه شده">{{bar.distance}}</small>

            <div class="d-flex py-3" dir="rtl">
                <div class="w-50">
                    <strong>{{bar.beginning.split("،")[1]}}</strong>
                    <br>
                    <small>{{bar.beginning.split("،")[0]}}</small>
                </div>

                <i class="fa fa-long-arrow-left palign-self-center pt-1 mt-2"></i>

                <div class="w-50">
                    <strong>{{bar.destination.split("،")[1]}}</strong>
                    <br>
                    <small>{{bar.destination.split("،")[0]}}</small>
                </div>
            </div>

            <hr class="w-75 m-auto"/>

            <div dir="rtl" class="mt-4">
                <span><i class="fal fa-money-bill-1"></i> کرایه: </span>
                <b>{{bar.price}}</b>
            </div>

            <br> 

            <div dir="rtl">
                <span><i class="fal fa-truck"></i> نوع ناوگان: </span>
                <strong dir="ltr">
                    <span v-for="(values, name) in bar.fleet_type" :key="name">
                        <div class="mb-3 p-1" v-if="values[0]">
                            <div class="p-2 text-success d-inline-block">{{name}}</div>
                            <hr class="m-1">
                            <div class="" dir="rtl">
                                <span> {{ values.slice(0,3).join(' | ') }} <span v-if="values[3]">و...</span> </span>
                            </div>
                        </div> 
                    </span> 
                </strong>
            </div>
            <div class="mt-2 py-2 border rounded">
                <div v-if="bar.acceptData[0]">
                    <button class="btn btn-warning dropdown-toggle w-75 mb-2" data-bs-toggle="collapse" :data-bs-target="'#acceptedDriver'+index">
                        متقاضیان بار
                    </button>
                    <div class="collapse pt-5" :id="'acceptedDriver'+index">
                        <div v-for="(b, index) in bar.acceptData" :key="index" class="p-3">
                            <div dir="rtl" class="text-end">  نام: <strong> {{ b.driver_name }} <i class="fa fa-check-circle text-primary"></i> </strong> </div>
                            <div dir="rtl" class="text-end"> شماره تماس: <strong> {{ b.driver_number }} </strong> </div>
                            <div dir="rtl" class="text-end"> زمان پذیرش بار: <strong> {{ b.acceptDate }} </strong> </div>
                            <hr>
                        </div>
                    </div>
                </div>
                <button @click="Rebar(bar.barId)" data-bs-toggle="modal" data-bs-target="#dateModal" class="btn btn-primary mx-2"> ثبت مجدد </button>
                <button @click="Info(bar.barId)" class="btn btn-success mx-2">جزییات بیشتر</button>
                <button @click="RemoveBar(bar.barId)" v-if="bar.isPast || bar.isCanceled" class="btn btn-danger mx-2"> حذف از تاریخچه </button>
                <button @click="Cancel(bar.barId)" v-else-if="!bar.isPast" class="btn btn-danger mx-2"> لغو بار </button>
            </div>

        </div>
        <Loading v-if="showingMore" style="width: 100px; margin-bottom: 40px;" color="#42b983"/>

        </div>
    </div>

    <div class="modal fade" id="barInfoModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
            <h5 class="modal-title pe-3"> اطلاعات بار </h5>
          </div>

          <Loading v-if="BarInfoLoading" style="width: 100px; height: 100vh;" color="#42b983"/>
          <div v-else :id="barAllInfo.isSpecial" class="modal-body text-end">
            <br>
            <h3> :نمودار بازدید </h3>
            <div class="py-3"> <Chart v-if="showChart" :chartData="barAllInfo.visitData"/> </div>
            <small class="text-muted">.بازدید تلگرام همیشه کمتر از میزان واقعی آن نمایش داده شده و هر ۱۵ دقیقه یکبار به روزرسانی میشود</small>

            <h3 class="pt-4"> :اطلاعات بار </h3>


                <p dir="rtl"> <strong class="ps-2">مبدا:</strong> {{ barAllInfo.beginning }} </p>
                <p dir="rtl"> <strong class="ps-2">مقصد:</strong> {{ barAllInfo.destination }} </p>
                <p v-if="barAllInfo.distance" dir="rtl"> <strong class="ps-2">مسافت حدودی:</strong> {{ barAllInfo.distance }} </p>
                <p dir="rtl"> <strong class="ps-2">کرایه:</strong> {{ barAllInfo.price }} </p>
                <p dir="rtl"> <strong class="ps-2" dir="rtl">تاریخ بارگیری:</strong> {{ barAllInfo.date }} </p>
                <p dir="rtl"> <strong class="ps-2">تناژ:</strong> {{ barAllInfo.weight }} </p>
                <p dir="rtl"> <strong class="ps-2">نوع کالا:</strong> {{ barAllInfo.product_type }} </p>
                <p dir="rtl"> <strong class="ps-2">نوع ناوگان:</strong>  <span v-for="(values, name) in barAllInfo.fleet_type" :key="name"> <div class="py-2" v-if="values[0]"> <b>{{ name }}:</b><br> <div class="rounded px-2" style="background-color: rgba(144,238,144, 0.3)"> <div class="d-inline-block border border-dark p-1 m-2 rounded-3" v-for="(value, index) in values" :key="index"> {{ value }} </div></div> </div> </span> </p>
                <p dir="rtl"> <strong class="ps-2">توضیحات:</strong> {{ barAllInfo.description }} </p>
                <p dir="rtl"> <strong class="ps-2">اعلام کننده:</strong> {{ barAllInfo.name }} <i class="fa fa-check-circle text-primary"></i> </p>
                <p dir="rtl"> <strong class="ps-2">شماره تماس:</strong> {{ barAllInfo.phone_number }} </p>
            </div>

        </div>
      </div>
    </div>

    <div class="modal fade" id="dateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal"><i class="fas fa-arrow-left fs-3"></i></button>
                    <h5 class="modal-title pe-3"> ثبت مجدد بار </h5>
                </div>
                <Loading v-if="dateLoading" style="width: 70px" color="#42b983"/>
                <div v-else class="modal-body">
                    <button @click="selectDate(dateData.today, $event)" class="w-100 btn border border-success my-1 text-success dateButton"> امروز </button>
                    <button @click="selectDate(dateData.tomorrow, $event)" class="w-100 btn border border-success my-1 text-success dateButton"> فردا </button>
                    <button @click="selectDate(dateData.tomorrow1, $event)" class="w-100 btn border border-success my-1 text-success dateButton"> {{ dateData.afterTomorrow }} </button>
                    <button @click="selectDate(dateData.tomorrow2, $event)" class="w-100 btn border border-success my-1 text-success dateButton"> {{ dateData.twoAfterTomorrow }} </button>
                    <button @click="selectDate(dateData.tomorrow3, $event)" class="w-100 btn border border-success my-1 text-success dateButton"> {{ dateData.threeAfterTomorrow }} </button>
                </div>
                <div class="modal-footer ">
                    <button data-bs-dismiss="modal" class="btn btn-danger ms-auto" id="closeDateModal"> انصراف </button>
                    <button @click="submitReBar" class="btn btn-primary me-auto" :disabled="reBarLoading"> 
                        ثبت 
                        <Loading v-if="reBarLoading" style="width: 40px; display: inline;" color="#fff"/> 
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import { ref, toRaw } from 'vue'
import Loading from './Loading.vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle';
import Swal from 'sweetalert2';
import Chart from './Chart.vue';

export default {
    setup() {
        let data = ref([]);
        let firstLoading = ref(true);
        let BarInfoLoading = ref(true)
        let barAllInfo = ref('')
        let showChart = ref(false)
        let lastShow = 12
        let noMoreBars = false
        let showingMore = ref(false)


        function GetData() {
            axios.post("/ShowOwnerHistory/", {
                lastShow: lastShow
            }).then((res) => {
                data.value = res.data.data
                firstLoading.value = false
            }).catch(() => {
                firstLoading.value = false;
            });
        }

        GetData()

        window.onscroll = () => {getScrollSize()}
        function getScrollSize(){
                var h = document.documentElement, 
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
            let scrollPercante = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100
            if(scrollPercante > 80){
                showMore()
            }
        }
        function showMore(){
            if(noMoreBars){
                showingMore.value = false
                return
            }
            if(showingMore.value){
                return
            }
            showingMore.value = true
            lastShow += 12
            axios.post('/ShowOwnerHistory/',{
                lastShow: lastShow,

            }).then((res)=>{
                if(res.data.data.length < 12){
                    noMoreBars = true
                }
                showingMore.value = false
                data.value = data.value.concat(res.data.data)
            }).catch(()=>{
                showingMore.value = false
            })
        }
        
        function Info(barId){
            showChart.value = false
            BarInfoLoading.value = true
            let modal = new Modal(document.getElementById('barInfoModal'))
            modal.show()
            axios
            .post('/ShowOwnerBarInfo/',{
                barId: barId,
            })
            .then((res)=>{
                BarInfoLoading.value = false
                barAllInfo.value = res.data.data[0]
                showChart.value = true
            })
            .catch(()=>{
                modal.hide()
                BarInfoLoading.value = false
            })
        }


        let dateLoading = ref(true)
        let dateData = ref('')
        let ReBarDate = ''
        let reBarSelectedId
        let reBarLoading = ref(false)

        function selectDate(date, e){
            document.querySelectorAll('.dateButton').forEach((btn)=>{btn.classList = "w-100 btn border border-success my-1 text-success dateButton"})
            
            ReBarDate = date
            e.target.classList = "w-100 btn bg-success text-light my-1 dateButton"
        }

        function Rebar(barId){
            reBarSelectedId = barId
            document.querySelectorAll('.dateButton').forEach((btn)=>{btn.classList = "w-100 btn border border-success my-1 text-success dateButton"})
            ReBarDate = ''
            if(dateLoading.value == false){
                return
            }
            axios.get('/GetDate/').then((res)=>{
                dateData.value = res.data[0]
                dateLoading.value = false
            })
        }

        function submitReBar(){
            if(ReBarDate == ''){
                Swal.fire({title: 'تاریخ بارگیری را انتخاب کنید', icon: "warning", backdrop: false, position: "top", timer: 1500, showConfirmButton: false})
                return
            }
            reBarLoading.value = true
            axios.post('/ReBar/', {
                barId: reBarSelectedId,
                date: ReBarDate
            })
            .then(()=>{
                reBarLoading.value = false
                document.getElementById('closeDateModal').click()
                Swal.fire({title: 'ثبت شد', icon: "success", backdrop: false, position: "top", timer: 1500, showConfirmButton: false})
            })
            .catch((err)=>{ 
                reBarLoading.value = false
            })

        }



        let floatLoading = ref(false)

        function Cancel(barId){
            Swal.fire({
                title: 'برای لغو بار اطمینان دارید؟',
                text: 'درصورت لغو میتوانید مجددا بار را ثبت کنید',
                showDenyButton: true,
                confirmButtonText: 'بله',
                denyButtonText: `خیر`,
                }).then((result) => {

                if (result.isConfirmed) {
                    floatLoading.value = true
                    axios
                    .post('/CancelBar/', {
                    barId: barId
                    })
                    .then(()=>{
                        floatLoading.value = false
                        Swal.fire({title: 'بار لغو شد', icon: "success", backdrop: false, position: "top", timer: 2000, showConfirmButton: false})
                        let canceledBar = data.value.filter((targetBar) => targetBar["barId"] == barId)
                        console.log(canceledBar);
                        data.value[data.value.indexOf(canceledBar[0])].isCanceled = true
                    })
                    .catch((err)=>{
                        floatLoading.value = false
                    })

                    }
                    })
            }

        function RemoveBar(barId){
            Swal.fire({
                title: 'بار از تاریخچه شما پاک شود؟',
                text: 'درصورت حذف بار از تاریخچه میتوانید با پشتیبانی تماس گرفته و درخواست بازگشت بار به تاریخچه کنید ',
                showDenyButton: true,
                confirmButtonText: 'بله',
                denyButtonText: `خیر`,
                }).then((result) => {

                if (result.isConfirmed) {
                floatLoading.value = true
                
                axios
                .post('/RemoveBar/', {
                    barId: barId
                })
                .then(()=>{
                    floatLoading.value = false
                    Swal.fire({title: 'تاریخچه این بار حذف شد', icon: "success", backdrop: false, position: "top", timer: 2000, showConfirmButton: false})
                    let canceledBar = data.value.filter((targetBar) => targetBar["barId"] == barId)
                    data.value.splice(data.value.indexOf(canceledBar[0]), 1)
                })
                .catch(()=>{
                    floatLoading.value = false
                })
                    
                    }
                    })
            }

        return { data, firstLoading, barAllInfo, BarInfoLoading, Info, Rebar, Cancel, RemoveBar, floatLoading, 
                dateLoading, dateData, selectDate, submitReBar, reBarLoading, showChart, showingMore
                };
    },
    components: { Loading, Chart }
}
</script>

<style>
    
</style>