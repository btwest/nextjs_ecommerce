//Creates a context to manage the state of a shopping cart.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useReducer,
} from "react";
import { AppReducer, initialState } from "./AppReducer";

// Creates the context. Will be used to provide and consume the app state.
const AppContext = createContext();

export function AppWrapper({ children }) {
  //Initializes the state and dispatch function
  const [state, dispatch] = useReducer(AppReducer, initialState);
  // Memoize the context value to optimize performance by preventing unnecessary re-renders.
  const sharedState = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // Loads state from local storage
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("mg-items"))) {
      dispatch({
        type: "load_items",
        value: JSON.parse(localStorage.getItem("mg-items")),
      });
    }
  }, []);

  //Maintains the state across renders/page loads
  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem("mg-items", JSON.stringify(state));
    }
  }, [state]);

  // Provides the sharedState (containing state and dispatch) to its children.
  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

// Defines a custom hook to more easily consume the context in other components.
export function useAppContext() {
  return useContext(AppContext);
}
