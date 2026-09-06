
import api from "./axios"



// register user function 
export const registerUser = ( formdata ) => {


    return api.post("/users/register" , formdata , 

        {
            headers : {"Content-Type" : "multipart/form-data" } ,
        }
    )

}; 


// loginuser function

export const loginUser = (data)=>{
    return api.post("/users/login" , data) ;
} ;



// logout user 
export const logoutUser = ()=>{
    return api.post("/users/logout") ;
} ;


//get current user

export const getCurrentUser = ()=>{
    return api.get("/users/current-user") ;
} ;




