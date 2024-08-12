import { createContext, useContext, useState } from "react";
import { AuthContext } from "./authContext";
import { makeRequest } from "../axios";
import { useQuery } from "@tanstack/react-query";
const UserContext = createContext();
export const useUser = () => {
  return useContext(UserContext);
};
export const UserContextProvider = ({children}) => {
    const { currentUser: authUser } = useContext(AuthContext);
    const [CurrentUser, setCurrentUser] = useState(authUser)
    const { isPending, isError } = useQuery({
        queryKey: ['currentuser', authUser,setCurrentUser],
        queryFn: () => makeRequest.get('/users/find/' + authUser.id).then(res => {
            setCurrentUser(res.data);
            return res.data;
        }),
    });
    return (
            <UserContext.Provider value={{ CurrentUser, isPending, isError }}>
                {children}
            </UserContext.Provider>
    );
}