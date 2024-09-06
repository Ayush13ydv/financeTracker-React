import React, { useEffect } from 'react'
import "./style.css";
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from "../../assets/user.svg"

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate()

  useEffect(()=>{
    if(user){
      navigate("/dashboard")
    }
  },[user,loading])

  const logoutFunc=()=>{
    signOut(auth).then(() => {
      navigate("/");
    toast.success("Logout succesfully")
    }).catch((error) => {
      // An error happened.
      toast.error(error)
    });
  }
  return (
    <div className='navbar' >
      <p  className='logo'>Financely</p>
      {user &&(
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <img src={user.photoURL? user.photoURL : userImg} style={{borderRadius:'50%',height:"2rem", width:"2rem" }} />
         
      <p className='logo link' onClick={logoutFunc}>Logout</p>
      </div>
      )}
    </div>
  )

}

export default Header;
