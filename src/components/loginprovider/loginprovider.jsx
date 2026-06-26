import Lightfall from "../style-components/lightfall"
import hashProcessor from "../security/zenguard-login/hashProcessor";
import { getUserData } from "../db/getData";

import { useState, useRef } from "react"
import { useSearchParams } from "react-router-dom";

// Icons
import { IoEye, IoEyeOff } from "react-icons/io5";
import Snackbar from "./zenengine/snackbar";
import ErrorFallback from "../error/error";

export default function LoginProvider() {
  const [snackbar, setSnackbar] = useState({
    isOpened: false,
    message: "Hello world",
    duration: 4000
  })

  const [searchParams] = useSearchParams();
  const validAppOrigins = {
    "zencore": "ZenCore",
    "zencourse": "ZenCourse",
    "zenguard": "ZenGuard",
    "zenclock": "ZenClock",
    "zenengine": "ZenEngine",
    "zendocs": "ZenDocs",
    "zenapps": "ZenApps"
  }

  const appOrigin = searchParams.get("appOrigin") || null;
  const appUrl = appOrigin ? `https://zenxync.github.io/${appOrigin.toLowerCase()}` : null;

  if (!appOrigin) {
    return (
      <ErrorFallback 
        status="400"
        title="Incomplete Request"
        reason="ZenAccount couldn't verify where this request came from."
      />
    )
  } else {
    if(!validAppOrigins[appOrigin.toLowerCase()]) {
      return (
        <ErrorFallback 
          status="400"
          title="Invalid App Origin"
          reason="This app is not connected to ZenApps."
        />
      )
    } else {
      document.title = `Login to ${validAppOrigins[appOrigin.toLowerCase()]} – ZenAccount`
    }
  }

  const passwordRef = useRef(null);
  const eyeIconRef = useRef(null);
  const eyeOffIconRef = useRef(null);


  const togglePasswordVisibility = () => {
    if (passwordRef.current) {
      if (passwordRef.current.type === "password") {
        passwordRef.current.type = "text";
        if (eyeIconRef.current) eyeIconRef.current.style.display = "none";
        if (eyeOffIconRef.current) eyeOffIconRef.current.style.display = "block";
      } else {
        passwordRef.current.type = "password";
        if (eyeIconRef.current) eyeIconRef.current.style.display = "block";
        if (eyeOffIconRef.current) eyeOffIconRef.current.style.display = "none";
      }
    }
  };


  async function handleLogin(ev) {
    ev.preventDefault();

    try {
      const username = ev.target.username.value;
      const password = passwordRef.current ? passwordRef.current.value : "";
      const hashEngine = new hashProcessor(password).startengine();

      if (hashEngine.ok) {
        const userData = await getUserData("user", username);
        if (userData.ok) {
          const LocalStorageKey = `${appOrigin.toLowerCase()}-user-info`;
          if (userData.user.password_hashed === hashEngine.object) {
            localStorage.setItem(LocalStorageKey, JSON.stringify({
              first_name: userData.user.first_name,
              last_name: userData.user.last_name,
              username: userData.user.username,
              email: userData.user.email,
              phone: userData.user.phone,
              password_hashed: userData.user.password_hashed
            }))
            setSnackbar(prevSnackbar => ({
              ...prevSnackbar,
              isOpened: true,
              message: `Hello, ${userData.user.first_name}. Redirecting you to ${validAppOrigins[appOrigin.toLowerCase()] || "ZenAccount"}...`,
              onClose: () => {
                if (appUrl) {
                  window.location.href = appUrl;
                }
              }
            }))
          } else {
            throw new Error("Incorrect username or password.")
          }
        } else {
          throw new Error("User not found.")
        }
      } else {
        throw new Error(hashEngine.object)
      }
    } catch (err) {
      setSnackbar({
        isOpened: true,
        message: err.message,
        duration: 4000,
        onClose: () => {
          setSnackbar(prevSnackbar => ({
            ...prevSnackbar,
            isOpened: false,
            onClose: null,
          }))
        }
      })
    }
  }

  return (
    <>
      {/*Lightfall background*/}
      <div className="w-screen h-screen fixed top-0 left-0 z-">
        <Lightfall
          colors={['#4C24DC', '#007AFF', '#FF9FFC']}
          backgroundColor="#0A29FF"
          speed={0.7}
          streakCount={2.5}
          streakWidth={1}
          streakLength={1}
          glow={3}
          density={0.5}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction={true}
          mouseStrength={0.2}
          mouseRadius={0.4}
          color1="#A6C8FF"
          color2="#007AFF"
          color3="#4C24DC"
        />
      </div>

      {/*Card main body*/}
      <div className="
        w-[calc(100%-64px)] h-max bg-primary/60 backdrop-blur-sm rounded-outer fixed pos-center z-100 purple-shadow p-6 pointer-events-none border border-secondary max-w-sm
        md:max-w-md
      ">
        <h1 className="text-center pointer-events-auto">Welcome Back!</h1>
        <span className="block text-center text-text-secondary text-[14px] pointer-events-auto">Sign in to { appOrigin && validAppOrigins[appOrigin.toLowerCase()] ? validAppOrigins[appOrigin.toLowerCase()] : "ZenAccount"}</span>

        <form
          className="mt-5 flex flex-col gap-4 relative pointer-events-none"
          onSubmit={(ev) => handleLogin(ev)}
        >
          <div className="flex flex-col gap-1 pointer-events-auto">
            <label
              className="text-text-secondary text-[14px]"
            >
              Username
            </label>
            <input
              autoFocus
              type="text"
              id="username"
              placeholder="Enter your username"
              className="
                w-full h-10 bg-secondary/40 rounded-inner border border-border p-4 transition-all ease-in-out duration-150
                focus:border-white text-[14px]
              "
            />
          </div>
          <div className="flex flex-col gap-1 pointer-events-auto">
            <label
              className="text-text-secondary text-[14px]"
            >
              Password
            </label>
            <div className="flex flex-row gap-2">
              <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="
                  w-full h-10 bg-secondary/40 rounded-inner border border-border p-4 transition-all ease-in-out duration-150
                  focus:border-white text-[14px]
                "
              />
              <button
                type="button"
                id="toggle-password"
                className="min-w-10 min-h-10 bg-secondary/40 grid items-center justify-center rounded-inner border border-border cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <div ref={eyeIconRef}><IoEye /></div>
                <div ref={eyeOffIconRef} style={{ display: 'none' }}><IoEyeOff /></div>
              </button>
            </div>
          </div>
          <button
            type="submit"
            id="submit-form"
            className="
              w-full h-11 rounded-full bg-accent mt-4 cursor-pointer font-bold text-[20px] transition-all ease-in-out duration-200 pointer-events-auto
              hover:-translate-y-1 hover:shadow-xl
              active:-translate-y-0.5 active:shadow-none
            ">
            Log In
          </button>
        </form>
      </div>

      {/*Snackbar*/}
      {snackbar.isOpened &&
        <Snackbar
          message={snackbar.message}
          duration={snackbar.duration}
        />
      }
    </>
  )
}