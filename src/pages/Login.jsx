import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom"


export function Login(){

    const navigate = useNavigate() ;

    const { login } = useContext(AuthContext) ;
    const [form , Setform ] = useState({email:"" , username:"" , password:""}) ;
    const [error , setError ] = useState("");
    const [submitting , SetSubmitting] = useState(false) ;

    const  handleSubmit = async (e) => {
        e.preventDefault() ;
        setError("") ;
        SetSubmitting(true) ;

        try {
            await login(form) ;
            //navigate
            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "could not login. check your details ")
        } finally {
            SetSubmitting(false) ;
        }
    } ;

    const handleChange = (e)=>{

        Setform({...form , [e.target.name]: e.target.value})
    }


    return (

        <div>
            <h1>Log in</h1>
            <p>Welcome back</p>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email" 
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        name="username" 
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Optional if email is filled"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                </div>

                {error && <p>{error}</p>} 

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Logging in ..." : "Log in"}
                </button>

            </form>

            <p>
                New Here ?{" "} 
                <Link to="/users/register">
                Sign Up
                </Link>
            </p>
        </div>
    );
}