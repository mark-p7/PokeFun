import React, { useState } from "react";
  
export const Context = React.createContext();
export const ContextProvider = ({ children }) => {

    const [userStatus, setUserStatus] = useState({
        loggedIn: localStorage.getItem('token') ? true : false,
        isAdmin: localStorage.getItem('admin-token') ? true : false,
    });
  
    return (
        <Context.Provider value={{ userStatus, setUserStatus }}>
            {children}
        </Context.Provider>
    );
};