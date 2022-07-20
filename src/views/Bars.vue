<template>

    <div>
        <div class="py-1 text-green h5 border-bottom border-green d-inline-block px-5">سالن اعلام بار</div>
        <div class="text-end bg-light p-3">
            <button data-bs-toggle="modal" data-bs-target="#FilterModal" class="btn btn-outline-green"> فیلتر کردن </button>
        </div>

        <div class="modal fade" id="FilterModal">
            <div class="modal-dialog modal-dialog-scrollable modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal"><i class="fas fa-arrow-left fs-3"></i></button>
                        <h5 class="modal-title pe-3" id="PayMentModalLabel">فیلتر کردن </h5>
                    </div>
                    <div class="modal-body">

                        <div class="my-3">
                            <div class="w-100 text-end pb-2 mt-5 border-bottom" type="button" data-bs-toggle="collapse" data-bs-target="#dateCollapse" @click="getDate">
                                تاریخ بارگیری <i id="dateAngle" class="fas fa-angle-down float-start out"></i>
                            </div>
                            <div class="collapse" id="dateCollapse">
                                <div class="p-2 border-bottom border-start border-end">
                                    <Loading v-if="dateLoading" style="width: 70px" color="#42b983"/>
                                    <div v-else>
                                        <div>
                                            <div class="text-end">
                                                <label class="py-2 pointer" :for="dateData.today"> امروز  <input type="checkbox" class="form-check-input ms-2" :id="dateData.today"> </label> <br>
                                                <label class="py-2 pointer" :for="dateData.tomorrow"> فردا  <input type="checkbox" class="form-check-input ms-2" :id="dateData.tomorrow"> </label> <br>
                                                <label class="py-2 pointer" :for="dateData.tomorrow1"> {{ dateData.afterTomorrow }}  <input type="checkbox" class="form-check-input ms-2" :id="dateData.tomorrow1"> </label> <br>
                                                <label class="py-2 pointer" :for="dateData.tomorrow2"> {{ dateData.twoAfterTomorrow }}  <input type="checkbox" class="form-check-input ms-2" :id="dateData.tomorrow2"> </label> <br>
                                                <label class="py-2 pointer" :for="dateData.tomorrow3"> {{ dateData.threeAfterTomorrow }}  <input type="checkbox" class="form-check-input ms-2" :id="dateData.tomorrow3"> </label> <br>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div class="w-100 text-end pb-2 mt-5 border-bottom" type="button" data-bs-toggle="collapse" data-bs-target="#desCollapse" @click="desRotate">
                                    <!-- Changing the i tag class can cause auto select searchField to fail -->
                                مقصد <i id="desAngle" class="fas fa-angle-down float-start out"></i>
                            </div>
                            <div class="collapse" id="desCollapse">
                                <div class="p-2 border-bottom border-start border-end">
                                    <!-- selected cities -->
                                    <div v-for="(e, index) in selectedCities" :key='index' class="d-inline-block m-1 border border p-1 rounded" style="border-color: rgb(234,0,0) !important"> 
                                        <button @click="removeCitySelected(index)" class="btn text-danger p-0"> <i class="fal fa-times-circle fs-4"></i> </button> 
                                        {{ e }} 
                                    </div> 
                                    <!--  -->
                                    <input type="text" v-model.trim="searchField" id="searchInput" class="form-control mt-2" dir="rtl" placeholder="جستجو...">

                                    <div v-if="lessChar" class="p-3"> حداقل دو حرف واردکنید</div>

                                    <div id="citiesContainer">
                                        <Loading v-if="citiesLoading" style="width: 70px" color="#42b983"/>

                                        <div v-else-if="searchRes[0]">
                                            <div v-for="(city, index) in searchRes" :key="index">
                                                <button @click="addSelectedCity(city)" class="btn btn-outline-dark w-100 text-end" > {{city}} <i class="fa fa-map-marker text-green"></i> </button> 
                                            </div>      
                                        </div>

                                        <h5 class="p-3" v-else-if="searchField">
                                            موردی یافت نشد
                                        </h5>

                                    </div>
                                </div>
                            </div>


                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-success w-100" @click="showFilter" data-bs-toggle='modal' data-bs-target='#FilterModal'> اعمال </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Loading v-if="loading" style="width: 100px" color="#42b983"/>

        <h2 class="py-3" v-if="bars == ''"> باری جهت نمایش وجود ندارد </h2>
        <div style="min-height: 100vh;" id="barsContainer" class="bg-lightGray">
        <div v-for="(bar, index) in bars" :key="index" class="border rounded mx-1 px-1 pt-5 my-2" style="background-color: #fff;">

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

            <button @click="ShowBarInfo(bar.barId)" class="btn btn-success w-100 mt-3">جزییات بیشتر</button>

            
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

          <Loading v-if="BarInfoLoading" style="width: 100px; height: 70vh;" color="#42b983"/>
          <div v-else :id="barAllInfo.isSpecial" class="modal-body text-end">
            <p dir="rtl"> <strong class="ps-2">مبدا:</strong> {{ barAllInfo.beginning }} </p>
            <p dir="rtl"> <strong class="ps-2">مقصد:</strong> {{ barAllInfo.destination }} </p>
            <p v-if="barAllInfo.distance" dir="rtl"> <strong class="ps-2">مسافت حدودی:</strong> {{ barAllInfo.distance }} </p>
            <p dir="rtl"> <strong class="ps-2">کرایه:</strong> {{ barAllInfo.price }} </p>
            <p dir="rtl"> <strong class="ps-2" dir="rtl">تاریخ بارگیری:</strong> {{ barAllInfo.date }} </p>
            <p dir="rtl"> <strong class="ps-2">تناژ:</strong> {{ barAllInfo.weight }} </p>
            <p dir="rtl"> <strong class="ps-2">نوع کالا:</strong> {{ barAllInfo.product_type }} </p>
            <p dir="rtl"> <strong class="ps-2">نوع ناوگان:</strong> <span v-for="(values, name) in barAllInfo.fleet_type" :key="name"> <div class="py-2" v-if="values[0]"> <b>{{ name }}:</b><br> <div class="rounded px-2" style="background-color: rgba(144,238,144, 0.3)"> <div class="d-inline-block border border-dark p-1 m-2 rounded-3" v-for="(value, index) in values" :key="index"> {{ value }} </div></div> </div> </span> </p>
            <p dir="rtl"> <strong class="ps-2">توضیحات:</strong> {{ barAllInfo.description }} </p>
          </div>
          
          <div class="modal-footer">
              <button :disabled="BarInfoLoading" @click="show_contact(barAllInfo.barId)" class="btn btn-success w-100"> مشاهده اطلاعات تماس </button>
          </div>

        </div>
      </div>
    </div>

