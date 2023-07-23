import React, { useState, useEffect } from 'react';
import '../style/chats.css';
import sendIcon from '../icon/sendMessage.png';
import axios from '../api/axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";

const MESSAGE_URL = '/msg';

function Chats({ projects }) {
    const axiosPrivate = useAxiosPrivate();
    const { currUser } = useAuth();

    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState("");
    const [currentProject, setCurrentProject] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [projId, setProjId] = useState(null);
    const [send, setSend] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const newSocket = io.connect('https://task-master-evop.onrender.com');
        //const newSocket = io.connect('http://localhost:3500');
        setSocket(newSocket);

        newSocket.on("connected", () => setSocketConnected(true));
        newSocket.on("typing", () => setIsTyping(true));
        newSocket.on("stop typing", () => setIsTyping(false));

        // Cleanup function to disconnect socket on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSender = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/users",
                    {
                      signal: controller.signal,
                    }
                );
                const currentUser = data.filter((item) => (item.username === currUser));
                if (isMounted) {
                    setSend(currentUser[0]._id);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getSender();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    const joinRoom = (room) => {
        socket.emit("join_room", room);
        setRoom(room);
    }

    const selectProject = (proj) => {
        if (proj !== currentProject) {
            setCurrentProject(proj);
            setProjId(proj._id);
            joinRoom(proj._id);
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSavedMessages = async () => {
            try {
                const { data } = await axiosPrivate.get(
                    "/messages",
                    {
                      signal: controller.signal,
                    }
                );
                console.log(`Length of data: ${data.length}`);
                const projectMessages = data.filter((item) => (item.room === room));
                if (isMounted) {
                    setMessageList(projectMessages);
                    console.log(`Message length: ${messageList.length}`);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getSavedMessages();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [room])

    const sendMessage = async () => {
        if (currentMessage !== "" && room !== "") {
            socket.emit("stop typing", projId);
            const time = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes();
            const messageData = {
                room: room,
                owner: currUser,
                message: currentMessage,
                time: time
            };
            try {
                const response = await axios.post(MESSAGE_URL,
                    JSON.stringify({ projId, currUser, currentMessage, time }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            } catch (err) {
                console.log(err);
            }
            setProjId(null);
            setSend(null);
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on("receive_message", (data) => {
                setMessageList((list) => [...list, data]);
            });
        }
    }, [socket]);

    const typingHandler = (e) => {
        setCurrentMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", projId);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", projId);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <div className="chats--container">
            <div className="chats--left">
                {projects?.map((project, i) => (
                <div key={i}>
                    <button 
                        className={project === currentProject ? "chats--group--on" : "chats--group--off"}
                        onClick={() => selectProject(project)}
                    >
                        {project.name}
                    </button>
                </div>
                ))}
            </div>
            <div className="chats--right">
                <div className="chats--header">
                    {currentProject?.name}
                </div>
                <div className="chats--body">
                    <ScrollToBottom className="chats--msg--container"> 
                        {messageList?.map(msg => (
                            <div className={msg.owner === currUser ? 'chats--entry--left' : 'chats--entry--right'}>
                                <div className="chats--name">{msg.owner}</div>
                                <div className="chats--msg"> {msg.message}</div>
                                <div className="chats--time">{msg.time}</div>
                            </div>
                        ))}
                    </ScrollToBottom>
                    {isTyping ? (
                        <div>
                            <Lottie
                                className="typing"
                                loop
                                autoplay
                                animationData={animationData}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="chats--footer">
                    <input 
                        type="text" 
                        placeholder='Message' 
                        value={currentMessage}
                        onChange={typingHandler}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button className='chats--button' style={{marginLeft:"10px"}} onClick={sendMessage}>
                        <img src={sendIcon} alt="Send" className="chats--send"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chats;