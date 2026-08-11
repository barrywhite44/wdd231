// scripts/soupy.js - Shared site behavior (auth, cart, orders, reviews)
document.addEventListener("DOMContentLoaded", () => {
  // --- Utility helpers ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // storage keys
  const KEY_USERS = "soupyUsers";
  const KEY_CURRENT = "soupyCurrentUser";
  const KEY_CART = "soupyCart";
  const KEY_ORDERS = "soupyOrders";
  const KEY_REVIEWS = "soupyReviews";

  // load stored data
  let users = JSON.parse(localStorage.getItem(KEY_USERS)) || [];
  let currentUser = JSON.parse(localStorage.getItem(KEY_CURRENT)) || null;
  let cart = JSON.parse(localStorage.getItem(KEY_CART)) || [];
  let reviews = JSON.parse(localStorage.getItem(KEY_REVIEWS)) || [];

  // --- HEADER user status (append badge + hide auth links when logged in) ---
  function updateHeader() {
    const header = $("header");
    if (!header) return;

    // remove existing badge if present
    const existing = header.querySelector(".user-badge");
    if (existing) existing.remove();

    // find auth links (if present)
    const authLinks = header.querySelectorAll(".auth-btn");
    if (currentUser) {
      // hide auth links
      authLinks.forEach(a => a.style.display = "none");

      // append badge
      const badge = document.createElement("div");
      badge.className = "user-badge";
      badge.innerHTML = `👋 Welcome, <strong>${escapeHtml(currentUser.name)}</strong> <button id="logoutBtn">Logout</button>`;
      header.appendChild(badge);

      const logoutBtn = $("#logoutBtn");
      logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem(KEY_CURRENT);
        currentUser = null;
        alert("Logged out.");
        updateHeader();
        location.reload();
      });
    } else {
      // show auth links if present
      authLinks.forEach(a => a.style.display = "");
    }
  }

  // basic helper to prevent injection when injecting text
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])
    );
  }

  updateHeader();

  // --- SIGNUP (signup.html) ---
  const signupForm = $("#signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#signup-name").value.trim();
      const email = $("#signup-email").value.trim().toLowerCase();
      const password = $("#signup-password").value;

      if (!name || !email || !password) {
        alert("Please complete all fields.");
        return;
      }

      if (users.find(u => u.email === email)) {
        alert("This email is already registered. Please log in.");
        window.location.href = "login.html";
        return;
      }

      const user = { name, email, password };
      users.push(user);
      localStorage.setItem(KEY_USERS, JSON.stringify(users));
      localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
      currentUser = user;
      alert("Account created — welcome!");
      updateHeader();
      window.location.href = "soupy.html";
    });
  }

  // --- LOGIN (login.html) ---
  const loginForm = $("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#login-email").value.trim().toLowerCase();
      const password = $("#login-password").value;

      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        alert("Invalid email or password.");
        return;
      }

      localStorage.setItem(KEY_CURRENT, JSON.stringify(found));
      currentUser = found;
      alert(`Welcome back, ${found.name}!`);
      updateHeader();
      window.location.href = "soupy.html";
    });
  }

  // --- MENU: add-to-cart (menu.html) ---
  const addBtns = $$(".add-to-cart");
  if (addBtns.length > 0) {
    addBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.soup || btn.dataset.name || btn.textContent.trim();
        const price = parseFloat(btn.dataset.price || 0) || 0;
        // find existing
        const existing = cart.find(i => i.name === name);
        if (existing) existing.qty = Number(existing.qty) + 1;
        else cart.push({ name, price, qty: 1 });
        localStorage.setItem(KEY_CART, JSON.stringify(cart));
        alert(`${name} added to cart.`);
      });
    });
  }

  // --- ORDER page: render cart, allow clear, and submit order ---
  const cartList = $("#cart-items");
  const cartTotalSpan = $("#cart-total");
  const clearCartBtn = $("#clear-cart");
  const orderForm = $("#order-form");
  const savedOrdersDiv = $("#saved-orders");

  function renderCart() {
    if (!cartList) return;
    cartList.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
      cartList.innerHTML = "<li>Your cart is empty.</li>";
      cartTotalSpan && (cartTotalSpan.textContent = "0");
      return;
    }
    cart.forEach((item, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `${escapeHtml(item.name)} (x${item.qty}) - ₦${(item.price * item.qty).toFixed(0)}`;
      // remove button
      const remove = document.createElement("button");
      remove.textContent = "Remove";
      remove.style.marginLeft = "10px";
      remove.addEventListener("click", () => {
        cart.splice(idx, 1);
        localStorage.setItem(KEY_CART, JSON.stringify(cart));
        renderCart();
      });
      li.appendChild(remove);
      cartList.appendChild(li);
      total += item.price * item.qty;
    });
    cartTotalSpan && (cartTotalSpan.textContent = total.toFixed(0));
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (!cart.length) return alert("Cart is already empty.");
      if (!confirm("Clear cart?")) return;
      cart = [];
      localStorage.setItem(KEY_CART, JSON.stringify(cart));
      renderCart();
    });
  }

  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // read order info
      const name = $("#order-name").value.trim();
      const email = $("#order-email").value.trim();
      const address = $("#order-address").value.trim();
      const swallow = $("#order-swallow").value;

      if (!name || !email || !address || !swallow) {
        alert("Please fill in all order details.");
        return;
      }

      if (cart.length === 0) {
        alert("Your cart is empty. Add items from the menu or use the add-to-cart buttons.");
        return;
      }

      const order = {
        name, email, address, swallow,
        items: cart.slice(), // copy
        date: new Date().toLocaleString()
      };

      const orders = JSON.parse(localStorage.getItem(KEY_ORDERS)) || [];
      orders.push(order);
      localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));

      // clear cart
      cart = [];
      localStorage.setItem(KEY_CART, JSON.stringify(cart));
      renderCart();
      renderSavedOrders();

      alert("Order placed! Thank you.");
      orderForm.reset();
    });
  }

  function renderSavedOrders() {
    if (!savedOrdersDiv) return;
    const orders = JSON.parse(localStorage.getItem(KEY_ORDERS)) || [];
    if (orders.length === 0) {
      savedOrdersDiv.innerHTML = "<p>No previous orders.</p>";
      return;
    }
    savedOrdersDiv.innerHTML = "";
    orders.slice().reverse().forEach(o => {
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <h4>${escapeHtml(o.name)} — <small>${escapeHtml(o.date)}</small></h4>
        <p><strong>Items:</strong> ${o.items.map(i => `${escapeHtml(i.name)}(x${i.qty})`).join(", ")}</p>
        <p><strong>Swallow:</strong> ${escapeHtml(o.swallow)}</p>
        <p><strong>Address:</strong> ${escapeHtml(o.address)}</p>
      `;
      savedOrdersDiv.appendChild(div);
    });
  }

  renderCart();
  renderSavedOrders();

// --- REVIEWS: submit & render (order.html has review-form & review-list) ---
const reviewForm = $("#review-form");
const reviewListDiv = $("#review-list");
if (reviewForm && reviewListDiv) {
  // load and render existing
  function renderReviews() {
    const rs = JSON.parse(localStorage.getItem(KEY_REVIEWS)) || [];
    reviewListDiv.innerHTML = "";
    if (rs.length === 0) {
      reviewListDiv.innerHTML = "<p>No reviews yet — be the first to review!</p>";
      return;
    }
    rs.slice().reverse().forEach(r => {
      const card = document.createElement("div");
      card.className = "review-card";

      // show actual rating
      const stars = "⭐".repeat(r.rating || 5);
      card.innerHTML = `
        <p class="review-stars">${stars}</p>
        <p>“${escapeHtml(r.text)}”</p>
        <h4>- ${escapeHtml(r.name)}</h4>
      `;
      reviewListDiv.appendChild(card);
    });
  }

  renderReviews();

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#review-name").value.trim();
    const text = $("#review-text").value.trim();
    const ratingInput = document.querySelector("input[name='review-rating']:checked");
    const rating = ratingInput ? parseInt(ratingInput.value) : 5;

    if (!name || !text || !rating) {
      alert("Please enter your name, rating, and review.");
      return;
    }

    const rs = JSON.parse(localStorage.getItem(KEY_REVIEWS)) || [];
    rs.push({ name, text, rating, date: new Date().toLocaleString() });
    localStorage.setItem(KEY_REVIEWS, JSON.stringify(rs));
    reviewForm.reset();
    renderReviews();
  });
}


  // --- Home: order CTA button goes to order.html ---
  const orderCta = $("#order-cta");
  if (orderCta) {
    orderCta.addEventListener("click", () => {
      window.location.href = "order.html";
    });
  }

  // ensure header updated if page loaded and current user exists
  if (!currentUser) {
    currentUser = JSON.parse(localStorage.getItem(KEY_CURRENT)) || null;
  } else {
    // ensure KEY_CURRENT holds the value
    localStorage.setItem(KEY_CURRENT, JSON.stringify(currentUser));
  }
  updateHeader();
});