</template>

<script>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import Loading from './Loading.vue';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle';
import Swal from 'sweetalert2';
export default {
    components: { Loading },
    setup(){

        let lastBarShow = 12
        let loading = ref(true)
        let bars = ref()
        let showingMore = ref(false)
        let noMoreBars = false

        function getBars(){
            axios
            .post('/ShowBars/', {
                lastBarShow: lastBarShow
            }).then((res)=>{
                bars.value = res.data.data
                loading.value = false
            }).catch(()=>{
                loading.value = false
        })
        }
        getBars()

        // date filter
        let dateLoading = ref(true)
        let dateData = ref()
        let dateFilter = []
        function getDate(){
            document.getElementById('dateAngle').classList.toggle('over')
            document.getElementById('dateAngle').classList.toggle('out')
            if(dateLoading.value == false){
                return
            }
            axios.get('/GetDate/').then((res)=>{
                dateData.value = res.data[0]
                dateLoading.value = false
            })
        }


        // destination filter
        let selectedCities = ref([])
        let searchField = ref('')
        let lessChar = ref(true)
        let citiesLoading = ref(false)
        let searchRes = ref([])

        onMounted(() => {
            let citiesContainer = document.getElementById('citiesContainer')
        })

        function desRotate(){
            document.getElementById('desAngle').classList.toggle('over')
            document.getElementById('desAngle').classList.toggle('out')
            if(document.getElementById('desAngle').classList[3] == 'over'){
                document.getElementById('searchInput').focus()
            }
        }
        function removeCitySelected(index){
            selectedCities.value.splice(index, 1)
        }
        function addSelectedCity(city){
            selectedCities.value.push(city)
        }
        watch([searchField], ()=>{
            if (searchField.value.length < 2){
                lessChar.value = true
                citiesContainer.classList.add('d-none')
                return
            }

            citiesLoading.value = true

            axios
            .get('/SearchDestinations/', {
                params: {pattern: searchField.value}
                })
            .then((res)=>{
                searchRes.value = res.data
                citiesLoading.value = false
            }).catch(()=>{
                citiesLoading.value = false
            })


            citiesContainer.classList.remove('d-none')
            lessChar.value = false
        })



        function showFilter(){    
            loading.value = true
            let inputs = document.querySelectorAll('.form-check-input:checked')
            for (let i = 0; i < inputs.length; i++) {
                dateFilter.push(inputs[i].id)
            }
            lastBarShow = 12
            axios.post('/ShowBars/',{
                // fleetType: fleetTypeFilter.value,
                destination: selectedCities.value,
                date: dateFilter,
                lastBarShow: lastBarShow,

            }).then((res)=>{
                if(res.data.data.length < 12){
                    noMoreBars = true
                }else{
                    noMoreBars = false
                }

                bars.value = res.data.data
                loading.value = false
            }).catch(()=>{
                loading.value = false
            })
        }
        

        let BarInfoLoading = ref(true)
        let barAllInfo = ref()
        function ShowBarInfo(barId){
            BarInfoLoading.value = true
            let modal = new Modal(document.getElementById('barInfoModal'))
            modal.show()
            axios
            .post('/ShowBarInfo/',{
                barId: barId,
            })
            .then((res)=>{
                BarInfoLoading.value = false
                barAllInfo.value = res.data.data[0]
            })
            .catch(()=>{
                modal.hide()
                BarInfoLoading.value = false
            })
        }
        
        function show_contact(id){
            Swal.fire({
            title: 'آیا از درخواست خود اطمینان دارید؟',
            text: 'شماره شما و اعلام کننده بار برای هم پیامک میشود',
            showDenyButton: true,
            confirmButtonText: 'بله',
            denyButtonText: `خیر`,
            }).then((result) => {
            if (result.isConfirmed) {

                axios.post('/AcceptBar/',{
                    barId : id,
                }).then((res)=>{
                    Swal.fire(res.data.message, '', 'success')
                })

            }
            })
        }

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
            lastBarShow += 12
            axios.post('/ShowBars/',{
                // fleetType: fleetTypeFilter.value,
                destination: selectedCities.value,
                date: dateFilter,
                lastBarShow: lastBarShow,

            }).then((res)=>{
                if(res.data.data.length < 12){
                    noMoreBars = true
                }
                showingMore.value = false
                bars.value = bars.value.concat(res.data.data)
                // bars.value += res.data.data
            }).catch(()=>{
            })
        }

        return {
            dateLoading, dateData, getDate,
            selectedCities, searchField, lessChar, citiesLoading, searchRes, desRotate, removeCitySelected, addSelectedCity,
            showFilter, bars, loading, ShowBarInfo, BarInfoLoading, barAllInfo, show_contact, showingMore, 
            }
    }
}
</script>

<style>
.over {
    transform: rotate( +180deg );            
    transition: transform 150ms ease;
}

.out {
    transform: rotate( +360deg );            
    transition: transform 150ms ease;
}

#true #false{
    text-align: end;
}

#false>:nth-child(odd){
    background: rgb(231, 231, 231) !important;
}

#true>:nth-child(odd){
    background: #ffc10794 !important;
}

#true>p{
    padding: 7px;
}

#false>p{
    padding: 7px;
}

#BarInfo{
    text-align: end;
}

#BarInfo>:nth-child(odd){
    background: rgb(231, 231, 231) !important;
}

#BarInfo>p{
    padding: 7px;
}
</style>