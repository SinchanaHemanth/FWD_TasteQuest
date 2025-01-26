// "booking" javascript
function openModal(restaurantName, location) {
  document.getElementById("restaurantName").value = restaurantName;
  document.getElementById("location").value = location;
  document.getElementById("bookingModal").style.display = "block";
}

function closeModal() {
  document.getElementById("bookingModal").style.display = "none";
}

document.getElementById("bookingForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const people = document.getElementById("people").value;
  const email = document.getElementById("email").value;
  const restaurantName = document.getElementById("restaurantName").value; // Get the restaurant name
  const location = document.getElementById("location").value;
  const timeSlot = document.getElementById("timeSlot").value;
  const responseMessage = document.getElementById("responseMessage");

  try {
    const response = await fetch("https://fwd-tastequest.onrender.com/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, people, email, restaurantName, location, timeSlot }),
    });

    const result = await response.json();

    if (response.status === 200) {
      responseMessage.style.color = "green";
      responseMessage.textContent = result.message;
      // clears the form
      document.getElementById("date").value = "";
      document.getElementById("people").value = "";
      document.getElementById("email").value = "";
      document.getElementById("timeSlot").value = "";

    } else {
      responseMessage.style.color = "red";
      responseMessage.textContent = result.message;
    }
  } catch (error) {
    responseMessage.style.color = "red";
    responseMessage.textContent = "Something went wrong. Please try again.";
  }
});

// for swiping images in cities webpage
var swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  loop: true
});


//contact us
// Contact Us form submission
// Open and Close Contact Modal
function openContactModal() {
  document.getElementById("contactModal").style.display = "block";
}

function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
}

// Submit Contact Form
async function submitContact() {
  const name = document.getElementById("contactName").value;
  const phone = document.getElementById("contactPhone").value;
  const message = document.getElementById("contactMessage").value;
  const contactResponse = document.getElementById("contactResponse");

  if (!name || !phone || !message) {
    contactResponse.style.color = "red";
    contactResponse.textContent = "All fields are required.";
    return;
  }

  try {
    const response = await fetch("https://fwd-tastequest.onrender.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message }),
    });

    const result = await response.json();

    if (response.status === 200) {
      contactResponse.style.color = "green";
      contactResponse.textContent = result.message;
      // Clear form fields
      document.getElementById("contactName").value = "";
      document.getElementById("contactPhone").value = "";
      document.getElementById("contactMessage").value = "";
    } else {
      contactResponse.style.color = "red";
      contactResponse.textContent = result.message;
    }
  } catch (error) {
    contactResponse.style.color = "red";
    contactResponse.textContent = "Something went wrong. Please try again.";
  }
}


