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
  fetch(cloudRunUrl, { method: "GET" }).then(() => {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("status-text").textContent =
      "You are unsubscribed.";
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
