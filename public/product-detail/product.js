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
const pageTitle = document.getElementById("page-title");
const productImg = document.getElementById("productImg");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productDesc = document.getElementById("productDesc");
const addToCartBtn = document.querySelector(".btn");

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

const getProductDetails = async () => {
  const productId = localStorage.getItem("productId");
  try {
    const response = await axios.get(`${baseUrl}/product/${productId}`);
    console.log(response.data);
    const product = response.data.product;
    pageTitle.appendChild(
      document.createTextNode(`${product.name} - Puranic Health`)
    );
    productImg.setAttribute("src", product.imageUrl);
    productName.appendChild(document.createTextNode(product.name));
    productCategory.appendChild(
      document.createTextNode(`Category : ${product.category.name}`)
    );
    productPrice.appendChild(document.createTextNode(`₹ ${product.price}`));
    productDesc.appendChild(document.createTextNode(product.desc));
    addToCartBtn.addEventListener("click", async (e) => {
      loader.parentElement.style.display = "none";
      try {
        const response = await axios.post(
          `${baseUrl}/cart`,
          { productId: productId },
          { headers: { Authentication: token } }
        );
        localStorage.setItem("cartCount", true);
        manageCartBadge();
        loader.parentElement.style.display = "none";
      } catch (error) {
        console.log(error);
      }
    });
    loader.parentElement.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", getProductDetails);
