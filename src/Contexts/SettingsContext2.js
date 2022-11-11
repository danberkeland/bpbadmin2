import React, { useState, createContext, useEffect } from "react";

import { grabLocationUsers } from "../Auth/AuthHelpers";

export const SettingsContext = createContext();


export const SettingsProvider = (props) => {
  const [user, setUser] = useState();
  const [formType, setFormType] = useState();
  const [userDetails, setUserDetails] = useState({
    userName: "",
    sub: "",
    locName: "",
    locNick: "",
    authType: "",
  });
  const [authType, setAuthType] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false)


  return (
    <SettingsContext.Provider
      value={{
        userDetails,
        setUserDetails,
        user,
        setUser,
        formType,
        setFormType,
        authType,
        setAuthType,
        isLoading,
        setIsLoading
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

/*
cognitoUser
ddbUser
userLocation
userLocationAuth
*/

