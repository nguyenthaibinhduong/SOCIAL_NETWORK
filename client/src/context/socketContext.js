import { createContext, useContext, useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import { AuthContext } from "./authContext";
const SocketContext = createContext();
export const useSocket = () => {
    return useContext(SocketContext);
}
export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const [onlineUsers, setonlineUsers] = useState([]);
    const {currentUser} = useContext(AuthContext);
    useEffect(() => {
        socket.current = io(process.env.REACT_APP_API_URL);

        if (currentUser) {
            socket.current.emit("addUser", currentUser.id);

            socket.current.on("getUsers", (users) => {
                setonlineUsers(users);
            });
        }

        return () => {
            socket.current.disconnect();
        };
    }, [currentUser]);
    return (
        <SocketContext.Provider value={{ socket:socket.current, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}
