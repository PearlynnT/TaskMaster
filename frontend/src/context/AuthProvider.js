import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
    const [currUser, setCurrUser] = useState('');

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist, currUser, setCurrUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;