import React, { useState, useEffect } from 'react';
import '../style/chats.css';
import sendIcon from '../icon/sendMessage.png';
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chats( { projects }) {
    const { currUser } = useAuth();
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState("");
    const [currentProject, setCurrentProject] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        const newSocket = io.connect('http://localhost:3500');
        setSocket(newSocket);

        // Cleanup function to disconnect socket on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const joinRoom = (room) => {
        socket.emit("join_room", room);
        setRoom(room);
    }

    const selectProject = (proj) => {
        if (proj !== currentProject) {
            setCurrentProject(proj);
            joinRoom(proj._id);
            alert(`Alert is for testing\nJoined chat room ${proj._id}`);
            setMessageList([]);
        }
    }

    const sendMessage = () => {
        if (currentMessage !== "" && room !== "") {
            const messageData = {
                room: room,
                owner: currUser,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
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
                </div>
                <div className="chats--footer">
                    <input 
                        type="text" 
                        placeholder='Message' 
                        value={currentMessage}
                        onChange={(event) => {
                            setCurrentMessage(event.target.value)
                        }}
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