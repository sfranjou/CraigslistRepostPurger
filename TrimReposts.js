document.body.style.border = "5px solid red";


function hideReposts()
{
    console.log("hello");
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    // if (window.hasRun)
    // {
    //     return;
    // }
    // window.hasRun = true;

    function makeItemInvisible(htmlElement)
    {
        // htmlItem.style.border = "20px solid red";
        // htmlItem.style.visibility = "hidden";
        htmlElement.style.display = "none";
        // output = "";
        // for (const attr of htmlItem.attributes)
        // {
        //     output += `${ attr.name } -> ${ attr.value }\n`;
        // }
        // console.log(output);

    }

    galleryCards = document.body.getElementsByClassName("gallery-card");
    console.log(galleryCards);
    for (let i = 0; i < galleryCards.length; i++)
    {
        // console.log(galleryCards[i]);
        makeItemInvisible(galleryCards[i]);
        // break;
    }

};

// wait 1 second before running to let the page load
setTimeout(hideReposts, 1000);
// document.addEventListener("DOMContentLoaded", hideReposts);