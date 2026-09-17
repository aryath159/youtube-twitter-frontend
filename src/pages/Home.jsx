import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getAllVideos } from '../api/video.js';
import VideoCard from "../components/VideoCard.jsx"
//Used to read the search query from the URL.
import {useSearchParams } from 'react-router-dom' ;

function Home() {

  const [searchParams] = useSearchParams() ;
  const query = searchParams.get("query") || "" ;

//   URL
//  ↓
// /?query=node
//  ↓
// searchParams.get("query")
//  ↓
// "node"
//  ↓
// query

  // store videos received from backend 
  const [videos , setVideos] = useState([]) ;

  // Used to show "Loading videos..."
  // while API request is running
  const [ loading , setloding] = useState(true) ;

// run this code every time the query changes 
// this effect is for fetching videos 
  useEffect(()=>{
    setloding(true) ;

    getAllVideos({query})
    .then((res) => {
        // If API uses pagination,
        // videos will be inside "docs".
        //
        // Otherwise use res.data.data directly.

        setVideos(
          res.data.data.docs || res.data.data 
        ) ;

    })
    .catch(() =>{
      // if req fails show empty video list
      
      setVideos([]) ;

    })
    .finally(() =>{
      setloding(false) ;
    })


  } , [query]) ;

  return (
    <main>

      {/*  page title */}
      <h1></h1>

      {/* loading */}
      {loading && <p>Loading videos</p>}


      {/* no videos */}
      {!loading && videos.length ===  0 && (
        <p>{query ? `no videos found for ${query}` : "No videos yet"}</p>
      )}

      {/* video grid */}
      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">

          {
            videos.map((video) => (
              <VideoCard
              key={video._id}
              video={video}
              />
            ))
          }
        </div>
      )}





    </main>
   
  )
}

export default Home


/*
5. Fetching videos

This is the main part:

useEffect(() => {
  setLoading(true);

  getAllVideos({ query })
    .then((res) => setVideos(res.data.data.docs || res.data.data))
    .catch(() => setVideos([]))
    .finally(() => setLoading(false));

}, [query]);

The important part is:

[query]

This means:

Run this effect whenever query changes.

So:

Initial page
Home loads
   ↓
query = ""
   ↓
getAllVideos({ query })
   ↓
get all videos
User searches "node"
User searches node
       ↓
URL becomes /?query=node
       ↓
query becomes "node"
       ↓
useEffect runs again
       ↓
getAllVideos({ query: "node" })
       ↓
backend returns matching videos

That's the correct overall architecture.
*/


/*
6. Handling the API response

You have:

.then((res) => setVideos(res.data.data.docs || res.data.data))

This is trying to support two possible API response structures.

If you're using aggregation pagination

You might get:

res.data.data.docs

like:

{
    docs: [
        video1,
        video2,
        video3
    ],
    totalDocs: 3,
    limit: 10,
    page: 1
}

So:

res.data.data.docs

gives the actual videos.
*/
