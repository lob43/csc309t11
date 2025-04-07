import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    useEffect(()=>{

        const checkAuth = async()=>{
            // console.log(localStorage.getItem("token"))
            if(!localStorage.getItem("token")){
                setUser(null)
            }else{
                const user = await fetch(`${BACKEND_URL}/user/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                
                if(Math.floor(user.status/100) == 4){
                    return user.statusText
                }
                
                const userData = await user.json()
                console.log(userData.user)
                setUser(userData.user)
            }
        }

        checkAuth()
        
    },[])



    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me

        localStorage.removeItem("token")
        setUser(null)

        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {

        const res = await fetch(`${BACKEND_URL}/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify({username,password})
        })


        if(Math.floor(res.status/100) == 4){
            return res.statusText
        }

        const data = await res.json()


        const user = await fetch(`${BACKEND_URL}/user/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
            }
        })

        if(Math.floor(user.status/100) == 4){
            return user.statusText
        }


        localStorage.setItem("token", data.token)

        const userData = await user.json()

        setUser(userData.user)

        navigate("/profile");
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {

        const res = await fetch(`${BACKEND_URL}/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(userData)
        })


        if(Math.floor(res.status/100) == 4){
            return res.statusText
        }
        
        navigate("/success");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
