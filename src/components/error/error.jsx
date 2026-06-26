import { useState } from "react";
import Lightfall from "../style-components/lightfall";

export default function ErrorFallback({ status, title, reason }) {
  const [errorDetails] = useState({
    statusCode: status || 500,
    errorTitle: title || "Internal Server Error",
    errorReason: reason || "Something went wrong in the server",
  })

  return (
    <>
      {/*Lightfall background*/}
      <div className="w-screen h-screen fixed top-0 left-0 z-">
        <Lightfall
          colors={['#dc2461', '#FF393D', '#FF9FFC']}
          backgroundColor="#FF393D"
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
      <div
        className="
          w-[calc(100%-64px)] h-max bg-primary/60 backdrop-blur-sm rounded-outer fixed pos-center z-100 shadow-2xl p-6 pt-4 pointer-events-none border border-secondary max-w-sm        
      ">
        <h1 className="text-center">{errorDetails.errorTitle}</h1>
        <p className="mt-2">
          <span className="text-[14px] md:text-[18px] font-mono text-text-secondary">Status code: {errorDetails.statusCode}</span><br/>
          <span className="text-[14px] md:text-[18px] font-mono text-text-primary">Reason: {errorDetails.errorReason}</span>
        </p>
      </div>
    </>
  )
}