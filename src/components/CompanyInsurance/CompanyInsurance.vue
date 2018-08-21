<template>

  <div class="vehicle-insurance-left">
    <div v-for="(Cmpinsurance,CmpinsuranceKey) of Cmpinsurances" :key="CmpinsuranceKey" class="cmpinsurance">
      <div class="insurance_img">
        <img src="../../assets/Companyinsurance/insurance_vehicle.png" alt="">
      </div>
      <p class="cmpname">{{Cmpinsurance.Cmptitle}}</p>
      <div class="assment_rate" style="bottom:40px">
        <span class="assment">安全评估</span><span class="rate">{{Cmpinsurance.SafetyAssessment}}↑</span>
      </div>
      <div class="assment_rate" style="bottom:0px">
        <span class="assment">保险汇率</span><span class="rate">{{Cmpinsurance.Insurance_exchange_rate}}↓</span>
      </div>
    </div>
  </div>
</template>
<style src="./CompanyInsurance.css" type="text/css"></style>
<script>

export default {
  name: "CompanyInsurance",
  data() {
    return {
      Cmpinsurances:[{
        Cmptitle:"河北智优运输有限公司",//企业名
        SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      },{
        Cmptitle:"河北智优运输有限公司",//企业名
         SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      },{
        Cmptitle:"河北智优运输有限公司",//企业名
       SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      },{
        Cmptitle:"河北智优运输有限公司",//企业名
         SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      },{
        Cmptitle:"河北智优运输有限公司",//企业名
        SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      },{
        Cmptitle:"河北智优运输有限公司",//企业名
        SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      },{
        Cmptitle:"河北智优运输有限公司",//企业名
         SafetyAssessment:"87",//安全评估
        Insurance_exchange_rate:"5.8"//保险汇率
      }]
    };
  }
};
</script>
