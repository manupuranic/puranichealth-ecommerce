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
  window.location.href = "../login/login.html";
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
const cartList = document.getElementById("cartList");
const orderBtn = document.getElementById("order");

if (login)
  login.addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });

if (logout)
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

const home = document.getElementById("home");
home.addEventListener("click", () => {
  localStorage.removeItem("categoryId");
  localStorage.setItem("category", "All");
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

const displayProduct = (product) => {
  const li = document.createElement("li");
  li.className = "list-group-item product-line";
  li.id = product.productId._id;
  li.innerHTML = `<div class="product-info">
                  <h3 class="product-name"">${product.productId.name}</h3>
                  </div>
                  <div class="pricing-info">
                    <h5 class="product-price">₹${product.productId.price}</h5>
                    <h5 class="productQty">Qty: ${product.quantity}</h5>
                  </div>
                  <div class="action-btns">
                  <button class="btn delete" delete-btn-id=${product.productId._id}>Delete</button>
                  </div>`;
  cartList.appendChild(li);

  const deleteBtn = document.querySelector(
    `[delete-btn-id="${product.productId._id}"]`
  );

  deleteBtn.addEventListener("click", async (e) => {
    const productId = e.target.parentElement.parentElement.id;
    try {
      const response = await axios.delete(`${baseUrl}/cart/${productId}`, {
        headers: { Authentication: token },
      });
      getCart();
    } catch (error) {
      console.log(error);
    }
  });
};

const getCart = async () => {
  cartList.replaceChildren();
  loader.parentElement.style.display = "block";
  try {
    const response = await axios.get(`${baseUrl}/cart`, {
      headers: { Authentication: token },
    });
    const products = response.data.products;
    if (products.length) {
      localStorage.setItem("cartCount", true);
      manageCartBadge();
      products.forEach((product) => displayProduct(product));
      loader.parentElement.style.display = "none";
    } else {
      localStorage.setItem("cartCount", false);
      manageCartBadge();
      orderBtn.style.display = "none";
      const div = document.createElement("div");
      div.innerHTML = `<h3 class="headers">No items in cart <a href="../index.html" class="btn shop">Go to Shop</a></h3>`;
      cartList.appendChild(div);
    }
    loader.parentElement.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

orderBtn.addEventListener("click", async () => {
  loader.parentElement.style.display = "block";
  try {
    const response = await axios.post(
      `${baseUrl}/cart/order`,
      {},
      {
        headers: { Authentication: token },
      }
    );
    localStorage.setItem("cartCount", false);
    manageCartBadge();
    loader.parentElement.style.display = "none";
    window.location.href = "../orders-page/order.html";
  } catch (error) {
    console.log(error);
  }
});

document.addEventListener("DOMContentLoaded", getCart);
