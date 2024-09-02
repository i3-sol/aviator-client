/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
// import { useCrashContext } from "../Main/context";
import "./crash.scss";
import Unity from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png";
import Context from "../../context";
import { binaryToFloat } from "../utils";

let currentSubFlag = '';

export default function WebGLStarter() {
  const {
    GameState,
    currentNum,
    unityState,
    myUnityContext,
    time,
    unityLoading,
    setCurrentTarget,
  } = React.useContext(Context);
  const [waiting, setWaiting] = React.useState(0);
  const [flag, setFlag] = React.useState('');
  const unityRef = React.useRef(null);

  React.useEffect(() => {
    let myInterval;
    if (GameState === "PLAYING") {
      setFlag('PLAYING');
      setCurrentTarget(binaryToFloat(currentNum));
    } else if (GameState === "GAMEEND") {
      setFlag('GAMEEND');
      currentSubFlag = '';
    } else if (GameState === "BET") {
      setFlag('BET');
      currentSubFlag = '';
      let startWaiting = Date.now() - time;
      setCurrentTarget(1);

      myInterval = setInterval(() => {
        setWaiting(Date.now() - startWaiting);
      }, 20);
    }
    return () => clearInterval(myInterval);
  }, [GameState, unityState]);

  useEffect(() => {
    if (binaryToFloat(currentNum) > 2 && binaryToFloat(currentNum) < 10 && currentSubFlag !== 'SCORE_2') {
      currentSubFlag = 'SCORE_2';
    } else if (binaryToFloat(currentNum) > 10 && currentSubFlag !== 'SCORE_10') {
      currentSubFlag = 'SCORE_10';
    }
    setCurrentTarget(binaryToFloat(currentNum));
  }, [currentNum])

  React.useEffect(() => {
    myUnityContext?.send(
      "CrashManager",
      "GetStateFromJavascript",
      JSON.stringify({
        strState: flag,
        strSubState: currentSubFlag
      })
    );
  }, [flag, currentSubFlag, unityLoading]);

  return (
    <div className="crash-container">
      <div className="canvas">
        <Unity unityContext={myUnityContext} matchWebGLToCanvasSize={true} />
      </div>
      <div className="crash-text-container">
        {GameState === "BET" ? (
          <div className={`crashtext wait font-9`}>
            <div className="rotate">
              <img
                width={100}
                height={100}
                src={propeller}
                alt="propellar"
              ></img>
            </div>
            <div className="waiting-font">WAITING FOR NEXT ROUND</div>
            <div className="waiting">
              <div
                style={{ width: `${((5000 - waiting) * 100) / 5000}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className={`crashtext ${GameState === "GAMEEND" && "red"}`}>
            {GameState === "GAMEEND" && (
              <div className="flew-away">FLEW AWAY!</div>
            )}
            <div>
              {`${binaryToFloat(currentNum) === -1 ? '1.00' : binaryToFloat(currentNum)?.toFixed(2)}`}
              <span className="font-[900]">x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}