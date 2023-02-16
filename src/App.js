import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import Login from './Components/Login'
const baseURL='http://localhost:5000/demologin/';



function App() {
  const [mobileNumber,setNumber] = useState('');
  const [otp,setOtp] = useState('');
  const [isOtpDelieverd,setIsOtpDelieverd] = useState(false);
  const [login,setLogin] = useState(false);

  async function sendVerificationCode(mobileNumber){
    const res=await axios.post(baseURL + 'send-verification-otp',{
      mobileNumber,
    });
    if(res.status === 200){
      return res.data.verification;
    }
    else{
      return res.data;
    }
  }

  async function verifyOTP(mobileNumber,otp){
    const res=await axios.post(baseURL + 'verify-otp',{
      mobileNumber,otp,
    });
    if(res.status === 200){
      
      return res.data.verification_check;
    }
    else{
      return res.data;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isNaN(mobileNumber)){
      alert('Invalid Phone Number')
    }
    else if(mobileNumber.length!==10){
      alert('Please Enter a 10 digit valid number')
    }
    else{
      if(isOtpDelieverd){
        const response=await verifyOTP(mobileNumber,otp);
        if(response.status === "approved"){
          console.log("verified");
          setLogin(true);
          alert("Login Successful")
        }
        else if(response.status === "pending"){
          console.log("invalid otp");
          alert("Invalid OTP")
        }
        else{
          console.log("error")
          alert("error");
        }
        console.log(response);
        // alert(response.status);
        return;
      }

      const response = await sendVerificationCode(mobileNumber);

      if(response.status === "pending"){
        
        document.getElementById('toremove').classList.remove('hidden')
        document.getElementById('btn').innerHTML="Verify";
        setIsOtpDelieverd(true);
      }
    }
  }

  return (
    <div className='Container'>
      <div className="headerContainer">
        <div className='header'>"Demo Login App with OTP created using ReactJs, Nodejs and Twilio" </div>
      </div>

      <div className='inputContainer'>
        <div><input className='mobNumber' type="text" placeholder='Mobile Number (without 0 or +91)' onChange={(e)=>setNumber(e.target.value)} /></div>
        <div><input id='toremove' className='otp hidden' type="text" placeholder='OTP' onChange={(e)=>setOtp(e.target.value)}/></div>
        
        <div><button id='btn' className='button' type="submit" onClick={(e)=>handleSubmit(e)} >Get OTP</button></div>

      </div>

    <div className='footerContainer' ><p className="copyright"> © 2023 Divyam Ghule.</p></div>
    {
      login && <Login/>
    }
  </div>
  );
}

export default App;
