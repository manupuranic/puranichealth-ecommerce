const baseUrl = "http://localhost:3002";
const auth = document.querySelector(".nav-item .auth");

const token = localStorage.getItem("token");

let user;

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

if (token) {
  auth.id = "logout";
  auth.appendChild(document.createTextNode("Logout"));
  user = parseJwt(token);
} else {
  auth.id = "login";
  auth.appendChild(document.createTextNode("Login"));
}

if (user && user.role === "Admin") {
  const li = document.createElement("li");
  li.className = "nav-item";
  li.innerHTML = `<a class="nav-link" href="../admin/dashboard.html">Admin</a>`;
  auth.parentElement.insertAdjacentElement("beforebegin", li);
}

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");
const loader = document.getElementById("loader");
const categoryDiv = document.getElementById("categoryDiv");

if (login)
  login.addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });

if (logout)
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

const manageCartBadge = () => {
  const cartCount = localStorage.getItem("cartCount");
  const countDiv = document.querySelector(".badge");
  if (cartCount === "true") {
    countDiv.style.display = "block";
  } else {
    countDiv.style.display = "none";
  }
};

const displayCategories = (category) => {
  const { _id, name } = category;
  const div = document.createElement("div");
  div.className = "card shadow col";
  div.id = _id;
  div.innerHTML = `
            <div class="card-body">
              <h5 class="card-name">${name}</h5>
            </div>`;
  categoryDiv.appendChild(div);

  div.addEventListener("click", (e) => {
    localStorage.setItem("categoryId", _id);
    localStorage.setItem("category", name);
    window.location.href = "../index.html";
  });
};

const getCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/category`);
    const categories = response.data.categories;
    categories.forEach((category) => {
      displayCategories(category);
    });
    manageCartBadge();
    loader.parentElement.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

const home = document.getElementById("home");
home.addEventListener("click", () => {
  localStorage.removeItem("categoryId");
  localStorage.setItem("category", "All");
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", getCategories);
