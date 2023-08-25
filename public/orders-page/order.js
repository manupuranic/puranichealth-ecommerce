const baseUrl = "https://shop.puranic.in";
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
const orderList = document.getElementById("orderList");

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

const displayOrder = (order) => {
  console.log(order._id);
  const li = document.createElement("li");
  li.className = "list-group-item order-line";
  li.innerHTML = `<div class="order-info">
                  <h3 class="orderId">Order ID: ${order._id}</h3>
                  </div>
                    <ul class="list-group" order-id=${order._id}>
                    </ul>
                    `;
  orderList.appendChild(li);
  console.log(orderList);
  const productList = document.querySelector(`[order-id="${order._id}"]`);
  console.log(productList);

  order.products.forEach((product) => {
    const productLi = document.createElement("li");
    productLi.className = "list-group-item product-line";
    productLi.innerHTML = `<div class="product-info">
                        <h3 class="product-name"">${product.product.name}</h3>
                        </div>
                        <div class="pricing-info">
                          <h5 class="product-price">₹${product.product.price}</h5>
                          <h5 class="productQty">Qty: ${product.quantity}</h5>
                        </div>`;

    productList.appendChild(productLi);
  });
};

const getOrders = async () => {
  //   orderList.replaceChildren();
  loader.parentElement.style.display = "block";
  manageCartBadge();
  try {
    const response = await axios.get(`${baseUrl}/cart/order`, {
      headers: { Authentication: token },
    });
    const orders = response.data.orders;
    if (orders.length) {
      orders.forEach((order) => displayOrder(order));
      loader.parentElement.style.display = "none";
    } else {
      const div = document.createElement("div");
      div.innerHTML = `<h3 class="headers">No Orders Placed Yet <a href="../index.html" class="btn shop">Go to Shop</a></h3>`;
      orderList.appendChild(div);
    }
    loader.parentElement.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", getOrders);
