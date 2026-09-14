
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

export const UpdateAccDetails = (data)=>{
    return api.post("/users/update-account" , data) ;
};

export const updateAvatar = (file) =>{
    const formdata = new FormData() ;
    formdata.append("avatar" ,file) ;

    return api.patch("/users/avatar" , formdata , 
        {
            headers : {
                "Content-Type" : "multipart/formdata"
            }
        }
     )
};

export const UpdateCoverImage = (file)=>{
    const formdata = new FormData() ;

    formdata.append("coverImage" , file) ;

    return api.patch("/users/cover-image" , formdata , 
        {
            headers :{ "Content-Type" : "multipart/formdata"}
        }
    )
};

export const changePassword = (data) =>{

    return api.post("/users/change-password" , data) ;
};

export const GetProfile = (name)=>{
    return api.get(`/users/c/:${name}`);
} ;

export const getWatchHistory = ()=>{
    return api.get("/users/history") ;
}
