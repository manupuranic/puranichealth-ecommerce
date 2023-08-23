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
  li.innerHTML = `<a class="nav-link" href="./admin/dashboard.html">Admin</a>`;
  auth.parentElement.insertAdjacentElement("beforebegin", li);
}

const login = document.querySelector("#login");
const logout = document.querySelector("#logout");
const loader = document.getElementById("loader");
const productDiv = document.getElementById("productDiv");

if (login)
  login.addEventListener("click", () => {
    window.location.href = "./login/login.html";
  });

if (logout)
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./index.html";
  });

const displayProducts = (product) => {
  const {
    _id,
    name,
    price,
    imageUrl,
    desc,
    category: { name: category },
  } = product;
  const div = document.createElement("div");
  div.className = "card shadow col";

  div.innerHTML = `<img
              src=${imageUrl}
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-name">${name}</h5>
              <p class="card-price">₹${price}</p>
              <p class="card-desc">
                ${desc}
              </p>
              <div class="cta">
                <button class="btn detail-btn" detail-id=${_id}>Details</button>
                <button class="btn cart-btn" add-to-cart-id=${_id}>Add to cart</button>
              </div>
            </div>`;
  productDiv.appendChild(div);
  const detailsBtn = document.querySelector(`[detail-id="${_id}"]`);
  const addToCartBtn = document.querySelector(`[add-to-cart-id="${_id}"]`);

  detailsBtn.addEventListener("click", (e) => {
    console.log(e.target);
    console.log("clicked details");
  });

  addToCartBtn.addEventListener("click", (e) => {
    console.log(e.target);
    console.log("clicked add-to-cart");
  });
};

const getProducts = async () => {
  try {
    loader;
    const response = await axios.get(`${baseUrl}/product`);
    const products = response.data.products;
    products.forEach((product) => {
      displayProducts(product);
    });
    loader.parentElement.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", getProducts);
