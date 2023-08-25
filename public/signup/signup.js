const baseUrl = "https://shop.puranic.in";
const signUpForm = document.getElementById("signUpForm");
const msg = document.getElementById("message");

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

const signUpHandler = async (event) => {
  event.preventDefault();
  const userName = event.target.name;
  const email = event.target.email;
  const phone = event.target.phone;
  const password = event.target.password;
  if (
    userName.value === "" ||
    email.value === "" ||
    password.value === "" ||
    phone.value === ""
  ) {
    messageHandler("Please Enter all the fields", "error");
  } else {
    let userDetails = {
      name: userName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    };
    try {
      const response = await axios.post(`${baseUrl}/user/signup`, userDetails);
      const data = response.data;
      localStorage.setItem("token", data.token);
      alert("User created");
      messageHandler("Signup successfull", "success");
      window.location.href = "../index.html";
      userName.value = "";
      email.value = "";
      phone.value = "";
      password.value = "";
    } catch (err) {
      if (err.response.status === 409) {
        alert("User already exists, please Login");
        messageHandler("User already exists", "error");
      } else {
        messageHandler(`Something Went wrong: ${err.message}`, "error");
      }
    }
  }
};

const home = document.getElementById("home");
home.addEventListener("click", () => {
  localStorage.removeItem("categoryId");
  localStorage.setItem("category", "All");
  window.location.href = "../index.html";
});

signUpForm.addEventListener("submit", signUpHandler);
