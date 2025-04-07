async function loadExcelData() {
  try {
    const res = await fetch('./catalog.xlsx');
    const arrayBuffer = await res.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("Загруженные данные из Excel:", data);

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    data.forEach(product => {
      const catalogItem = createCatalogItem({
        name: product['Название'],
        description: product['Описание'],
        price: product['Цена'],
        image: product['Изображение']
      });

      productList.appendChild(catalogItem);
    });
  } catch (error) {
    console.error("Ошибка при загрузке Excel:", error);
  }
}

function createCatalogItem(item) {
  const div = document.createElement("div");
  div.className = "catalog-item";

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.name;

  const name = document.createElement("h3");
  name.textContent = item.name;

  const desc = document.createElement("p");
  desc.textContent = item.description;

  const price = document.createElement("p");
  price.textContent = `Цена: ${item.price}₸`;

  const button = document.createElement("button");
  button.textContent = "🛒 В корзину";
  button.addEventListener("click", () => addToCart(item));

  div.appendChild(img);
  div.appendChild(name);
  div.appendChild(desc);
  div.appendChild(price);
  div.appendChild(button);

  return div;
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${item.name} добавлен в корзину!`);
}

loadExcelData();
