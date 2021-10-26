/*============
Variables
=============*/
//DOM Elements
const upButton = document.querySelector('.thumb-up-btn');
const downButton = document.querySelector('.thumb-down-btn');
const upCountDiv = document.querySelector('.thumb-up-count');
const downCountDiv = document.querySelector('.thumb-down-count');
// Data from amrp db
const postRecord = amrpObject['postRecord'];
const postId = amrpObject['postID'];
// local storage is used as script state

/*================
 Script functions
==================*/
// Display the rates from database
function showRates() {
    upCountDiv.innerHTML = postRecord.rate_up;
    downCountDiv.innerHTML = postRecord.rate_down;

    // Mark the user rating for the post  
    if (localStorage.getItem(postId) != null) {
        switch (localStorage.getItem(postId)) {
            case "up":
                upCountDiv.style = "color: #008100; text-decoration: underline";
                downCountDiv.style = "color: initial; text-decoration: initial";
                break;

            case "down":
                upCountDiv.style = "color: initial; text-decoration: initial";
                downCountDiv.style = "color: #FF0000; text-decoration: underline";
                break;

            case "":
                upCountDiv.style = "color: initial; text-decoration: initial";
                downCountDiv.style = "color: initial; text-decoration: initial";
                break;

            default:
                break;
        }
    }
}

// Post rates to database
async function postRates() {
    let data = new URLSearchParams();
    data.append('action', 'amrpRatePosts');
    data.append('postId', postId);
    data.append('rateUp', postRecord.rate_up);
    data.append('rateDown', postRecord.rate_down);

    await fetch(amrpObject['ajaxUrl'], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: data
    })
        .then(showRates())
}

/*============
 Script Action
=============*/
showRates();

// Button clicking events
upButton.addEventListener('click', () => {
    switch (localStorage.getItem(postId)) {
        case "up":
            localStorage.setItem(postId, '');
            postRecord.rate_up--;
            break;

        case "down":
            localStorage.setItem(postId, 'up');
            postRecord.rate_down--;
            postRecord.rate_up++;
            break;

        case "": case null:
            localStorage.setItem(postId, 'up');
            postRecord.rate_up++;
            break;

        default:
            break;
    }

    postRates();
})

downButton.addEventListener('click', () => {
    switch (localStorage.getItem(postId)) {
        case "down":
            localStorage.setItem(postId, '');
            postRecord.rate_down--;
            break;

        case "up":
            localStorage.setItem(postId, 'down');
            postRecord.rate_up--;
            postRecord.rate_down++;
            break;

        case "": case null:
            localStorage.setItem(postId, 'down');
            postRecord.rate_down++;
            break;

        default:
            break;
    }

    postRates();
})