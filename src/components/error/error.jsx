import { useState } from "react";
import GradientASCII from "../style-components/ascii";
import { useScreenSize } from "react-haiku";

export default function ErrorFallback({ status, title, reason }) {
  const screenSize = useScreenSize();

  const [errorDetails] = useState({
    statusCode: status || 500,
    errorTitle: title || "Internal Server Error",
    errorReason: reason || "Something went wrong in the server",
  })

  return (
    <main className="w-dvw h-dvh p-5 flex flex-col lg:flex-row gap-5">
      <div className={`
        w-full h-60 rounded-independent overflow-hidden relative border border-border
        lg:w-[calc(100%-600px)] lg:h-full
      `}>
        <div className="w-[calc(100%+120px)] h-[calc(100%+80px)] absolute bottom-0 left-1/2 -translate-x-1/2 lg:min-w-350 lg:w-full lg:h-full duration-300 transition-all ease-in-out">
          <GradientASCII
            colors={["#F10222","#ff393d","#ff5a36"]}
            shape={screenSize.lte("sm") ? "rise" : "horizon"}
            characters="!#"
            cellSize={30}
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
        <div className="max-w-60 leading-12 xl:leading-20 2xl:leading-24 xl:max-w-115 absolute z-100 top-4 right-5 text-right md:top-[unset] md:bottom-4 lg:bottom-8 lg:right-10 xl:bottom-12 xl:right-15 duration-300 transition-all ease-in-out font-bold text-4xl xl:text-[60px] 2xl:text-[80px]">
          {errorDetails.errorTitle}
        </div>
      </div>
      <div className="
        w-full h-[calc(100%-240px)] pt-8 relative
        lg:w-[calc(100%-(100%-600px))] lg:h-full lg:pt-0
      ">
        <div className="w-full max-w-80 h-max flex flex-col gap-1 absolute left-1/2 -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2">
          <h1>{errorDetails.statusCode}</h1>
          <p className="text-base md:text-lg font-mono text-text-primary">
            Reason: {errorDetails.errorReason}
          </p>
        </div>
      </div>
    </main>
  )
}