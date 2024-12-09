import React, { createContext, useReducer } from "react";
import { USER_DETAILS } from "./type";
import { USER_DETAILS_REDUCER_ACTION, userDetailsReducer } from "./reducer";

interface userDetailsContextType {
  userDetails: USER_DETAILS;
  dispatchUserDetails: React.Dispatch<USER_DETAILS_REDUCER_ACTION>;
}
export const UserDetailsContext = createContext<userDetailsContextType>({
  userDetails: {},
  dispatchUserDetails: () => {},
});

interface UserProviderProps {
  children: JSX.Element;
}
export const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [userDetails, dispatchUserDetails] = useReducer(userDetailsReducer, {});
  return (
    <UserDetailsContext.Provider value={{ userDetails, dispatchUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
};
