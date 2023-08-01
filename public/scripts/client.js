const createTweetElement = (tweet) => {
    // Convert the timestamp from milliseconds to a Date object
    const createdAtDate = new Date(tweet.created_at);
  
    // Get the individual date components
    const year = createdAtDate.getFullYear();
    const month = String(createdAtDate.getMonth() + 1).padStart(2, '0');
    const day = String(createdAtDate.getDate()).padStart(2, '0');
    const hours = String(createdAtDate.getHours()).padStart(2, '0');
    const minutes = String(createdAtDate.getMinutes()).padStart(2, '0');
  
    // Create the time string in the format: yyyy-mm-dd hh:mm
    const currentTime = Date.now();
    const timeDifference = currentTime - tweet.created_at;
    const timeElapsed = calculateTimeElapsed(timeDifference);

    //Create tweet element : 
    const article = $('<article class="tweet">');
     
    article.append(`<header>
            <img src="${tweet.user.avatars}" alt="Profile Picture">
            <div class="user-info">
              <h2 class="user-name">${tweet.user.name}</h2>
              <p class="user-handle">${tweet.user.handle}</p>
            </div>
          </header>
          <div class="tweet-content">
            <p>${tweet.content.text}</p>
          </div>
          <footer>
          <div class="icon-container">
            <i class="tweet-icon far fa-flag"></i>
            <i class="tweet-icon fas fa-retweet"></i>
            <i class="tweet-icon far fa-heart"></i>
          </div>
          <span class="timestamp">${timeElapsed} ago</span>
          </footer>
        </article>`);
  
    return article;
  };
  
  const renderTweets = function(tweets) {
    $(".tweet-container").empty(); // Empty the container to avoid duplicating tweets
    for (const tweet of tweets) {
      const tweetElement = createTweetElement(tweet);
      $('.tweet-container').prepend(tweetElement); // Use prepend instead of append to display new tweets at the top
    }
  };
  
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: (response) =>{
        renderTweets(response);
      },
      error: function(error) {
        console.error('you get this',error);
      }
    });
  };
  
  const postTweet = () => {
    const data = $("#tweet-text").serialize(); // Correct the selector to use # instead of .
  
    // Hide any previous error message before validation
    $(".error-message").slideUp();
  
    // Get the tweet text and trim any leading/trailing white spaces
    const tweetText = $("#tweet-text").val().trim();
  
    // Validation: Check if tweet is empty
    if (!tweetText) {
      const errorMessage = "Tweet is empty. Please enter some text.";
      showError(errorMessage);
      return;
    }
  
    // Validation: Check if tweet length exceeds 140 characters
    if (tweetText.length > 140) {
      const errorMessage = "The tweet is longer than 140 characters.";
      showError(errorMessage);
      return;
    }
  
    // Your existing code to post the tweet
    $.post("/tweets", data)
      .then(() => {
        loadTweets();
        $("#tweet-text").val(""); // Clear the tweet textarea after successful submission
      });
  };
  
  //  Helper Function to show the error message
  const showError = (message) => {
    const $errorElement = $("<h2>").text(message);
    const $errorMessage = $(".error-message");
    $errorMessage.empty().append($errorElement);
    $errorMessage.slideDown();
  };
  
  
  $(document).ready(() => {
    loadTweets();  
    $(".new-tweet").on("submit", (event) => {
      event.preventDefault();
      $(".error-message").empty().slideUp();
      
      postTweet();
    });
  });
  

  // Helper function to calculate time elapsed in a human-readable format
function calculateTimeElapsed(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  }