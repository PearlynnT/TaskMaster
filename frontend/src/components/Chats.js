import React, { useState, useEffect } from 'react';
import '../style/chats.css';
import sendIcon from '../icon/sendMessage.png';
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';

function Chats( { projects }) {
    const socket = io.connect('http://localhost:3500');
    const { currUser } = useAuth();
    const [room, setRoom] = useState("");
    const [currentProject, setCurrentProject] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const selectProject = (proj) => {
        if (proj !== currentProject) {
            setCurrentProject(proj);
            setRoom(proj._id);
            alert(`Alert is for testing\nJoined chat room ${proj._id} `);
            setMessageList([]);
        }
    }

    const sendMessage = async () => {
        if (currentMessage !== "" && room !== "") {
            const messageData = {
                room: room,
                owner: currUser,
                message: currentMessage,
                time: new Date(Date.now()).getHours() 
                + ":" + 
                new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
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
                    {messageList?.map(msg => (
                        <div className={msg.owner === currUser ? 'chats--entry--left' : 'chats--entry--right'}>
                            <div className="chats--name">{msg.owner}</div>
                            <div className="chats--msg"> {msg.message}</div>
                            <div className="chats--time">{msg.time}</div>
                        </div>
                    ))}
                </div>
                <div className="chats--footer">
                    <input 
                        type="text" 
                        placeholder='Message' 
                        value={currentMessage}
                        onChange={(event) => {
                            setCurrentMessage(event.target.value)
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