const baseUrl = "https://shop.puranic.in";
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
  window.location.href = "../../login/login.html";
}

if (user && user.role === "Admin") {
  const li = document.createElement("li");
  li.className = "nav-item";
  li.innerHTML = `<a class="nav-link" href="../dashboard.html">Admin</a>`;
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
    window.location.href = "../../login/login.html";
  });

if (logout)
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartCount");
    window.location.href = "../../index.html";
  });

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

const manageCartBadge = () => {
  const cartCount = localStorage.getItem("cartCount");
  const countDiv = document.querySelector(".badge");
  if (cartCount === "true") {
    countDiv.style.display = "block";
  } else {
    countDiv.style.display = "none";
  }
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

  editBtn.setAttribute("data-bs-toggle", "modal");
  editBtn.setAttribute("data-bs-target", "#addCategoryModel");

  editBtn.addEventListener("click", async (e) => {
    const modalTitle = document.getElementById("model-label");
    modalTitle.replaceChildren(document.createTextNode("Edit Category"));
    const categoryId = e.target.parentElement.parentElement.id;
    try {
      const response = await axios.get(`${baseUrl}/category/${categoryId}`);
      const category = response.data.category;
      document.getElementById("categoryName").value = category.name;
      document.getElementById("hidden-input").value = category._id;
    } catch (error) {
      console.log(error);
    }
  });

  deleteBtn.addEventListener("click", async (e) => {
    const categoryId = e.target.parentElement.parentElement.id;
    try {
      const response = await axios.delete(`${baseUrl}/category/${categoryId}`, {
        headers: { Authentication: token },
      });
      const category = response.data.category;
      getCategory();
    } catch (error) {
      console.log(error);
    }
  });
};

const getCategory = async () => {
  categoryList.replaceChildren();
  try {
    const response = await axios.get(`${baseUrl}/category`);
    const categories = response.data.categories;
    categories.forEach((category) => {
      displayCategory(category);
    });
    manageCartBadge();
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getCategory();
});

const addNewCategoryFormHandler = async () => {
  const categoryName = document.getElementById("categoryName");
  const categoryId = document.getElementById("hidden-input");

  if (categoryName.value === "") {
    messageHandler("Please Enter all the fields", "error");
  } else {
    const categoryDetails = {
      name: categoryName.value,
    };
    let Url;
    let networkCall;
    let message;
    if (categoryId.value) {
      Url = `${baseUrl}/category/${categoryId.value}`;
      networkCall = axios.put;
      message = "Category Updated";
    } else {
      Url = `${baseUrl}/category`;
      networkCall = axios.post;
      message = "Category Created";
    }
    try {
      const response = await networkCall(Url, categoryDetails, {
        headers: { Authentication: token },
      });
      const category = response.data.category;
      messageHandler(`${message}`, "success");
      document.getElementById("closeBtn").click();
      getCategory();
      categoryName.value = "";
      categoryId.value = "";
    } catch (error) {
      console.log(error);
    }
  }
};

addNewCategory.addEventListener("click", () => {
  const modalTitle = document.getElementById("model-label");
  modalTitle.replaceChildren(document.createTextNode("Add New Category"));
  document.getElementById("categoryName").value = "";
  document.getElementById("hidden-input").value = "";
});

const home = document.getElementById("home");
home.addEventListener("click", () => {
  localStorage.removeItem("categoryId");
  localStorage.setItem("category", "All");
  window.location.href = "../../index.html";
});

saveBtn.addEventListener("click", addNewCategoryFormHandler);
