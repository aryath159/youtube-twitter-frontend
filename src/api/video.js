import api from "./axios"

// get all videos 
export const getAllVideos = (params = {}) => {
    return api.get("/videos" , {
        params : params 
    }) ;
}; 

export const getVideobyId = (videoId) => {
    return api.get(`/videos/v/${videoId}`) ;
} ;

export const uploadVideo = (formdata) => {

        return api.post("/videos" , formdata , 
            {
                headers :{ "Content-Type": "multipart/form-data" },
            }
        )
}

export const updateVideo = (videoId , formdata)=>{
    return api.patch(`videos/v/${videoId}` , formdata , 
        {
            headers : {"Content-Type" : "multipart/form-data" } ,
        }
    ) ;
}

export const deleteVideo = (videoId) =>{
    return api.delete(`/videos/v/${videoId}`) ;
}

export const togglePublishStatus = (videoId) => {
    return api.patch(`/videos/toggle/publish/${videoId}`) ;
}

/*

Why params is important

Your backend controller does:

const {
    page = 1,
    limit = 10,
    query,
    sortBy,
    sortType,
    userId
} = req.query

So your backend expects things like:

/videos?query=node
/videos?page=2
/videos?limit=20
/videos?sortBy=views&sortType=desc

Your frontend should therefore pass those values as Axios query parameters:

api.get("/videos", {
    params: params
});

For example:

getAllVideos({
    query: "node",
    page: 1,
    limit: 10
});

Axios will create something equivalent to:

GET /videos?query=node&page=1&limit=10

Your backend can then access:

req.query.query
req.query.page
req.query.limit

*/


/*
Your Home should use:

const query = searchParams.get("query") || "";

because your Navbar creates:

navigate(`/?query=${encodeURIComponent(trimmed)}`)

Then:

getAllVideos({ query })

becomes:

Home
 ↓
query = "node"
 ↓
getAllVideos({ query: "node" })
 ↓
Axios
 ↓
GET /videos?query=node
 ↓
Express route
 ↓
getAllVideos controller
 ↓
req.query.query = "node"

Your backend then does:

if(query){
    pipeline.push({
        $search:{
            index: "search-videos",
            text:{
                query: query,
                path: ["title", "description"]
            }
        }
    });
}

So the search architecture is correct.
*/
