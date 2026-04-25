import {useState, useEffect, useContext, createContext} from "react";
import axios from "axios";
const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parsedData = JSON.parse(data);
            return {
                user: parsedData.user,
                token: parsedData.token
            };
        }
        return {
            user: null,
            token: ""
        };
    });

    useEffect(() => {
        // Update axios header
        axios.defaults.headers.common['Authorization'] = auth?.token;
        
        // Update localStorage whenever auth changes and has a token
        if (auth?.token) {
            localStorage.setItem("auth", JSON.stringify(auth));
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hooks

const useAuth = () => {
   return useContext(AuthContext);
}

export {AuthProvider, useAuth};

