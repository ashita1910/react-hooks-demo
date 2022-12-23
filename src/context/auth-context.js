import { createContext, useState } from "react";

const AuthContext = createContext({
  isAuth: false,
  login: () => {},
});

export function AuthContextProvider(props) {
  const [auth, setAuth] = useState(false);

  const authContext = {
    isAuth: auth,
    login: loginUser,
  };

  function loginUser() {
    setAuth(true);
  }

  return (
    <AuthContext.Provider value={authContext}>
      {props?.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
