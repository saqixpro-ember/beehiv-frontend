document.addEventListener("DOMContentLoaded", () => {
  // Retrieve query parameters from the current URL.
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  const bhlid = params.get("_bhlid");
  const publicationId = params.get("publication_id");

  // Validate that the email parameter exists.
  if (!email) {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("status-text").textContent =
      "Error: Email parameter missing in URL.";
    return;
  }

  // Construct the Cloud Run URL with query parameters.
  let cloudRunUrl = `https://newsletter-service-147667145983.us-central1.run.app/unsubscribe?email=${encodeURIComponent(
    email
  )}&publication_id=${publicationId}`;
  if (bhlid) {
    cloudRunUrl += `&_bhlid=${encodeURIComponent(bhlid)}`;
  }

  // Make the API request to the FastAPI server.
  fetch(cloudRunUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Hide the spinner once the response is received.
      document.getElementById("spinner").style.display = "none";

      // Display appropriate message based on the response.
      if (data.error) {
        document.getElementById("status-text").textContent =
          "Error: " + data.error;
      } else {
        document.getElementById("status-text").textContent =
          "You are unsubscribed.";
      }

      // Start the redirection countdown.
      startCountdown(15);
    })
    .catch((error) => {
      // Hide the spinner and show error message.
      document.getElementById("spinner").style.display = "none";
      document.getElementById("status-text").textContent =
        "Error: " + error.message;
      // Start the redirection countdown even on error.
      startCountdown(15);
    });
});

/**
 * Starts a countdown timer and redirects to beehiv.com when the counter reaches zero.
 *
 * @param {number} seconds - The number of seconds to count down.
 */
function startCountdown(seconds) {
  let counter = seconds;
  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";
  countdownEl.textContent = `Redirecting in ${counter} seconds...`;

  const interval = setInterval(() => {
    counter--;
    countdownEl.textContent = `Redirecting in ${counter} seconds...`;
    if (counter <= 0) {
      clearInterval(interval);
      window.location.href = "https://beehiv.com";
    }
  }, 1000);
}
