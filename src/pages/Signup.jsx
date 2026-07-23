/* The signup page */

/*
The signup page
*/
import { useState } from "react";
import { signup } from "../firebase/auth.js";
import { createAccount } from "../firebase/database.js";

function Signup({ setPage }) {

    //all vars 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //handles signup 
    async function handleSignup() {
        try {
            const user = await signup(email, password);

            //save data to database
            await createAccount(
                user.uid,
                {
                    name: name,
                    email: email,
                    photoURL: "https://i.pravatar.cc/150?img=12" //dummy url for now
                }
            );

            console.log("Account created successfully");
        } catch (error) {
            console.error(error);
        }
    }  

    return (
        <div>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)}  />
            <button onClick={handleSignup}>  Sign Up </button>

            <p> Already have an account? </p>
            <button onClick={() => setPage("login")}> Login </button>

        </div>
    );
}

export default Signup;