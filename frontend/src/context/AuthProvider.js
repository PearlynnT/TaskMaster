import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
    const [currUser, setCurrUser] = useState('');
    const [notification, setNotification] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');

    return (
        <AuthContext.Provider 
            value={{ 
                auth, 
                setAuth, 
                persist, 
                setPersist, 
                currUser, 
                setCurrUser, 
                notification, 
                setNotification,
                selectedRoom,
                setSelectedRoom,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;