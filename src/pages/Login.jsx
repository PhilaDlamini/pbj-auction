/* The login page */
import { login } from "../firebase/auth.js";
import { useState } from "react";

function Login({ setPage }) {

    //All vars 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //handles login 
    async function handleLogin() {
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
        }
    }  

    return (
        <div>
            <h1>Login</h1>

            <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)}/>
            <button onClick={handleLogin}> Login</button>

            <p> Don't have an account? </p>
            <button onClick={() => setPage("signup")}> Create Account</button>

        </div>
    );
}

export default Login;