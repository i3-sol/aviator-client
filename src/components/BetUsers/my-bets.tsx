import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";

import Context from "../../context";
import { SeedModal } from "../Main/seedModal";

const MyBets = () => {
  const { state, userInfo } = React.useContext(Context);

  const [modalParam, setModalParam] = useState({
    modalState: false,
    flyDetailId: ''
  });

  const handleGetSeed = async (flyDetailId) => {
    setModalParam({
      modalState: true,
      flyDetailId
    });
  }

  const displayDate = (num: number) => {
    let displayData = '';

    if (num === 0) {
      displayData = '00';
    } else if (num < 10) {
      displayData = `0${num}`
    } else {
      displayData = `${num}`;
    }

    return displayData;
  }

  return (
    <>
      <div className="legend px-2 d-flex align-items-center w-100">
        <div className="date">Date</div>
        <div className="d-flex w-100">
          <span className="bet">Bet, {`${userInfo?.currency ? userInfo?.currency : "HKD"}`}</span>
          <span>X</span>
          <span className="cash-out">
            Cash out, {`${userInfo?.currency ? userInfo?.currency : "HKD"}`}
          </span>
        </div>
        <div className="tools h-100"></div>
      </div>
      <div className="cdk-virtual-scroll-viewport scroll-y">
        <div className="cdk-virtual-scroll-content-wrapper">
          {state &&
            state.myBets.map((user, key) => (
              <div
                className={`bet-item pr-2 ${user.cashouted ? "celebrated" : ""
                  }`}
                key={key}
              >
                <div className="date">
                  {`${displayDate(new Date(user.createdAt).getHours())}:${displayDate(new Date(user.createdAt).getMinutes())}`}
                </div>
                <div className="bet">{Number(user.betAmount).toFixed(2)}</div>
                {user.cashouted ? (
                  <div className="multiplier-block">
                    <div
                      className={`bubble ${user.cashouted && "font-weight-bold"} opacity-${100 - 2 * key} ${Number(user.cashoutAt) < 2
                        ? "blue"
                        : Number(user.cashoutAt) < 10
                          ? "purple"
                          : "big"
                        }`}
                    >
                      {Number(user.cashoutAt).toFixed(2)}x
                    </div>
                  </div>
                ) : (
                  <div className="multiplier-block">
                    <div
                      className={`bubble opacity-${100 - 2 * key}}`}
                    >
                      {(user.flyAway).toFixed(2)}x
                    </div>
                  </div>
                )}
                <div className="cash-out">
                  {user.cashouted
                    ? Number(user.betAmount * user.cashoutAt).toFixed(2)
                    : ""}
                </div>
                <div className="tools">
                  <div onClick={() => handleGetSeed(user.flyDetailID)} className="fairness-i"></div>
                  <div className="share-i" onClick={() => { copy(`${user.flyDetailID}`); toast.success('Copied for Fly ID!') }}></div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {modalParam.modalState && <SeedModal setModal={setModalParam} modalParam={modalParam} />}
    </>
  );
};

export default MyBets;
