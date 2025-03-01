import React, { useState } from 'react'
import ForgetPassStepOne from './StepOne'
import ForgetPassStepTwo from './StepTwo'

export default function ForgetPass() {
  const [step,setStep]=useState(1)
  
  const handleStep=(st)=>{
    setStep(st)
  }
  return (
    <>{step==1?<ForgetPassStepOne  handleStep={handleStep}/>:<ForgetPassStepTwo handleStep={handleStep}/>}</>
  )
}
