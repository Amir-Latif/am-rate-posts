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
// Following variables are used in database updates
let sessionUp = postRecord ? postRecord['rate_up'] : 0;
let sessionDown = postRecord ? postRecord['rate_down'] : 0;

/*================
 Script functions
==================*/
// Display the rates from database
function showRates() {
    upCountDiv.innerHTML = sessionUp;
    downCountDiv.innerHTML = sessionDown;

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
    data.append('sessionUp', sessionUp);
    data.append('sessionDown', sessionDown);

    await fetch(amrpObject['ajaxUrl'], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: data
    })
        .then(response => response.json())
        .then(data => {
            sessionUp = parseInt(data.rate_up);
            sessionDown = parseInt(data.rate_down);
            showRates()
        })
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
            sessionUp -= 2;
            break;

        case "down":
            localStorage.setItem(postId, 'up');
            sessionUp++;
            sessionDown -= 2;
            break;

        case "": case null:
            localStorage.setItem(postId, 'up');
            sessionUp++;
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
            sessionDown -= 2;
            break;

        case "up":
            localStorage.setItem(postId, 'down');
            sessionUp -= 2;
            sessionDown++;
            break;

        case "": case null:
            localStorage.setItem(postId, 'down');
            sessionDown++;
            break;

        default:
            break;
    }

    postRates();
})