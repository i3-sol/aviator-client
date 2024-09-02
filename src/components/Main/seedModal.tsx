import React, { useEffect, useState } from "react"
import CryptoJS from 'crypto-js';
import Context from "../../context";
import { Oval } from "react-loader-spinner";

export const SeedModal = ({ setModal, modalParam }: any) => {
    const { handleGetSeedOfRound } = React.useContext(Context);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [sha512Hash, setSha512Hash] = useState<string>('abcdef');
    const [seedDetails, setSeedDetails] = useState<any>();

    const getSeedDetails = async () => {
        setLoading(true);
        const data = await handleGetSeedOfRound(modalParam.flyDetailId);
        setLoading(false);
        setSeedDetails(data);
        const newDate = new Date(data.createdAt);
        const localTime = newDate.toLocaleTimeString([], { hour12: false });
        setDate(localTime);

        let combined_seed = data.serverSeed;
        for (let i = 0; i < data.seedOfUsers.length; i++) {
            combined_seed += data.seedOfUsers[i].seed
        }
        const hash_object = CryptoJS.SHA512(combined_seed).toString(CryptoJS.enc.Hex);
        setSha512Hash(hash_object);
    }

    useEffect(() => {
        getSeedDetails();
    }, [modalParam.flyDetailId])
    return (
        <div className={`modal ${modalParam.modalState && 'active'}`}>
            <div className="back" onClick={() => setModal({ modalState: false, flyDetailId: '' })}></div>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="modal-title">ROUND </span>
                        {seedDetails &&
                            <div className="header__info">
                                <div className={`bubble-multiplier ${Number(seedDetails?.target) < 2 ? "blue" : Number(seedDetails?.target) < 10 ? "purple" : "big"}`}>{Number(seedDetails?.target).toFixed(2)}x</div>

                                <div style={{ paddingLeft: '5px' }}>{date}</div>
                            </div>
                        }
                        <button className="close" onClick={() => setModal({ modalState: false, flyDetailId: '' })}>
                            <span>x</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="content-wrapper">
                            {loading ? <div className="content-loading">
                                <Oval
                                    height={35}
                                    width={35}
                                    color="red"
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel="oval-loading"
                                    secondaryColor="#990000"
                                    strokeWidth={3}
                                    strokeWidthSecondary={4}
                                />
                            </div> :
                                <div className="content">
                                    <div className="content-part">
                                        <div className="title">
                                            <div className="icon-server"></div>
                                            <div className="text">
                                                <span>Server Seed:</span>
                                                <div className="tip">Generated on our side</div>
                                            </div>
                                        </div>
                                        <div className="value">
                                            <input readOnly type="text" className="value-input" value={seedDetails?.serverSeed} />
                                        </div>
                                    </div>
                                    <div className="content-part pt-3">
                                        <div className="title">
                                            <div className="icon-client"></div>
                                            <div className="text">
                                                <span>Client Seed:</span>
                                                <div className="tip">Generated on players side</div>
                                            </div>
                                        </div>
                                        {seedDetails?.seedOfUsers?.map((user: any, key: number) => (
                                            <div className="client" key={key}>
                                                <div className="value">
                                                    <div className="player">
                                                        <span>Player N{key + 1}:</span>
                                                        <div className="user">
                                                            <img className="avatar" src={user.avatar} /> {user.userName.slice(0, 1) + '***' + user.userName.slice(-1)}
                                                        </div>
                                                    </div>
                                                    <div className="seed">
                                                        <span>Seed:</span>
                                                        <div className="seed-value">{`${user.seed}`}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="content-part pt-3">
                                        <div className="title">
                                            <div className="icon-hash"></div>
                                            <div className="text">
                                                <span>Combined SHA512 Hash:</span>
                                                <div className="tip">Above seeds combined and converted to SHA512 Hash. This is your game result</div>
                                            </div>
                                        </div>
                                        <div className="value">
                                            <input readOnly type="text" className="value-input" value={sha512Hash} />
                                        </div>
                                    </div>
                                    <div className="content-part pt-3 result">
                                        <div className="title">
                                            <span>Hex:</span>
                                            <span>Decimal:</span>
                                            <span>Result:</span>
                                        </div>
                                        <div className="value">
                                            <span className="white">{sha512Hash?.slice(0, 13)}</span>
                                            <span className="white">{parseInt(sha512Hash.slice(0, 13) || '', 16)}</span>
                                            <span className="white">{(seedDetails?.target)?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}