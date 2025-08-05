// Dữ liệu mẫu
const orders = [
  {
    id: 1,
    table: "Bàn 1",
    time: "10:00",
    drinks: ["Trà đá", "Cafe đen"],
  },
  {
    id: 2,
    table: "Bàn 2",
    time: "10:15",
    drinks: ["Trà chanh", "Sữa chua lắc"],
  }
];

let currentEditingOrderId = null;

function renderOrders() {
  const container = document.getElementById("pendingOrders");
  container.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    const info = document.createElement("p");
    info.innerText = `${order.table} - ${order.time}`;
    card.appendChild(info);

    const showBtn = document.createElement("button");
    showBtn.textContent = "Hiện đồ uống";
    const drinkList = document.createElement("ul");
    drinkList.className = "drinks-list";
    order.drinks.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      drinkList.appendChild(li);
    });
    showBtn.onclick = () => {
      drinkList.style.display = drinkList.style.display === "none" ? "block" : "none";
    };
    card.appendChild(showBtn);
    card.appendChild(drinkList);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Chỉnh sửa";
    editBtn.onclick = () => openEditModal(order.id);
    card.appendChild(editBtn);

    container.appendChild(card);
  });
}

function openEditModal(orderId) {
  currentEditingOrderId = orderId;
  const order = orders.find(o => o.id === orderId);
  const drinkList = document.getElementById("drinkList");
  drinkList.innerHTML = "";
  order.drinks.forEach((drink, idx) => {
    const li = document.createElement("li");
    li.textContent = drink;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.onclick = () => {
      order.drinks.splice(idx, 1);
      openEditModal(orderId);
    };
    li.appendChild(removeBtn);
    drinkList.appendChild(li);
  });

  document.getElementById("editModal").style.display = "flex";
}

document.getElementById("cancelEditBtn").onclick = () => {
  document.getElementById("editModal").style.display = "none";
};

document.getElementById("saveEditBtn").onclick = () => {
  document.getElementById("editModal").style.display = "none";
  renderOrders();
};

document.getElementById("addDrinkBtn").onclick = () => {
  const input = document.getElementById("newDrinkInput");
  const newDrink = input.value.trim();
  if (newDrink && currentEditingOrderId !== null) {
    const order = orders.find(o => o.id === currentEditingOrderId);
    order.drinks.push(newDrink);
    input.value = "";
    openEditModal(currentEditingOrderId); // reload lại modal
  }
};

renderOrders();
