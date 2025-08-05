import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const menuItems = [
    { id: 1, name: 'Trà Đá', price: 5000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349506692808794/tra-da.png?ex=66548777&is=665335f7&hm=550e561a06733230c4929848529244431f1f23719b0098939c3629e46a74b1e5&' },
    { id: 2, name: 'Trà Chanh', price: 10000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349539360829562/tra-chanh.png?ex=6654877f&is=665335ff&hm=00d9841f71a4f00b731327ce473c411516dd545d625d57b11d957f897e937d57&' },
    { id: 3, name: 'Trà Quất', price: 10000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349568285558835/tra-quat.png?ex=66548786&is=66533606&hm=8011246c483d980b182069edc75549045b63b715a31a54722c15147814b74a58&' },
    { id: 4, name: 'Cafe Nâu', price: 20000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349594537156648/cafe-nau.png?ex=6654878c&is=6653360c&hm=a4b0870942d99d34346e9df56d251f22e83161c4f51e34c97ec66d8e063c8ed4&' },
    { id: 5, name: 'Cafe Đen', price: 20000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349624599975949/cafe-den.png?ex=66548793&is=66533613&hm=9003c20c0f99276d47b6a4ce3899452b4748184d092c4537300c0f864e4b519a&' },
    { id: 6, name: 'Bạc Xỉu', price: 25000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349655615707176/bac-xiu.png?ex=6654879a&is=6653361a&hm=4a7065f04b2b2a613f1c911a3b3e215d233406368d4078825c88b688339c0f9a&' },
    { id: 7, name: 'Cafe Muối', price: 25000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349684347715696/cafe-muoi.png?ex=665487a1&is=66533621&hm=442750e41b2a9d665790412b1a134a62e3d37613396627063f9104064560b41c&' },
    { id: 8, name: 'Sữa Chua Lắc', price: 25000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349713609355294/sua-chua-lac.png?ex=665487a8&is=66533628&hm=b54a20689b09a473e04e9c354728f32dd756779430c6c06a38096ddf6048590c&' },
    { id: 9, name: 'SC Lắc Dâu', price: 30000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349743588970526/sua-chua-lac-dau.png?ex=665487b0&is=66533630&hm=895697621c1729487c64a51e626e257088190353c7a72666a3d6d566e133c69c&' },
    { id: 10, name: 'SC Lắc Việt Quất', price: 30000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349771144062996/sua-chua-lac-viet-quat.png?ex=665487b6&is=66533636&hm=39f20e40854d909d94943714207f2402179836362547b850d53457d19e917d5c&' },
    { id: 11, name: 'Bim Bim', price: 6000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349811802996846/bim-bim.png?ex=665487c0&is=66533640&hm=990b79727409249e01168f12128a38c28131d279412f1165c92c90858e8b0305&' },
    { id: 12, name: 'Hướng Dương', price: 10000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349842404096050/huong-duong.png?ex=665487c7&is=66533647&hm=53c52e46b074a3f898305f88426c117b4474704b2b64b584a56a6411d73a6a9b&' },
    { id: 13, name: 'Thăng Long Cứng', price: 15000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349880227129464/thang-long-cung.png?ex=665487d0&is=66533650&hm=f4e5a95d03831777b7df04f475a1d7f451f2871b635293d052a6572f4ae6886e&' },
    { id: 14, name: 'Cay Cay', price: 2000, image: 'https://cdn.discordapp.com/attachments/1244349479366656091/1244349914755106886/cay-cay.png?ex=665487d9&is=66533659&hm=94c1f93f53835e39665551c6c5a04555541603953503a2760a5e8e81d77a0631&' }
];

const customizationOptions = {
    sugar: [100, 70, 50, 30, 0],
    ice: [100, 70, 50, 30, 0],
    toppings: [
        { name: 'Nha đam', price: 5000 }
    ]
};

const noCustomizationIds = [1, 11, 12, 13, 14];

let cart = [];
let currentCustomizingItem = null;

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    setupEventListeners();
    renderCart();
});

function renderMenu() {
    const menuDiv = document.getElementById('menu');
    if (!menuDiv) return;

    menuDiv.innerHTML = '';
    menuItems.forEach(item => {
        const itemHtml = `
            <div class="menu-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.price.toLocaleString('vi-VN')} VNĐ</p>
                <button class="customize-btn" data-id="${item.id}">Thêm vào giỏ</button>
            </div>
        `;
        menuDiv.innerHTML += itemHtml;
    });

    document.querySelectorAll('.customize-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const item = menuItems.find(i => i.id === itemId);
            if (item) {
                showCustomizationModal(item);
            }
        });
    });
}

function setupEventListeners() {
    document.getElementById('closeCustomizationModal')?.addEventListener('click', closeCustomizationModal);
    document.getElementById('addToCartModalBtn')?.addEventListener('click', addToCartFromModal);
    document.getElementById('closeOrderModal')?.addEventListener('click', closeOrderModal);
    document.getElementById('dineInBtn')?.addEventListener('click', () => showOrderModal('Uống tại chỗ'));
    document.getElementById('deliveryBtn')?.addEventListener('click', () => showOrderModal('Giao hàng'));
    document.getElementById('submitOrderBtn')?.addEventListener('click', submitOrder);
    document.getElementById('cart')?.addEventListener('click', handleCartActions);
}

function showCustomizationModal(item) {
    currentCustomizingItem = item;
    const modal = document.getElementById('customizationModal');
    if (!modal) return;

    document.getElementById('customizationItemName').innerText = item.name;

    const sugarOptionsDiv = document.getElementById('sugarOptions');
    const iceOptionsDiv = document.getElementById('iceOptions');
    const toppingOptionsDiv = document.getElementById('toppingOptions');

    if (noCustomizationIds.includes(item.id)) {
        if (sugarOptionsDiv) sugarOptionsDiv.innerHTML = '';
        if (iceOptionsDiv) iceOptionsDiv.innerHTML = '';
        if (toppingOptionsDiv) toppingOptionsDiv.innerHTML = '';
    } else {
        if (sugarOptionsDiv) {
            sugarOptionsDiv.innerHTML = customizationOptions.sugar.map(level => `
                <label><input type="radio" name="sugar" value="${level}" ${level === 100 ? 'checked' : ''}> ${level}%</label>
            `).join('');
        }
        if (iceOptionsDiv) {
            iceOptionsDiv.innerHTML = customizationOptions.ice.map(level => `
                <label><input type="radio" name="ice" value="${level}" ${level === 100 ? 'checked' : ''}> ${level}%</label>
            `).join('');
        }

        if (toppingOptionsDiv) {
            toppingOptionsDiv.innerHTML = '';
            if (item.name.includes('Trà Chanh') || item.name.includes('Trà Quất')) {
                toppingOptionsDiv.innerHTML = customizationOptions.toppings.map(topping => `
                    <label><input type="checkbox" name="topping" value="${topping.name}" data-price="${topping.price}"> ${topping.name} (+${topping.price.toLocaleString('vi-VN')} VNĐ)</label>
                `).join('');
            }
        }
    }
    
    document.getElementById('itemQuantity').value = 1;
    modal.style.display = 'flex';
}

function closeCustomizationModal() {
    const modal = document.getElementById('customizationModal');
    if (modal) modal.style.display = 'none';
    currentCustomizingItem = null;
}

function addToCartFromModal() {
    if (!currentCustomizingItem) return;
    
    const quantityInput = document.getElementById('itemQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    let selectedSugar = 'N/A';
    let selectedIce = 'N/A';
    let selectedToppings = [];
    let toppingPrice = 0;

    if (!noCustomizationIds.includes(currentCustomizingItem.id)) {
        const sugarRadio = document.querySelector('input[name="sugar"]:checked');
        selectedSugar = sugarRadio?.value || '100';

        const iceRadio = document.querySelector('input[name="ice"]:checked');
        selectedIce = iceRadio?.value || '100';
        
        selectedToppings = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(cb => ({
            name: cb.value,
            price: parseInt(cb.dataset.price)
        }));
        toppingPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
    }
    
    const itemWithCustomization = {
        ...currentCustomizingItem,
        quantity: quantity,
        sugar: selectedSugar,
        ice: selectedIce,
        toppings: selectedToppings,
        price: currentCustomizingItem.price + toppingPrice
    };

    cart.push(itemWithCustomization);
    renderCart();
    closeCustomizationModal();
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const totalPriceSpan = document.getElementById('totalPrice');

    if (!cartDiv || !emptyCartMessage || !totalPriceSpan) return;

    cartDiv.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            let customizationString = '';
            if (item.sugar !== 'N/A' || item.ice !== 'N/A' || (item.toppings && item.toppings.length > 0)) {
                const toppingsNames = item.toppings.map(t => t.name).join(', ');
                customizationString = ` (${item.sugar}% đường, ${item.ice}% đá${toppingsNames ? `, Topping: ${toppingsNames}` : ''})`;
            }

            const cartItemHtml = `
                <div class="cart-item">
                    <span>${item.name} (SL: ${item.quantity})${customizationString}</span>
                    <br>
                    <span>${itemTotal.toLocaleString('vi-VN')} VNĐ</span>
                    <div class="cart-actions">
                        <button class="decrease-quantity-btn" data-index="${index}">-</button>
                        <button class="increase-quantity-btn" data-index="${index}">+</button>
                        <button class="remove-from-cart-btn" data-index="${index}">Xóa</button>
                    </div>
                </div>
            `;
            cartDiv.innerHTML += cartItemHtml;
        });
    }

    totalPriceSpan.innerText = totalPrice.toLocaleString('vi-VN');
}

function handleCartActions(e) {
    const target = e.target;
    if (target.classList.contains('increase-quantity-btn')) {
        const index = parseInt(target.dataset.index);
        cart[index].quantity++;
        renderCart();
    } else if (target.classList.contains('decrease-quantity-btn')) {
        const index = parseInt(target.dataset.index);
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            renderCart();
        }
    } else if (target.classList.contains('remove-from-cart-btn')) {
        const index = parseInt(target.dataset.index);
        cart.splice(index, 1);
        renderCart();
    }
}

function showOrderModal(orderType) {
    const orderModalTitle = document.getElementById('orderModalTitle');
    const orderOptions = document.getElementById('orderOptions');
    const orderModal = document.getElementById('orderModal');

    if (!orderModalTitle || !orderOptions || !orderModal) return;

    orderModalTitle.textContent = `Đơn hàng: ${orderType}`;
    orderOptions.innerHTML = '';
    
    let htmlContent = '';
    
    if (orderType === 'Uống tại chỗ') {
        htmlContent = `
            <div class="options-group">
                <label for="tableNumber">Số bàn:</label>
                <select id="tableNumber">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i + 1}">Bàn ${i + 1}</option>`).join('')}
                </select>
            </div>
            <div class="options-group">
                <label for="orderNote">Ghi chú:</label>
                <textarea id="orderNote" placeholder="Ví dụ: Ít đường, ít đá..."></textarea>
            </div>
        `;
    } else {
        htmlContent = `
            <div class="options-group">
                <label for="customerName">Tên của bạn:</label>
                <input type="text" id="customerName" placeholder="Nhập tên của bạn">
            </div>
            <div class="options-group">
                <label for="customerPhone">Số điện thoại:</label>
                <input type="tel" id="customerPhone" placeholder="Nhập số điện thoại của bạn">
            </div>
            <div class="options-group">
                <label for="deliveryAddress">Địa chỉ:</label>
                <textarea id="deliveryAddress" placeholder="Nhập địa chỉ của bạn"></textarea>
            </div>
            <div class="options-group">
                <label for="orderNote">Ghi chú:</label>
                <textarea id="orderNote" placeholder="Ví dụ: Ít đường, ít đá..."></textarea>
            </div>
        `;
    }
    
    orderOptions.innerHTML = htmlContent;
    orderModal.dataset.orderType = orderType;
    orderModal.style.display = 'flex';
}

async function submitOrder() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    
    const orderModal = document.getElementById('orderModal');
    const orderNoteInput = document.getElementById('orderNote');

    if (!orderModal || !orderNoteInput) return;

    const orderType = orderModal.dataset.orderType;
    const orderNote = orderNoteInput.value;
    
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    let orderData = {
        items: cart,
        totalPrice: totalPrice,
        note: orderNote,
        status: 'Đang chờ xử lý',
        isPaid: false,
        createdAt: serverTimestamp(),
        customerInfo: {}
    };

    if (orderType === 'Uống tại chỗ') {
        const tableNumberSelect = document.getElementById('tableNumber');
        const tableNumber = tableNumberSelect?.value;
        if (!tableNumber) {
            alert('Vui lòng chọn số bàn.');
            return;
        }
        orderData.customerInfo = {
            type: 'Uống tại chỗ',
            tableNumber: tableNumber,
        };
    } else {
        const customerNameInput = document.getElementById('customerName');
        const customerPhoneInput = document.getElementById('customerPhone');
        const deliveryAddressInput = document.getElementById('deliveryAddress');

        const customerName = customerNameInput?.value;
        const customerPhone = customerPhoneInput?.value;
        const deliveryAddress = deliveryAddressInput?.value;

        if (!customerName || !customerPhone || !deliveryAddress) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }
        orderData.customerInfo = {
            type: 'Giao hàng',
            customerName: customerName,
            phone: customerPhone,
            address: deliveryAddress
        };
    }

    try {
        await addDoc(collection(db, "orders"), orderData);
        alert('Đơn hàng của bạn đã được gửi thành công!');
        cart = [];
        renderCart();
        closeOrderModal();
    } catch (error) {
        console.error("Lỗi khi gửi đơn hàng: ", error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.style.display = 'none';
}
