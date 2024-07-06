document.body.style.border = "5px solid red";





function makeItemInvisible(htmlElement)
{
    // htmlItem.style.border = "20px solid red";
    // htmlItem.style.visibility = "hidden";
    htmlElement.style.display = "none";
}


function CheckIfRepost(galleryCardElement, postDatabase)
{

    // WE identify a post by it's name and location 
    // we could remove name and replace it with location but we'll do this for now
    let postName = galleryCardElement.getElementsByClassName("label")[0].innerText;
    let postImageUrl = galleryCardElement.getElementsByTagName("IMG")[0];
    let postDateAndLocation = galleryCardElement.getElementsByClassName("meta")[0].innerText;

    let splitDateAndLocation = postDateAndLocation.split("·");
    let postLocation = splitDateAndLocation[1].trim();
    let postDate = splitDateAndLocation[0].trim();

    // if there's a space in the date, it's in the "x hours ago" format so replace with current date
    // javascript months are 0 indexed for some reason...
    if (postDate.indexOf(" ") !== -1)
    {
        let currentDate = new Date();
        postDate = (1 + currentDate.getMonth()) + "/" + currentDate.getDate();
    }


    // key is postName || location
    let postKey = postName + " || " + postLocation;

    // console.log(postName, " || ", postDate, " || ", postLocation);


    let retrievedPost = postDatabase[postKey];
    if (retrievedPost == undefined)
    {
        // console.log("brand new post found: adding to database");
        postDatabase[postKey] = {
            date: postDate,
            location: postLocation,
            name: postName
        };
    }
    else
    {
        // console.log("we found one, result date: ", retrievedPost.date, " vs og date: ", postDate);
        // we've found it in the database: make it invisible if the date is different
        if (postDate !== retrievedPost.date)
        {
            console.log("Repost removed: ", postKey);
            makeItemInvisible(galleryCardElement);
        }
        else
        {
            // console.log("found post, but same date: it's the original, nothing to do.");
        }
    }


}

async function hideReposts()
{
    // load the database
    // TODO: only load it once, since we now reload it every time we navigate
    console.log("Hiding reposts...");
    let postDatabase = await browser.storage.local.get("postDatabase");
    postDatabase = postDatabase.postDatabase;
    if (postDatabase == undefined)
    {
        postDatabase = {};
        console.log("database not found, creating new one");
    }
    // console.log("fetched the database, length: ", Object.keys(postDatabase).length);
    // console.log("database: ", postDatabase);


    let galleryCards = document.body.getElementsByClassName("gallery-card");
    // console.log(galleryCards);
    for (let i = 0; i < galleryCards.length; i++)
    {
        // console.log(galleryCards[i]);
        CheckIfRepost(galleryCards[i], postDatabase);
        // makeItemInvisible(galleryCards[i]);
        // break;
    }

    // save the database with new changes
    browser.storage.local.set({ "postDatabase": postDatabase });

    // // from here https://stackoverflow.com/questions/15208640/hashing-an-image-in-javascript so we can hash it
    // function getImageAsRawData(imageUrl) 
    // {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', imageUrl, true);
    //     xhr.responseType = 'arraybuffer'; // this will accept the response as an ArrayBuffer
    //     xhr.onload = function (buffer)
    //     {
    //         var words = new Uint32Array(buffer),
    //             hex = '';
    //         for (var i = 0; i < words.length; i++)
    //         {
    //             hex += words.get(i).toString(16);  // this will convert it to a 4byte hex string
    //         }
    //         console.log(hex);
    //     };
    //     xhr.send();
    // }

};


// TEMP: clear storage
// browser.storage.local.clear();

let pageLoadingTimeMs = 250;

// wait 1 second before running to let the page load
setTimeout(hideReposts, pageLoadingTimeMs);
// window.addEventListener("load", hideReposts);



function listenToAllButtons()
{
    const buttons = document.querySelectorAll("button");
    for (const button of buttons)
    {
        button.addEventListener("click", function ()
        {
            // Your code to handle the click event goes here
            // console.log("A button was clicked!");
            setTimeout(hideReposts, pageLoadingTimeMs);
        });
    }
}

// Call the function after the page loads to ensure buttons are available
window.addEventListener("load", listenToAllButtons);


// let's add listeners to the forward and back buttons to re-run this script
// TODO: this doens;t work, for some reason clickign on the buttons doesn;t trigger the event,
// while clicking on other buttons does.

// setTimeout(() =>
// {
//     // this queries for the container that contains the forward and back buttons
//     let navigationButtonBoxes = document.getElementsByClassName("cl-search-paginator");
//     // console.log(navigationButtonBoxes);
//     for (let buttonBox of navigationButtonBoxes)
//     {
//         console.log(buttonBox);
//         buttonBox.addEventListener('click', (event) =>
//         {
//             const isButton = event.target.nodeName === 'BUTTON';
//             // if (!isButton)
//             {
//                 console.log("wrong item clicked i guess");
//                 console.dir(event.target.nodeName);
//                 return;
//             }
//             console.log("WE CLICKED THE BUTTTTOTOTNTOSNOTSN");
//             setTimeout(hideReposts, pageLoadingTimeMs);
//             console.dir(event.target.id);
//         })
//     };
// },
//     pageLoadingTimeMs
// )


