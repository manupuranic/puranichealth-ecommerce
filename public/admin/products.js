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
  window.location.href = "../login/login.html";
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
    window.location.href = "../login/login.html";
  });

if (logout)
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
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

  editBtn.setAttribute("data-bs-toggle", "modal");
  editBtn.setAttribute("data-bs-target", "#addProductModel");

  editBtn.addEventListener("click", async (e) => {
    const modalTitle = document.getElementById("model-label");
    modalTitle.replaceChildren(document.createTextNode("Edit Category"));
    const productId = e.target.parentElement.parentElement.id;
    try {
      const response = await axios.get(`${baseUrl}/product/${productId}`);
      const product = response.data.product;
      console.log(product.category.name);
      document.getElementById("productName").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("imageUrl").value = product.imageUrl;
      const category = document.getElementById("category");
      category.value = product.category._id;
      document.getElementById("desc").value = product.desc;
      document.getElementById("hidden-input").value = product._id;
    } catch (error) {
      console.log(error);
    }
  });

  deleteBtn.addEventListener("click", async (e) => {
    const productId = e.target.parentElement.parentElement.id;
    try {
      const response = await axios.delete(`${baseUrl}/product/${productId}`, {
        headers: { Authentication: token },
      });
      const product = response.data.product;
      getProducts();
    } catch (error) {
      console.log(error);
    }
  });
};

const getProducts = async () => {
  productList.replaceChildren();
  try {
    const response = await axios.get(`${baseUrl}/product?category=null`);
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
  manageCartBadge();
});

const addNewProductFormHandler = async () => {
  const productName = document.getElementById("productName");
  const price = document.getElementById("price");
  const imageUrl = document.getElementById("imageUrl");
  const category = document.getElementById("category");
  const desc = document.getElementById("desc");
  const productId = document.getElementById("hidden-input");

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
    let Url;
    let networkCall;
    let message;
    if (productId.value) {
      Url = `${baseUrl}/product/${productId.value}`;
      networkCall = axios.put;
      message = "Product Updated";
    } else {
      Url = `${baseUrl}/product`;
      networkCall = axios.post;
      message = "Product Created";
    }

    try {
      const response = await networkCall(Url, productDetails, {
        headers: { Authentication: token },
      });
      const product = response.data.product;
      messageHandler("Product Created", "success");
      productName.value = "";
      price.value = "";
      imageUrl.value = "";
      desc.value = "";
      category.value = "choose a category";
      document.getElementById("closeBtn").click();
      getProducts();
    } catch (error) {
      console.log(error);
    }
  }
};

addNewProduct.addEventListener("click", () => {
  const modalTitle = document.getElementById("model-label");
  modalTitle.replaceChildren(document.createTextNode("Add New Product"));
  document.getElementById("productName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("imageUrl").value = "";
  document.getElementById("category").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("hidden-input").value = "";
});

const home = document.getElementById("home");
home.addEventListener("click", () => {
  localStorage.removeItem("categoryId");
  localStorage.setItem("category", "All");
  window.location.href = "../index.html";
});

saveBtn.addEventListener("click", addNewProductFormHandler);
