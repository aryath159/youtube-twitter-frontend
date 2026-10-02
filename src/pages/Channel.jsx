import {useEffect , useState } from "react" ;
import { useParams } from "react-router-dom";
// usestae stores channel , videos , loading state

// useeffect - fetch channel data and videos

import {GetProfile} from "../api/auth.js" ;
import { toggleSubscription } from "../api/subscription.js";
import { getAllVideos } from "../api/video.js";

//authentication
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import VideoCard from "../components/VideoCard";


function Channel() {

    const username = useParams() ;
    const {user} = useContext(AuthContext) ;

    const [channel , setChannel] = useState(null) ;

    const [videos , setvideos] = useState([]) ;

    const [loading , setloading] = useState(true) ;

    
    useEffect(() => {
        // frist set loading true
        setloading(true) ;

        GetProfile(username)
        .then((res) => {
            const data = res.data.data ;
            setChannel(data) ;
            return getAllVideos({userId: data._id}) ;
        })
        .then((res)=>{
            setvideos(res?.data?.data?.docs || res?.data?.data || []) ;
        })
        .catch(() => setChannel(null))
        .finally(() => setloading(false)) ;


    } , [username]) ;


    const handleSubscribe = async ()=>{

        try {
            await toggleSubscription(channel._id) ;
            // update the ui 

            setChannel((currentchannel) => ({
                ...currentchannel , 
                isSubscribed: !currentchannel.isSubscribed ,

                subscibersCount : 
                    currentchannel.isSubscribed
                        ? currentchannel.subscibersCount - 1
                        : currentchannel.subscibersCount + 1 
            })) ;
            
        } catch (error) {
            console.log("subscription error" , error) ;
        }
    };

//loading sate
    if(loading){
        return(
            <p className="px-4 py-10 text-center text-sm text-muted">
                Loading...
            </p>            
        );
    }

    // if channel not found
    if(!channel){
        return (
             <p className="px-4 py-10 text-center text-sm text-muted">
                Channel not found.
            </p>           
        );
    }

//channel page
  return (
    <div>
        
        {/* cover image */}

        <div className="h-40 w-full overflow-hidden bg-line sm:h-56">
            {
                channel.coverImage && (
                    <img
                        src={channel.coverImage}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                )
            }
        </div>

        {/* channel infoemation */}

        <div className="mx-auto max-w-6xl px-4">

            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">

                <div className="flex items-end gap-4">

                    {/* channel avatar */}

                    <img
                            src={channel.avatar}
                            alt=""
                            className="h-20 w-20 rounded-full border-4 border-cream object-cover"
                    />

                    {/* channel name and subscribers */}

                    <div>
                        <h1 className="font-display text-xl font-semibold">
                                {channel.fullname}
                        </h1>

                        <p>
                            @{channel.username}
                            {" . "}
                            {channel.subscribercount} subscribers
                        </p>
                    </div>

                </div>

                {/* subscriber button */}

                {user && user.username !== channel.username && (
                    <button
                        onClick={handleSubscribe}
                        className={
                            `rounded-sm px-4 py-1.5 text-sm font-medium ${
                                    channel.isSubscribed
                                        ? "border border-line text-ink"
                                        : "bg-leaf text-white hover:opacity-90"
                                }`
                        }
                    >
                        {
                            channel.isSubscribed ? "Subscibed" : "Subscribe"
                        }

                    </button>
                )}
            </div>


            {/* videos */}

            <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 pb-10 sm:grid-cols-2 lg:grid-cols-4">
                {videos.length === 0 ? (
                    <p className="text-sm text-muted">
                        no videos yet
                    </p>
                ) : (
                    videos.map((video) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                        />

                        
                    ))
                ) }


            </div>
        </div>
    </div>
  ) ;
  
}

export default Channel
