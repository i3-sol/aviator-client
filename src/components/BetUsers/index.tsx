import React, { useEffect } from "react";
import AllData from "./all-data";
import MyBets from "./my-bets";
import TopHistory from "./top-history";
import Context from "../../context";
import { BettedUserType, UserType } from "../../utils/interfaces";

export default function BetsUsers() {
  const { previousHand, bettedUsers, getMyBets } = React.useContext(Context);

  const [headerType, setHeaderType] = React.useState("all");
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [allData, setAllData] = React.useState<UserType[] | BettedUserType[]>(
    []
  );
  const [pre, setPre] = React.useState(false);

  const header = [
    { type: "all", value: "All Bets" },
    { type: "my", value: "My Bets", onClick: "myBet" },
    { type: "top", value: "Top" },
  ];

  const getData = (e) => {
    if (e === "myBet") getMyBets();
  };

  React.useEffect(() => {
    if (pre) {
      setAllData(previousHand);
    } else {
      if (!!bettedUsers.length) setAllData(bettedUsers);
    }
  }, [pre, bettedUsers, previousHand]);

  useEffect(() => {
    let flag = false;
    if (allData.length !== bettedUsers.length) {
      flag = true;
    } else {
      for (let i = 0; i < allData.length; i++) {
        let perItem: any = { ...allData[i] };
        if (
          perItem?.name !== bettedUsers[i].name ||
          perItem?.betAmount !== bettedUsers[i].betAmount ||
          perItem?.cashOut !== bettedUsers[i].cashOut
        ) {
          flag = true;
          break;
        }
      }
    }
  }, [allData, bettedUsers]);

  return (
    <div className="info-board">
      <div className="bets-block">
        <div className="bet-block-nav">
          <div style={{ height: "24px" }}>
            <div className="navigation-switcher">
              {header.map((item, index) => (
                <button
                  key={index}
                  className={`tab ${headerType === item.type ? "click active" : "inactive"
                    }`}
                  onClick={() => {
                    setHeaderType(item.type);
                    item.onClick && getData(item.onClick);
                  }}
                >
                  {item.value}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="data-list">
          {headerType === "all" ? (
            <AllData
              setPre={setPre}
              pre={pre}
              allData={allData}
            />
          ) : headerType === "my" ? (
            <MyBets />
          ) : (
            <TopHistory />
          )}
        </div>
        <div className="bets-footer">
          <div className="provably-fair-block">
            <span>This game is </span>
            <div className="provably-fair" onClick={() => setShowModal(true)}>
              <div className="i-fair"></div>
              <span className="text-provably-fair">Provably Fair</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal provably-fair">
          <div onClick={() => setShowModal(false)} className="back"></div>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-title">WHAT IS PROVABLY FAIR?</span>
                <button className="close" onClick={() => setShowModal(false)}>
                  <span>x</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-body modal-bottom-radius">
                  <div className="d-flex justify-content-center mb-1">
                    <div className="fairness-i"></div>
                  </div>
                  <div className="text-center mt-2 mb-1 text-white text-center">
                    <span> Provably Fair - 100% FAIR GAME </span>
                  </div>
                  <div className="top-text description p-2 my-3">
                    <span>"Aviator" is based on cryptographic technology called "Provably Fair". This technology guarantees 100%
                      fairness of  result. With this technology, it's impossible for any third party to interfere in game process.</span>
                  </div>
                  <div className="text-center text-uppercase text-white"> How it works </div>
                  <div className="text-white">Quick explanation:</div>
                  <div className="description mt-2">
                    Result of each round ( Game's "Fly away" multiplier ) is not generated on our servers. It's generated with help of round players and is
                    fully transparent. This way, it's impossible for anyone to manipulate game output. Also, anyone can check and
                    confirm game fairness </div>
                  <div className="mt-3 text-white">More information:</div>
                  <div className="description mt-2"> Round result is generated from four independent participants of the round: game operator and first 3 betters of the round. Operator is
                    generating server seed (random 16 symbols). Hashed version of this server seed is available publicly before
                    round starts (In user menu, check
                    "Provably Fair Settings" and then "Next server seed SHA256") Client seed is
                    generated on the side of each player
                    and when round starts first 3 betters are participating in generating round
                    result. </div>
                  <div className="description mt-2"> When round starts, game merges server seed
                    with three client
                    seeds. From merged symbols is generated SHA512 hash, and from this hash
                    - game result. </div>
                  <div className="d-flex justify-content-center my-4">
                    <div className="pf-scheme"></div>
                  </div>
                  <div className="text-center text-uppercase text-white"> How to check </div>
                  <div className="description mt-4">
                    <div>- You can check fairness of
                      each round from game history, by clicking on green
                      icon.
                    </div>
                    <div>- In opened window, you will
                      see server seed, 3 pair of players seeds, combined
                      hash
                      and round result.</div>
                    <div> - Hashed version of next
                      rounds server seed is available publicly in settings
                      window
                      (In user menu, check "Provably Fair Settings" and
                      then "Next server seed SHA256"). You can also change
                      your
                      client seed here. </div>
                    <div>- If you want to participate
                      in round result generation, make sure you are
                      between
                      first 3 players who make bet in that round.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {false && (
        
      )} */}
    </div>
  );
}
