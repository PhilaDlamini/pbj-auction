/* 
A container for the authentication context
Provides the current user to the rest of the app
*/

import { 
    createContext, 
    useContext, 
    useEffect, 
    useState 
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth";

//Stores data about the current user 
const AuthContext = createContext();

//Wraps all components that need access to data in the context
export function AuthProvider({ children }) {

    //the data stored in the context is the current user
    const [currentUser, setCurrentUser] = useState(null);

    //Runs the code when the AuthProvider component is mounted
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setCurrentUser(user);
            }
        );

        return unsubscribe;

    }, []);


    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

//Allows components to access the context
export function useAuth() {
    return useContext(AuthContext);
}