import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function LoginPage() {
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [redirect,setRedirect]=useState(false)
  const {setUserInfo}=useContext(UserContext)
  async function login(ev){
    ev.preventDefault()
    try{
    const response=await fetch('http://localhost:4000/login',{
    method:'POST',
    body:JSON.stringify({username,password}),
    headers:{'Content-Type':'application/json'},
    credentials:'include'
  });
  if(response.ok){
    response.json().then(userInfo=>{
      setUserInfo(userInfo)
      setRedirect(true)
    })
  }else{
    alert('wrong credentials')
  }}catch(e){
    console.log('error loggin in:',e);
    alert('an error occured ,please try again')
  }
  }
  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <form className='signup' onSubmit={login}>
      <h1>Login</h1>
     <input type="text" name="username"  placeholder='username' value={username} onChange={ev=>{setUsername(ev.target.value)}}/>
     <input type="password" name="password" placeholder='password' value={password} onChange={ev=>{setPassword(ev.target.value)}} />
     <button>Login</button>
    </form>
  )
}

export default LoginPage
