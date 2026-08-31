// Axios is a popular JavaScript library used to send
// HTTP requests (like GET, POST, PUT, DELETE) from a browser to a backend server.

import axios from 'axios' ;

const api_base_url = '/api/v1' ;

// axios.create crates the axios client 
const api = axios.create({

    baseURL : api_base_url , // Prepended to every request URL
    withCredentials : true , // adds cookie to every outgoing request
    headers : {
        'Content-Type' : 'application/json' ,
    } ,

})

// Runs before every outgoing request.
// but we dont need this for adding accesstoken 
// becaue cookies are http only so js cant read it 
// with credentials will handle it 
// api.interceptors.request.use((config) => {

// })

// Cookie-based JWT
//       ↓
// withCredentials: true
//       ↓
// Browser sends accessToken cookie
//       ↓
// verifyJWT reads req.cookies.accessToken

// "Whenever api receives a response, run this code first."

// Backend response
//        ↓
//  ┌─────┴─────┐
//  ↓           ↓
// Success     Error
//  ↓           ↓
// return      handle 401
// response
api.interceptor.response.use(()=>{

    // its 2xx resp , so no need to do anything let it pass 
    (response) =>{
        return response
    } ,

    async (error) =>{

        // suppose we made api.get("/users/profile");
        // and it failed at the backend and it send 4xx 
        const originalRequest = error.config ; // GET /users/profile

        // the reason we save it because we may want to retry it 


        // check for 401 - unauthorized 

        // only handle 401 errors
         if(error.response?.status !== 401 
            || originalRequest._retry // to avoid infinite loop
            ||  originalRequest.url?.includes("/users/refresh-token")  // if this was our original req , no need to try again
         )
         {
            return Promise.reject(error) ;
         }

        originalRequest._retry = true ;

         try {

            await api.post('/users/refresh-token') ;
             // the backend will now send a new access token 

             // retry the original query 
            return api(originalRequest) ;

            
         } catch (refreshError) {
            // refresh token is invalid 

            return Promise.reject(refreshError) ;
         }
    }

}) ;


// LOGIN
//   │
//   ▼
// Backend generates
// accessToken + refreshToken
//   │
//   ├──────────────┐
//   ▼              ▼
// Browser         Database
// cookies  
// (both token)   (refreshToken)
//   │
//   │
//   ▼
// Normal API request
//   │
//   ▼
// accessToken valid?
//   │
//   ├── YES → request succeeds
//   │
//   └── NO → 401
//             │
//             ▼
//        /refresh-token
//             │
//             ▼
//     Browser automatically
//     sends refreshToken cookie
//             │
//             ▼
//        Backend verifies
//             │
//             ├── JWT valid?
//             │
//             ├── User exists?
//             │
//             └── Token == DB token?
//             │
//             ▼
//        Generate NEW tokens
//             │
//             ▼
//        Update DB refreshToken
//             │
//             ▼
//        Set NEW cookies
//             │
//             ▼
//        Retry original request