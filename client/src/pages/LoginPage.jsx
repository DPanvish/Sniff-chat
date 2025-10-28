import assets from '../lib/assets'
import { useState } from 'react'

const LoginPage = () => {

  const [authState, setAuthState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    
    if(authState === "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left Side */}
      <img src={assets.logo_big} alt="Logo" className="h-[250px]" />

      {/* Right Side */}
      <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {authState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
        </h2>

        {authState === "Sign up" && !isDataSubmitted && (
          <input 
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text" 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="Full Name" 
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email" 
              placeholder="Email Address" 
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password" 
              placeholder="Password" 
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </>
        )}

        {authState === "Sign up" && isDataSubmitted && (
          <textarea 
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4} 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
          ></textarea>
        )}

        <button className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
          {authState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {authState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account? 
              <span 
                onClick={() => {
                  setAuthState("Login"); 
                  setIsDataSubmitted(false);
                }} 
                className="font-medium text-violet-500 cursor-pointer">
                  Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account 
              <span 
                onClick={() => setAuthState("Sign up")} 
                className="font-medium text-violet-500 cursor-pointer">
                  Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage