import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import "/public/css/common.css";
import "/public/css/style.css";

let namespaceSocket = null;

function Index() {
    const [pvs, setPvs] = useState([]);
    const [user, setUser] = useState({});
    const [receiver, setReceiver] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const userInfo = await authenticateUser();
            if (!userInfo) {
                return navigate("/auth");
            }

            setUser(userInfo);

            const socketIo = io("http://localhost:3000");
            socketIo.on("connect", () => {
                socketIo.on("private-chats", pvs => setPvs(pvs))
            })
        })()
    }, [])

    async function authenticateUser() {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }

        const response = await fetch("http://localhost:3000/api/v1/auth", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return false;
        }

        const userInfo = await response.json();
        return userInfo.payload;
    };

    useEffect(() => {
        if (!namespaceSocket) {
            return;
        }

        namespaceSocket.on("confirm-message", showMessage);

    }, [namespaceSocket])

    const showMessage = data => setMessages(prevMessages => [...prevMessages, data]);

    const joinChat = receiver => {
        setReceiver(receiver);
        setMessage("");

        namespaceSocket = io("http://localhost:3000/pvs");
        const data = {
            sender: user.name,
            receiver
        };

        namespaceSocket.emit("join", data);
    };

    const sendMessageHandler = event => {
        event.preventDefault();

        const messageValue = message.trim();
        if (!messageValue || !receiver) {
            return;
        }

        sendMessage(messageValue)
    };

    const sendMessage = message => {
        const data = {
            message,
            pv: {
                sender: user.name,
                receiver
            }
        };

        namespaceSocket.emit("send-message", data);
        setMessage("");
    }

    const removeMessage = id => {
        namespaceSocket.emit("remove-message", id);
    };

    useEffect(() => {
        if (!namespaceSocket) {
            return;
        }

        namespaceSocket.on("confirm-remove-message", removeMessageFromDom);

    }, [namespaceSocket])

    const removeMessageFromDom = messageId => {
        setMessages(prevMessages => prevMessages.filter(message => message.messageId !== messageId))
    };

    return (
        <main className="main">
            <section className="costom-row">
                <div className="costom-col-3">
                    <section className="sidebar">
                        <div className="sidebar__categories">
                            <ul className="sidebar__categories-list">
                                <li
                                    className="sidebar__categories-item sidebar__categories-item--active"
                                    data-category-name="all"
                                >
                                    <span className="sidebar__categories-text">Pvs</span>
                                    {/* <span className="sidebar__categories-counter sidebar__counter">3</span> */}
                                </li>
                            </ul>
                        </div>
                        <div className="sidebar__contact data-category-all sidebar__contact--active">
                            <ul className="sidebar__contact-list">
                                {pvs.map(pv => pv.name !== user.name ? (
                                    <li className="sidebar__contact-item" key={pv._id} onClick={() => joinChat(pv.name)}>
                                        <a className={receiver === pv.name ? "sidebar__contact-link sidebar__contact-link--selected" : "sidebar__contact-link"} href="#">
                                            <div className="sidebar__contact-left">
                                                <div className="sidebar__contact-left-left">
                                                    <img
                                                        className="sidebar__contact-avatar"
                                                        src="/images/fav.webp"
                                                    />
                                                </div>
                                                <div className="sidebar__contact-left-right">
                                                    <span className="sidebar__contact-title">
                                                        {pv.name}
                                                    </span>
                                                    <div className="sidebar__contact-sender">
                                                        <span className="sidebar__contact-sender-name">
                                                            Qadir Yolme :
                                                        </span>
                                                        <span className="sidebar__contact-sender-text">
                                                            سلام داداش خوبی؟
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sidebar__contact-right">
                                                <span className="sidebar__contact-clock">15.53</span>
                                                <span className="sidebar__contact-counter sidebar__counter sidebar__counter-active">
                                                    66
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                ) : "")}
                            </ul>
                        </div>
                    </section>
                    <button className="sidebar-bottom-btn btn-circle rp btn-corner z-depth-1 btn-menu-toggle">
                        <span className="tgico animated-button-icon-icon animated-button-icon-icon-first">
                            
                        </span>
                    </button>
                </div>
                <div className="costom-col-9 container-hide">
                    <section className="chat">
                        <div className={receiver ? "chat__header chat__header--active" : "chat__header"}>
                            <div className="chat__header-left">
                                <button className="btn-icon sidebar-close-button">
                                    <span className="tgico button-icon"></span>
                                    <span className="badge badge-20 badge-primary is-badge-empty back-unread-badge"></span>
                                </button>
                                <div className="chat__header-left-left">
                                    <img
                                        className="chat__header-avatar"
                                        src="public/images/fav.webp"
                                    />
                                </div>
                                <div className="chat__header-left-right">
                                    <span className="chat__header-name">{receiver}</span>
                                    <span className="chat__header-status">
                                        last seen recently
                                    </span>
                                </div>
                            </div>
                            <div className="chat__header-right">
                                <div className="chat__header-search icon-phone">
                                    <span className="tgico button-icon chat__header-phone-icon"></span>
                                </div>
                                <div className="chat__header-search">
                                    <i className="chat__header-search-icon fa fa-search"></i>
                                </div>
                                <div className="chat__header-menu">
                                    <i className="chat__header-menu-icon fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                        </div>
                        <div className={receiver ? "chat__content chat__content--active" : "chat__content"} style={{ position: "relative" }}>
                            <div className="chat__content-date">
                                <span className="chat__content-date-text"> Today </span>
                            </div>
                            <div className="chat__content-main" style={{ height: "74%", overflow: "auto",  }}>
                                {messages?.map(messageData => messageData.pv.sender === user.name ? (
                                    <div
                                        key={messageData.messageId}
                                        id={messageData.messageId}
                                        className="chat__content-receiver-wrapper chat__content-wrapper">
                                        <div className="chat__content-receiver">
                                            <span className="chat__content-receiver-text">{messageData.message}</span>
                                            <span className="chat__content-chat-clock">
                                                17:55 |
                                                <i className="fa fa-trash" style={{ cursor: "pointer", marginLeft: "3px" }} onClick={() => removeMessage(messageData.messageId)}></i>
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={messageData.messageId}
                                        id={messageData.messageId}
                                        className="chat__content-sender-wrapper chat__content-wrapper">
                                        <div className="chat__content-sender">
                                            <span className="chat__content-sender-text">{messageData.message}</span>
                                            <span className="chat__content-chat-clock">
                                                17:55 |
                                                <i className="fa fa-trash" style={{ cursor: "pointer", marginLeft: "3px" }} onClick={() => removeMessage(messageData.messageId)}></i>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat__content-bottom-bar" style={{ bottom: "5rem" }}>
                                <form
                                    className="chat__content-bottom-bar-left"
                                    style={{ overflow: "hidden", borderRadius: "1rem" }}
                                    onSubmit={sendMessageHandler}>
                                    <input
                                        className="chat__content-bottom-bar-input"
                                        placeholder="Message"
                                        type="text"
                                        value={message}
                                        onChange={event => setMessage(event.target.value)}
                                    />
                                    <i className="chat__content-bottom-bar-icon-left tgico button-icon laugh-icon"></i>
                                    <i className="chat__content-bottom-bar-icon-right tgico button-icon file-icon"></i>
                                </form>
                                <div className="chat__content-bottom-bar-right">
                                    <i className="chat__content-bottom-bar-right-icon fa fa-microphone"></i>
                                </div>
                                <div className="chat__content-bottom-bar-right">
                                    <span
                                        style={{
                                            backgroundColor: "var(--secondary-color)",
                                            top: "-37px",
                                            fontSize: "2.4rem",
                                            visibility: "hidden",
                                            opacity: "0",
                                        }}
                                        className="chat__content-bottom-bar-right-icon tgico button-icon arrow-bottom-icon__active"
                                    >
                                        
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}

export default Index;
