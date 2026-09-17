import React from 'react'
import { Link } from 'react-router-dom';


function formatViews(number = 0) {

    if (number >= 1000000)
        return `${(number / 1000000).toFixed(1)}M views`;

    if (number >= 1000)
        return `${Math.floor(number / 1000)}K views`;

    return `${number} views`;
}



function formatDuration(seconds = 0) {

    const minutes = Math.floor(seconds / 60);

    // get remaining seconds
    const remaining_seconds = seconds % 60;

    // if seconds only in one digit 
    // pad zero before it 

    const formatted_seconds = String(remaining_seconds).padStart(2, "0");

    return `${minutes}:${formatted_seconds}`;
}

// calculate how long ago the video was uploaded 

function timeago(dateString) {

    const date = new Date(dateString);

    const currentTime = Date.now();
    const uploadTime = date.getTime();



    const diff = currentTime - uploadTime;

    // convert milliseconds into days

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return "today";

    if (days == 1) return "1 day ago";

    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);

    if (months < 12) return `${months} mon ago`;

    const years = Math.floor(days / (365));

    return `${years} yr ago`;
}



function VideoCard({ video }) {


    const owner = video.owner;

    return (


        // when the user clicks the VideoCard
        <Link
            to={`/watch/${video._id}`}
            className='group block'
        >


            <div className='
                relative
                aspect-video
                overflow-hidden
                rounded-sm
                bg-line
        '>

            //thumbnail
                <img
                    src={video.thumbanail?.url}
                    alt={video.title}
                    className='
                 h-full
                 w-full
                 object-cover
                 transition
                 group-hover:opacity-90 '


                />
            // video duration
                <span
                    className='
                    absolute
                    bottom-2
                    right-2
                    rounded
                    bg-black
                    px-2
                    py-1
                    text-xs
                    text-white
                '
                >{formatDuration(video.duration)}</span>

            </div>



            <div
                className='mt-2 flex gap-2'
            >
            // video information

                //avatar Optional


                <img
                    src={owner.avatar?.url}
                    alt=""
                    className='
                    mt-0.5
                    h-8
                    w-8
                    shrink-0
                    rounded-full
                    object-cover
                '

                />

                <div
                    className='min-w-0'
                >

                    {/*   TITLE + CHANNEL + VIEWS */}

                    <h3
                        className='line-clamp-2
                                font-display
                                text-sm
                                font-medium
                                leading-snug
                                text-ink '
                    >{video.title}</h3>

                    <p
                        className='mt-1 truncate text-xs text-muted'
                    >{owner.username}</p>

                    <p
                        className='text-xs  text-muted'
                    >{formatViews(video.views)}
                        {" . "}
                        {timeago(video.createdAt)}
                    </p>

                </div>


            </div>


        </Link>


    )
}

export default VideoCard;

/*
structure of the video card 


Link
│
├── Thumbnail container
│   ├── Thumbnail image
│   └── Duration badge
│
└── Video information
    │
    ├── Avatar
    │
    └── Text information
        ├── Title
        ├── Username
        └── Views + time 
        
*/


/*
<Link>                         ← entire clickable card
│
├── <div>                      ← thumbnail container
│   │
│   ├── <img>                 ← thumbnail
│   │
│   └── <span>                ← duration
│
└── <div>                     ← information row
    │
    ├── <img>                 ← avatar
    │
    └── <div>                 ← text column
        │
        ├── <h3>              ← title
        ├── <p>               ← username
        └── <p>               ← views + time
*/

// css explanation


// Link
// display: block;
// A block element takes the available width. This is useful because you want the whole card area to be clickable.

// group : This is a Tailwind feature used when you want an element inside the card to react to hovering over the parent.


// thumbnail container
// aspect-video : This gives the container a 16:9 aspect ratio.
// relative : the child is marked absolute 
// to make the badge position relaive to the parent it should be marked relative otherwise the badge will position it self acc to some other ancestor 

// overflow : hidden ;  useful when container has rounded corners 

// thumbnail image 

// w-full : the image fills the entire widht of the thumbnail container  , width : 100%
// h-full : height : 100%


// object-cover : means the image should cover the entire container while maintaining its original aspect ratio.

// video duration badge 

// position: absolute; This takes the element out of the normal document flow. Instead of appearing after the image, it is placed on top of the image.
// bg-black ; background-color: black;
// text-white color: white;


// px-2

// Horizontal padding.

// ┌────────────────┐
// │  12:04         │
// └────────────────┘
//    ↑       ↑
//    padding
// py-1

// Vertical padding.

// So the text isn't touching the edges of the black box.



// 2. Information section

// After the thumbnail:

// <div className="mt-2 flex gap-2">

// This contains:

// Avatar     Information
//   🟢       Title
//            Username


//            Views
// mt-2
// margin-top: ...;

// display: flex; || This is what puts the avatar and text next to each other.
// gap: ...; Creates space between the avatar and the text.

// avatar
// h-8 Sets height w-8 Sets width. Together: width = 32p height = 32px

// rounded-full This makes the image completely circular.

// shrink-0 : This is important when the screen gets smaller.
// It tells flexbox: Don't shrink my avatar.

// object-cover : Again, this makes the avatar image fill the 32×32 area while maintaining its aspect ratio.

/*

Text container

    < div className = "min-w-0" >

        This contains:

Title
Username
Views

This is a flexbox - related trick.

It allows the text container to become smaller when necessary so that things like:

truncate

and:

line - clamp - 2

can actually work correctly.


    // title

    line - clamp - 2 || Maximum 2 lines.
        text - sm Small font size.
            font - medium - Makes the title slightly thicker.

                leading - snug : Controls the line height.It makes the two lines relatively close together.

                    text - ink : It probably represents your primary text color.


                        // username 

                        mt - 1 : Small margin above the username.
                            text - xs Very small text.
                                text - muted : Probably another custom color representing secondary / muted text.
                                    truncate : If username is extremely long:

                                    */



