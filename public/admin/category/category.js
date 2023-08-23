const baseUrl = "http://localhost:3002";
const auth = document.querySelector(".nav-item .auth");
const msg = document.getElementById("message");

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
  li.innerHTML = `<a class="nav-link" href="./admin/dashboard.html">Admin</a>`;
  auth.parentElement.insertAdjacentElement("beforebegin", li);
}

if (user && user.role !== "Admin") {
  window.location.href = "../.../index.html";
}

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");
const loader = document.getElementById("loader");
const categoryList = document.getElementById("categoryList");
const addNewCategory = document.getElementById("add");
const saveBtn = document.getElementById("saveBtn");

if (login)
  login.addEventListener("click", () => {
    window.location.href = "./login/login.html";
  });

if (logout)
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./index.html";
  });

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

const displayCategory = (category) => {
  const li = document.createElement("li");
  li.className = "list-group-item product-line";
  li.id = category._id;
  li.innerHTML = `<div class="product-info">
                  <h3 class="product-name"">${category.name}</h3>
                  </div>
                  <div class="action-btns">
                  <button class="btn edit" edit-btn-id=${category._id}>Edit</button>
                  <button class="btn delete" delete-btn-id=${category._id}>Delete</button>
                  </div>`;
  categoryList.appendChild(li);

  const editBtn = document.querySelector(`[edit-btn-id="${category._id}"]`);
  const deleteBtn = document.querySelector(`[delete-btn-id="${category._id}"]`);

  editBtn.addEventListener("click", (e) => {
    console.log("edit clicked");
  });

  deleteBtn.addEventListener("click", (e) => {
    console.log("delete clicked");
  });
};

const getCategory = async () => {
  try {
    const response = await axios.get(`${baseUrl}/category`);
    const categories = response.data.categories;
    categories.forEach((category) => {
      displayCategory(category);
    });
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getCategory();
});

const addNewCategoryFormHandler = () => {
  const categoryName = document.getElementById("categoryName");

  if (categoryName.value === "") {
    messageHandler("Please Enter all the fields", "error");
  } else {
    const categoryDetails = {
      name: categoryName.value,
    };
    console.log(categoryDetails);
    messageHandler("Category Created", "success");
    categoryDetails.value = "";
  }
};

saveBtn.addEventListener("click", addNewCategoryFormHandler);
