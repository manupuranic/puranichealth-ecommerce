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

if (user && user.role !== "Admin") {
  window.location.href = "../index.html";
}

if (user && user.role === "Admin") {
  const li = document.createElement("li");
  li.className = "nav-item";
  li.innerHTML = `<a class="nav-link" href="./admin/dashboard.html">Admin</a>`;
  auth.parentElement.insertAdjacentElement("beforebegin", li);
}

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");
const loader = document.getElementById("loader");
const productList = document.getElementById("productList");
const addNewProduct = document.getElementById("add");
const select = document.getElementById("category");
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

const displayProduct = (product) => {
  const li = document.createElement("li");
  li.className = "list-group-item product-line";
  li.id = product._id;
  li.innerHTML = `<div class="product-info">
                  <h3 class="product-name"">${product.name}</h3>
                  <span class="product-category">${product.category.name}</span>
                  </div>
                  <div class="pricing-info">
                    <span class="product-price">₹${product.price}</span>
                  </div>
                  <div class="action-btns">
                  <button class="btn edit" edit-btn-id=${product._id}>Edit</button>
                  <button class="btn delete" delete-btn-id=${product._id}>Delete</button>
                  </div>`;
  productList.appendChild(li);

  const editBtn = document.querySelector(`[edit-btn-id="${product._id}"]`);
  const deleteBtn = document.querySelector(`[delete-btn-id="${product._id}"]`);

  editBtn.addEventListener("click", (e) => {
    console.log("edit clicked");
  });

  deleteBtn.addEventListener("click", (e) => {
    console.log("delete clicked");
  });
};

const getProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/product`);
    const products = response.data.products;
    products.forEach((product) => {
      displayProduct(product);
    });
  } catch (error) {
    console.log(error);
  }
};

const displayCategory = (category) => {
  const option = document.createElement("option");
  option.value = category._id;
  option.appendChild(document.createTextNode(category.name));
  select.appendChild(option);
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
  getProducts();
  getCategory();
});

const addNewProductFormHandler = () => {
  const productName = document.getElementById("productName");
  const price = document.getElementById("price");
  const imageUrl = document.getElementById("imageUrl");
  const category = document.getElementById("category");
  const desc = document.getElementById("desc");

  if (
    productName.value === "" ||
    price.value === "" ||
    imageUrl.value === "" ||
    desc.value === "" ||
    category.value === "choose a category"
  ) {
    messageHandler("Please Enter all the fields", "error");
  } else {
    const productDetails = {
      name: productName.value,
      price: price.value,
      imageUrl: imageUrl.value,
      category: category.value,
      desc: desc.value,
    };
    console.log(productDetails);
    messageHandler("Product Created", "success");
    productName.value = "";
    price.value = "";
    imageUrl.value = "";
    desc.value = "";
    category.value = "choose a category";
  }
};

saveBtn.addEventListener("click", addNewProductFormHandler);
