const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>${item.quantity}</p>
                <p>$ ${item.price.toFixed(2)}</p> 

                
            </div>
            <button class="remove-btn" data-name="${item.name}">
                REMOVE
            </button>
    
            
        </div>


    `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

adressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    adressInput.classList.remove("border-red-500");
    adressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkOpen();
  if (!isOpen) {
    Toastify({
      text: "OOPS, THE RESTAURANT IS CLOSED RIGHT NOW",
      duration: 3000,

      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (adressInput.value === "") {
    adressWarn.classList.remove("hidden");
    adressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return ` ${item.name} QTY: (${item.quantity}) PRICE: $ ${item.price} | `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "53999202033";

  window.open(
    `https://wa.me/${phone}?text=${message} Address: ${adressInput.value} TOTAL: ${cartTotal.textContent}`,
    "_blank"
  );
  cart = [];
  updateCartModal();
});

function checkOpen() {
  const data = new Date();
  const hour = data.getHours();
  return hour >= 18 && hour < 23;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-600");
}
