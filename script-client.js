import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const menuItems = [
    { id: 1, name: 'Trà Đá', price: 5000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 2, name: 'Trà Chanh', price: 15000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 3, name: 'Trà Quất', price: 15000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 4, name: 'Cafe Nâu', price: 18000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 5, name: 'Cafe Đen', price: 15000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 6, name: 'Bim Bim', price: 10000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 7, name: 'Hướng Dương', price: 15000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 8, name: 'Thăng Long Cứng', price: 10000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
    { id: 9, name: 'Cay Cay', price: 10000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7x_fM7tHjPz1Q614Ww&oe=6664972E' },
];
// Các biến toàn cục
let cart = [];
let customizationModal = document.getElementById('customizationModal');
let orderModal = document.getElementById('orderModal');
let customizationItemName = document.getElementById('customizationItemName');
let sugarOptions = document.getElementById('sugarOptions');
let iceOptions = document.getElementById('iceOptions');
let toppingOptions = document.getElementById('toppingOptions');
let totalPriceEl = document.getElementById('totalPrice');
let cartItemsEl = document.getElementById('cartItems');
let modalQuantityEl = document.getElementById('modalQuantity');
let currentItem = null;
let modalQuantity = 1;

// Hàm định dạng tiền tệ
const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number);
};

// Hiển thị danh sách menu
const renderMenu = () => {
    const menuEl = document.getElementById('menu');
    menuItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('menu-item');
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${formatCurrency(item.price)}</p>
            <button onclick="showCustomizationModal(${item.id})">Thêm vào giỏ</button>
        `;
        menuEl.appendChild(itemEl);
    });
};

// Hiển thị giỏ hàng
const renderCart = () => {
    cartItemsEl.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <p>${item.name} x${item.quantity} - ${formatCurrency(item.price)}</p>
                <small>${item.options}</small>
                <button onclick="increaseQuantity(${index})">+</button>
                <button onclick="decreaseQuantity(${index})">-</button>
                <button onclick="removeItem(${index})">Xóa</button>
            `;
            cartItemsEl.appendChild(cartItemEl);
            total += item.price;
        });
    }
    totalPriceEl.innerText = formatCurrency(total);
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Hiển thị modal tùy chỉnh
const showCustomizationModal = (itemId) => {
    currentItem = menuItems.find(item => item.id === itemId);
    if (!currentItem) return;

    customizationItemName.innerText = currentItem.name;
    modalQuantity = 1;
    modalQuantityEl.innerText = modalQuantity;
    sugarOptions.innerHTML = '';
    iceOptions.innerHTML = '';
    toppingOptions.innerHTML = '';

    const itemsWithoutCustom = ['Trà Đá', 'Bim Bim', 'Hướng Dương', 'Thăng Long Cứng', 'Cay Cay'];

    if (itemsWithoutCustom.includes(currentItem.name)) {
        document.getElementById('iceSugarOptions').style.display = 'none';
    } else {
        document.getElementById('iceSugarOptions').style.display = 'block';

        const sugarLevels = [100, 70, 50, 30, 0];
        sugarLevels.forEach((level, index) => {
            const btn = document.createElement('button');
            btn.innerText = `${level}%`;
            if (index === 0) btn.classList.add('selected');
            btn.addEventListener('click', () => {
                document.querySelectorAll('#sugarOptions button').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
            sugarOptions.appendChild(btn);
        });

        const iceLevels = [100, 70, 50, 30, 0];
        iceLevels.forEach((level, index) => {
            const btn = document.createElement('button');
            btn.innerText = `${level}%`;
            if (index === 0) btn.classList.add('selected');
            btn.addEventListener('click', () => {
                document.querySelectorAll('#iceOptions button').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
            iceOptions.appendChild(btn);
        });
    }

    if (currentItem.name === 'Trà Chanh' || currentItem.name === 'Trà Quất') {
        const toppingBtn = document.createElement('button');
        toppingBtn.innerText = 'Nha đam (+5,000 VNĐ)';
        toppingBtn.addEventListener('click', () => {
            toppingBtn.classList.toggle('selected');
        });
        toppingOptions.appendChild(toppingBtn);
    }

    customizationModal.style.display = 'flex';
};

// Đóng modal tùy chỉnh
const closeCustomizationModal = () => {
    customizationModal.style.display = 'none';
};

// Cập nhật số lượng trong modal
const updateModalQuantity = (change) => {
    modalQuantity += change;
    if (modalQuantity < 1) modalQuantity = 1;
    modalQuantityEl.innerText = modalQuantity;
};
document.getElementById('increaseQuantity').addEventListener('click', () => updateModalQuantity(1));
document.getElementById('decreaseQuantity').addEventListener('click', () => updateModalQuantity(-1));

// Thêm món vào giỏ hàng từ modal
const addToCartFromModal = () => {
    let options = '';
    let itemPrice = currentItem.price;

    const itemsWithoutCustom = ['Trà Đá', 'Bim Bim', 'Hướng Dương', 'Thăng Long Cứng', 'Cay Cay'];
    if (!itemsWithoutCustom.includes(currentItem.name)) {
        const selectedSugar = document.querySelector('#sugarOptions .selected');
        const selectedIce = document.querySelector('#iceOptions .selected');
        options += `Đường: ${selectedSugar.innerText}, Đá: ${selectedIce.innerText}`;

        if (currentItem.name === 'Trà Chanh' || currentItem.name === 'Trà Quất') {
            const toppingBtn = document.querySelector('#toppingOptions button');
            if (toppingBtn && toppingBtn.classList.contains('selected')) {
                options += ', Topping: Nha đam';
                itemPrice += 5000;
            }
        }
    } else {
        options = 'Không có tùy chỉnh';
    }

    const existingItem = cart.find(item => item.id === currentItem.id && item.options === options);

    if (existingItem) {
        existingItem.quantity += modalQuantity;
        existingItem.price = (itemPrice * existingItem.quantity);
    } else {
        cart.push({
            id: currentItem.id,
            name: currentItem.name,
            quantity: modalQuantity,
            price: itemPrice * modalQuantity,
            options: options
        });
    }

    renderCart();
    closeCustomizationModal();
};

// Tăng/giảm số lượng trong giỏ hàng
const increaseQuantity = (index) => {
    const item = cart[index];
    const unitPrice = item.price / item.quantity;
    item.quantity++;
    item.price = unitPrice * item.quantity;
    renderCart();
};
const decreaseQuantity = (index) => {
    const item = cart[index];
    if (item.quantity > 1) {
        const unitPrice = item.price / item.quantity;
        item.quantity--;
        item.price = unitPrice * item.quantity;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
};

// Xóa món khỏi giỏ hàng
const removeItem = (index) => {
    cart.splice(index, 1);
    renderCart();
};

// Xóa toàn bộ giỏ hàng
const clearCart = () => {
    cart = [];
    renderCart();
};

// Hiển thị modal đặt hàng
const showOrderModal = (orderType) => {
    const orderOptionsEl = document.getElementById('orderOptions');
    orderOptionsEl.innerHTML = '';
    document.getElementById('orderModalTitle').innerText = (orderType === 'dine-in') ? 'Uống Tại Chỗ' : 'Đặt Giao Hàng';

    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    if (orderType === 'dine-in') {
        orderOptionsEl.innerHTML = `
            <label for="tableNumber">Số Bàn:</label>
            <input type="number" id="tableNumber" required>
        `;
    } else {
        orderOptionsEl.innerHTML = `
            <label for="customerName">Tên:</label>
            <input type="text" id="customerName" required>
            <label for="phone">Số điện thoại:</label>
            <input type="tel" id="phone" required>
            <label for="address">Địa chỉ:</label>
            <input type="text" id="address" required>
        `;
    }
    orderOptionsEl.innerHTML += `
        <label for="orderNote">Ghi chú:</label>
        <textarea id="orderNote"></textarea>
    `;

    orderModal.style.display = 'flex';
};

// Đóng modal đặt hàng
const closeOrderModal = () => {
    orderModal.style.display = 'none';
};

// Gửi đơn hàng
const submitOrder = async () => {
    const orderType = document.getElementById('orderModalTitle').innerText === 'Uống Tại Chỗ' ? 'dine-in' : 'delivery';
    const orderNote = document.getElementById('orderNote').value;
    let customerInfo;

    if (orderType === 'dine-in') {
        const tableNumber = document.getElementById('tableNumber').value;
        if (!tableNumber) {
            alert('Vui lòng nhập số bàn!');
            return;
        }
        customerInfo = { type: 'Uống Tại Chỗ', tableNumber };
    } else if (orderType === 'delivery') {
        const customerName = document.getElementById('customerName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        if (!customerName || !phone || !address) {
            alert('Vui lòng nhập đủ thông tin giao hàng!');
            return;
        }
        customerInfo = { type: 'Giao hàng', customerName, phone, address };
    } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
        return;
    }

    const newOrder = {
        items: cart,
        customerInfo: customerInfo,
        totalPrice: parseFloat(document.getElementById('totalPrice').innerText.replace(/[^0-9]/g, '')),
        status: 'Đang chờ xử lý',
        isPaid: false,
        note: orderNote,
        createdAt: new Date()
    };
    
    try {
        await addDoc(collection(db, "orders"), newOrder);
        alert("Đơn hàng của bạn đã được gửi thành công!");
        cart = [];
        renderCart();
        closeOrderModal();
    } catch (e) {
        console.error("Lỗi khi thêm đơn hàng: ", e);
        alert("Có lỗi xảy ra khi gửi đơn hàng!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Lấy giỏ hàng từ localStorage khi tải trang
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    renderMenu();
    renderCart();

    document.getElementById('dineInBtn').addEventListener('click', () => showOrderModal('dine-in'));
    document.getElementById('deliveryBtn').addEventListener('click', () => showOrderModal('delivery'));
    document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);
    
    document.getElementById('addToCartModalBtn').addEventListener('click', addToCartFromModal);
    
    document.getElementById('closeCustomizationModal').addEventListener('click', closeCustomizationModal);
    document.getElementById('closeOrderModal').addEventListener('click', closeOrderModal);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
});

// Gán hàm global để có thể gọi từ HTML inline
window.showCustomizationModal = showCustomizationModal;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
