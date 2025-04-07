function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total-price");
  const formContainer = document.getElementById("order-form-container");

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <strong>${item.price}₸</strong>
    `;
    container.appendChild(div);
    total += parseFloat(item.price);
  });

  totalDisplay.textContent = `Общая сумма: ${total}₸`;

  if (cart.length > 0 && !document.getElementById("order-btn")) {
    const btn = document.createElement("button");
    btn.textContent = "Заказать товар";
    btn.id = "order-btn";
    btn.onclick = showOrderForm;
    formContainer.appendChild(btn);
  }
}

function showOrderForm() {
  const formContainer = document.getElementById("order-form-container");
  formContainer.innerHTML = `
    <h3>Оформление заказа</h3>
    <input type="text" id="customer-name" placeholder="Ваше имя" required><br>
    <input type="text" id="customer-phone" placeholder="Номер телефона" required><br>
    <input type="text" id="customer-address" placeholder="Адрес доставки" required><br>
    <button onclick="submitOrder()">Подтвердить заказ</button>
  `;
}

async function submitOrder() {
  const name = document.getElementById("customer-name").value;
  const phone = document.getElementById("customer-phone").value;
  const address = document.getElementById("customer-address").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!name || !phone || !address) {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  let message = `🛒 *Новый заказ!*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🏠 Адрес: ${address}\n\n📦 *Товары:*`;

  cart.forEach((item, i) => {
    message += `\n${i + 1}. ${item.name} — ${item.price}₸`;
  });

  const token = "7949847455:AAHPZlTmOhk8GHw-L11aHJD4UWXZr3sRZmM";
  const chatId = "6738529476";
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    })
  });

  document.getElementById("order-form-container").innerHTML = "<p>🎉 Спасибо за заказ! Скоро с вами свяжемся.</p>";
  localStorage.removeItem("cart");
  loadCart();
}

loadCart();
