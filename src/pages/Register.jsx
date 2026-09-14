import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Link ,  useNavigate } from "react-router-dom";

function Register(){

    const navigate = useNavigate() ;
    const {register} = useContext(AuthContext) ;

    const [form , setForm] = useState({
        fullname:"" ,
        username:"",
        email:"",
        password:"",
    })

    const [avatar , setAvatar] = useState(null) ;
    const [coverimage , setCoverImage] = useState(null) ;
    const [submitting , setSubmitting] = useState(false) ;
    const [error , setError] = useState(null) ;

    const handlechange= (e) => {

        setForm({
            ...form ,
            [e.target.name] : e.target.value 
        }) ;
    }


    const handlesubmit = async (e) =>{
        e.preventDefault() ;

        setError(null) ;

        if(!avatar)
        {
            setError("an avatar image is required") ; 
            return ;

        }

        setSubmitting(true) ;

        try{
            const formdata = new FormData() ;
            Object.entries(form).forEach(([key, value]) => formdata.append(key, value)) ;

            formdata.append("avatar" , avatar) ;
            if(coverimage) formdata.append("coverImage" , coverimage) ;

            await register(formdata) ;
            navigate("/login") ;
        } catch(error){

            setError(error.response?.data?.message || "could not create the account") ;
        } finally{
            setSubmitting(false) ;
        }

        
    }



    return (
        <div>
            <h1>Create Yout Account</h1>
            <p>Join youtube and start watching</p>

            <form onSubmit={handlesubmit}>

                <div>
                    <label htmlFor="fullname">Full Name</label>
                    <input type="text"
                        name="fullname"
                        value={form.fullname}
                        onChange={handlechange}
                        placeholder="priya nair"
                    />
                </div>

                <div>
                    <label htmlFor="username">User Name</label>
                    <input type="text"
                        name="username"
                        value={form.username}
                        onChange={handlechange}
                        placeholder="priya_nair"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                        name="email"
                        value={form.email}
                        onChange={handlechange}
                        placeholder="priya@gmail.com"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password"
                        name="password"
                        value={form.password}
                        onChange={handlechange}
                        placeholder="********"
                    />
                </div>


                <div>
                    <label htmlFor="avatar">Avatar(required)</label>
                    <input type="file"
                        name="avatar"
                       
                        onChange={(e) => setAvatar(e.target.files[0])}
                        
                    />
                </div>

                <div>
                    <label htmlFor="coverimage">Cover Image(optional)</label>
                    <input type="file"
                        name="coverimage"
                       
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        
                    />
                </div>

                 {/* showing error */}
                {error && <p>{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                >{submitting ? "creating acc" : "sign up"}</button>


            </form>

            <p>Already have an account
                <Link to="/login">Log in</Link>
            </p>
        </div>
    )

} ;


export default Register ;