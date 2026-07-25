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
import { getAccountById } from "../firebase/database.js";

//Stores data about the current user 
const AuthContext = createContext();

//Wraps all components that need access to data in the context
export function AuthProvider({ children }) {

    //Store current user information in state
    const [currentUser, setCurrentUser] = useState(null); //The Firebase Auth user object
    const [account, setAccount] = useState(null); //The account information in realtime database (name, email, photoURL)

    //Loads the account information from the database and sets it in state
    async function loadAccount(uid) {
        const accountData = await getAccountById(uid);
        setAccount(accountData);
        return accountData;
    }

    //Runs the code when the AuthProvider component is mounted
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setCurrentUser(user);
                setAccount(null); // Clear account state when user changes

                //if the user is logged in, load their account information
                if (user) {
                    loadAccount(user.uid);
                }
            }
        );

        return unsubscribe;

    }, []);


    return (
        <AuthContext.Provider value={{ currentUser, account, setAccount, loadAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

//Allows components to access the context
export function useAuth() {
    return useContext(AuthContext);
}
