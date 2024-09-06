import React, { useState } from 'react'
import "./style.css"
import Input from '../Inputs/Input'
import Button from '../Buttons/Button'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify'
import { auth, fireDB, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignIn = () => {
 
    const[name,setName] = useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[confirmPassword,setConfirmPassword] = useState('')
    const[loading,setLoading]=useState(false)
    const[loginForm,setLoginForm]= useState(false)
    const navigate = useNavigate()

  

    const signUp=async(e)=>{
      setLoading(true)
      // --------------------SignIn----------------------------
       if(name !=="" && email!=="" && password!=="" && confirmPassword!==""){
      
        if(password===confirmPassword){
          createUserWithEmailAndPassword
          (auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            toast.success("SignUp succesfull")
            console.log("User",user)
            setLoading(false)
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("")
            navigate("/dashboard")
            createDoc(user)
            loginWithGoogle()
          
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error("try again")
            setLoading(false)
          
            // ..
          });
        }else{
        toast.error("Password and confirmPassword does not match")
        }
       
       }else{
        toast.error("All feilds are required")
        setLoading(false)
       }

      //  ------------------Login-----------------
     
      
    }
    const signinwithEmail =(e )=>{
      setLoading(true)
      e.preventDefault();
      if(email!=="" && password!==""){
        signInWithEmailAndPassword (auth, email, password)
       .then((userCredential) => {
     // Signed up 
     const user = userCredential.user;
     toast.success("Login Succesfull")
     setEmail("")
     setPassword("")
     setLoading(false)
  

     // ...
     })
   .catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message;
     toast.error(errorMessage)
     setLoading(false)
     // ..
     });
   }else{
     toast.error("Login Failed")
     setLoading(false)
   }
    }
    const createDoc=async(user)=>{
      if (!user) return;
  
      const userRef = doc(fireDB, "users", user.uid);
      const userData = await getDoc(userRef);
  
      if (!userData.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();
  
        try {
          await setDoc(userRef, {
            name: displayName ? displayName : name,
            email,
            photoURL: photoURL ? photoURL : "",
            createdAt,
          });
          toast.success("Account Created!");
          setLoading(false);
        } catch (error) {
          toast.error(error.message);
          console.error("Error creating user document: ", error);
          setLoading(false);
        }
      }
   
    }

    const loginWithGoogle=()=>{
    setLoading(true)
    try {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        createDoc(user)
        toast.success("User created succesfully")
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(error.errorMessage)
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
       
        // ...
      });
    } catch (error) {
      toast.error(e.message)
    }

    }
  return (
    <>
    {
      loginForm?(<>
         <div className='signin-wrapper'>
     <h2 className='title'>Sign Up on <span style={{color:"var(--theme)"}}>Financely</span></h2>
    
     <Input label={"Email"} state={email} setState={setEmail} placeholder={"johndoe@gmail.com"}/>
     <Input label={"Password"} state={password} setState={setPassword} placeholder={"johndoe@123"} type={"password"}/>
   
     <Button disabled={loading}  onClick={signinwithEmail}  text={loading?"loading...":"Login using email and password"}/>
     <p style={{textAlign:'center'}}>Or</p>
     <Button onClick={loginWithGoogle} text={loading?"loading...":"Login using Google"} blue={true}/>
     <p style={{textAlign:'center',cursor:"pointer"}} onClick={()=>setLoginForm(!loginForm)}>Don't have an account? Click here to <span style={{color:"var(--theme)"}}>SignUp</span></p>
   
    </div>
      </>):(
            <div className='signin-wrapper'>
            <h2 className='title'>Sign Up on <span style={{color:"var(--theme)"}}>Financely</span></h2>
            <Input label={"Full Name"} state={name} setState={setName} placeholder={"John Doe"}/>
            <Input label={"Email"} state={email} setState={setEmail} placeholder={"johndoe@gmail.com"}/>
            <Input label={"Password"} state={password} setState={setPassword} placeholder={"johndoe@123"} type={"password"}/>
            <Input label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"johndoe@123"}  type={"password"}/>
            <Button disabled={loading}  onClick={signUp}  text={loading?"loading...":"SignUp using email and password"}/>
            <p style={{textAlign:'center'}}>Or</p>
            <Button onClick={loginWithGoogle} text={loading?"loadin...":"SignUp using Google"} blue={true}/>
            <p style={{textAlign:'center',cursor:'pointer'}} onClick={()=>setLoginForm(true)}>Have an account already? Click here to <span style={{color:"var(--theme)"}}>login</span> </p>
           </div>
      )
    }
    </>

  )
}

export default SignIn
