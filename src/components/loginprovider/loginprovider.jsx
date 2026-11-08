import hashProcessor from "../security/zenguard-login/hashProcessor";
import { getApps, getUserData } from "../db/getData";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useScreenSize } from 'react-haiku';

// Icons
import { IoEye, IoEyeOff } from "react-icons/io5";
import Snackbar from "./zenengine/snackbar";
import ErrorFallback from "../error/error";
import GradientASCII from "../style-components/ascii";

export default function LoginProvider() {
  const screenSize = useScreenSize();
  const [snackbar, setSnackbar] = useState({
    isOpened: false,
    message: "Hello world",
    duration: 4000,
    onClose: null
  });

  const [searchParams] = useSearchParams();
  const [validAppOrigins, setValidAppOrigins] = useState(null);
  const [loadingOrigins, setLoadingOrigins] = useState(true);

  const passwordRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const appOrigin = searchParams.get("appOrigin") || null;

  useEffect(() => {
    async function fetchOrigins() {
      const fetchApps = await getApps();
      if (fetchApps.ok) {
        setValidAppOrigins(fetchApps.data.record);
      } else {
        console.log(fetchApps.message);
        setValidAppOrigins(null);
      }
      setLoadingOrigins(false);
    }
    fetchOrigins();
  }, []);

  useEffect(() => {
    if (appOrigin && validAppOrigins?.[appOrigin.toLowerCase()]) {
      document.title = `Login to ${validAppOrigins[appOrigin.toLowerCase()].app_name} – ZenAccount`;
    }
  }, [appOrigin, validAppOrigins]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((visible) => !visible);
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
              password_hashed: userData.user.password_hashed,
              role: userData.user.role,
              userid: userData.user.id
            }))
            setSnackbar(prevSnackbar => ({
              ...prevSnackbar,
              isOpened: true,
              duration: 2500,
              message: `Hello, ${userData.user.first_name}. Redirecting you to ${validAppOrigins?.[appOrigin.toLowerCase()]?.app_name || "ZenAccount"}...`,
              onClose: () => {
                if (appUrl) {
                  window.location.href = appUrl;
                }
              }
            }))
          } else {
            throw new Error("Login credentials doesn't match.")
          }
        } else {
          throw new Error(userData.message)
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

  // --- Early Returns (Must be placed AFTER all hooks) ---
  if (loadingOrigins) {
    return null;
  }

  if (!appOrigin) {
    return (
      <ErrorFallback
        status="400: Bad Request"
        title="Incomplete Request"
        reason="ZenAccount couldn't verify where this request came from."
      />
    );
  }

  if (!validAppOrigins?.[appOrigin.toLowerCase()]) {
    return (
      <ErrorFallback
        status="400: Bad Request"
        title="Invalid App Origin"
        reason={`${appOrigin.toLowerCase()} is not a valid ZenApps.`}
      />
    );
  }

  return (
    <>
      <main className="w-dvw h-dvh p-5 flex flex-col lg:flex-row gap-5">
        <div className={`
          w-full h-60 rounded-independent overflow-hidden relative border border-border
          lg:w-[calc(100%-600px)] lg:h-full
        `}>
          <div className="w-[calc(100%+120px)] h-[calc(100%+80px)] absolute bottom-0 left-1/2 -translate-x-1/2 lg:min-w-350 lg:w-full lg:h-full duration-300 transition-all ease-in-out">
            <GradientASCII
              colors={["#1e3fd8","#f6f8ff","#a5d8ff","#007AFF"]}
              shape={screenSize.lte("sm") ? "rise" : "horizon"}
              characters="01"
              cellSize={40}
              density={0.8}
              glyphOpacity={0.85}
              glow={0.2}
              depthOfField={0}
              flicker={0.2}
              softness={1}
              scale={0.8}
              flow={0.4}
              speed={1}
              gradientOpacity={0.9}
              grain={0.08}
              variation={0}
              mouseInteraction
              scrambleRadius={0.1}
              clickEffect="wave"
              intro
              lightMode={false}
            />
          </div>
          { appOrigin && validAppOrigins[appOrigin.toLowerCase()] ?
            <div className="absolute z-100 top-4 right-5 text-right md:top-[unset] md:bottom-4 lg:bottom-8 lg:right-10 xl:bottom-12 xl:right-15 duration-300 transition-all ease-in-out">
              <span className="
                text-2xl text-text-secondary font-medium
              ">Log In to</span><br/>
              <div className="flex gap-4 items-center">
                <img src={validAppOrigins[appOrigin.toLowerCase()].app_icon_url} alt="https://raw.githubusercontent.com/ZenxyNC/zendocs/refs/heads/main/public/resources/AppIcon/zenaccount.png" className="w-12 xl:w-20 rounded-inner xl:rounded-independent duration-300 transition-all ease-in-out"/>
                <span className="
                  text-4xl text-text-primary font-bold duration-300 transition-all ease-in-out
                  xl:text-[60px]
                ">{appOrigin && validAppOrigins[appOrigin.toLowerCase()] ? validAppOrigins[appOrigin.toLowerCase()].app_name : "ZenAccount"}</span>
              </div>
            </div>
            : ""
          }
        </div>



        <div className="
          w-full h-[calc(100%-240px)] pt-8 relative
          lg:w-[calc(100%-(100%-600px))] lg:h-full lg:pt-0
        ">
          <div className="w-full max-w-80 h-max flex flex-col gap-6 absolute left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2">
            {/* Heading */}
            <header className="flex flex-col gap-1">
              <h1>Log In</h1>
              <span className="text-sm text-text-secondary">Log In to {appOrigin && validAppOrigins[appOrigin.toLowerCase()] ? validAppOrigins[appOrigin.toLowerCase()].app_name : "ZenAccount"}</span>
            </header>

            {/* Inputs Field */}
            <form 
              className="flex flex-col gap-5"
              onSubmit={(ev) => handleLogin(ev)}
            >
              <div className="flex flex-col gap-2">
                <label
                  className="text-text-secondary text-[14px]"
                >
                  Username
                </label>
                <input
                  autoFocus
                  type="text"
                  id="username"
                  className="
                    w-full h-10 bg-secondary/40 rounded-inner border border-border p-4
                "
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-text-secondary text-[14px]"
                >
                  Password
                </label>
                <div className="flex flex-row gap-2">
                  <input
                    ref={passwordRef}
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="
                      w-full h-10 bg-secondary/40 rounded-inner border border-border p-4
                    "
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    className="min-w-10 min-h-10 bg-secondary/40 grid items-center justify-center rounded-inner border border-border cursor-pointer active:scale-95 duration-200 transition-all ease-in-out"
                    onClick={togglePasswordVisibility}
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    aria-pressed={isPasswordVisible}
                  >
                    {isPasswordVisible ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="box-border w-80 h-10 inline-flex items-center justify-center bg-[linear-gradient(180deg,#007aff_0%,#1e3fd8_162%)] border border-[#1e3fd8] rounded-xl shadow-[inset_0_1px_0_rgba(245,245,245,0.24)] text-[#f5f5f5] font-['Inter'] text-base font-bold cursor-pointer login-button-shadow  transition-all duration-300 ease-in-out">Login</button>
            </form>
          </div>
          <footer className="flex flex-col gap-2 text-text-secondary text-sm absolute bottom-0">
            <span>Provided by ZenAccount | Secured by ZenGuard</span>
            <span>Copyright © 2026 ZenAccount</span>
          </footer>
        </div>
      </main>
      {/*Snackbar*/}
      {snackbar.isOpened &&
        <Snackbar
          message={snackbar.message}
          duration={snackbar.duration}
          onClose={snackbar.onClose}
        />
      }
    </>
    

  )
}
