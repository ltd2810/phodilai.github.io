import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Menu items data
    const menuItems = [{
            id: 'tra-chanh',
            name: 'Trà Chanh',
            price: 15000,
            image: '1.jpg',
            description: 'Trà chanh pha chế theo công thức đặc biệt.',
            allowToppings: true
        },
        {
            id: 'tra-quat',
            name: 'Trà Quất',
            price: 15000,
            image: '1.jpg',
            description: 'Vị chua của quất kết hợp với trà thơm ngon.',
            allowToppings: true
        },
        {
            id: 'tra-da',
            name: 'Trà Đá',
            price: 5000,
            image: '1.jpg',
            description: 'Trà đá giải khát.',
            allowToppings: false
        },
        {
            id: 'cafe-nau',
            name: 'Cafe Nâu',
            price: 18000,
            image: '1.jpg',
            description: 'Cafe pha phin đậm đà, vị ngon truyền thống.',
            allowToppings: false
        },
        {
            id: 'cafe-den',
            name: 'Cafe Đen',
            price: 15000,
            image: '1.jpg',
            description: 'Cafe đen đá/nóng, nguyên chất.',
            allowToppings: false
        },
        {
            id: 'bim-bim',
            name: 'Bim Bim',
            price: 10000,
            image: '1.jpg',
            description: 'Các loại bim bim ăn vặt.',
            allowToppings: false
        },
        {
            id: 'huong-duong',
            name: 'Hướng Dương',
            price: 15000,
            image: '1.jpg',
            description: 'Hạt hướng dương rang sẵn.',
            allowToppings: false
        },
        {
            id: 'thang-long-cung',
            name: 'Thăng Long Cứng',
            price: 10000,
            image: '1.jpg',
            description: 'Kẹo Thăng Long Cứng.',
            allowToppings: false
        },
        {
            id: 'cay-cay',
            name: 'Cay Cay',
            price: 10000,
            image: '1.jpg',
            description: 'Đồ ăn vặt cay cay.',
            allowToppings: false
        },
    ];

    const menuContainer = document.getElementById('menu-items');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const clearCartButton = document.getElementById('clearCartButton');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const customizeModal = new bootstrap.Modal(document.getElementById('customizeModal'));
    const customizeItemName = document.getElementById('customizeItemName');
    const modalTotalPriceElement = document.getElementById('modal-total-price');
    const addItemToCartButton = document.getElementById('addItemToCartButton');
    const iceSugarOptions = document.getElementById('ice-sugar-options');
    const toppingOptionNhaDam = document.getElementById('topping-option-nha-dam');
    const toppingNhaDamCheckbox = document.getElementById('topping-nha-dam');
    const quantityInput = document.getElementById('quantityInput');
    const increaseQuantityBtn = document.getElementById('increaseQuantity');
    const decreaseQuantityBtn = document.getElementById('decreaseQuantity');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentItemPrice = 0;
    let currentItem = null;

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(number);
    };

    const updateModalTotalPrice = () => {
        let toppingPrice = toppingNhaDamCheckbox.checked ? 5000 : 0;
        let quantity = parseInt(quantityInput.value) || 1;
        modalTotalPriceElement.textContent = formatCurrency((currentItemPrice + toppingPrice) * quantity);
    };

    increaseQuantityBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
        updateModalTotalPrice();
    });

    decreaseQuantityBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
            updateModalTotalPrice();
        }
    });

    toppingNhaDamCheckbox.addEventListener('change', updateModalTotalPrice);
    quantityInput.addEventListener('change', updateModalTotalPrice);


    const renderMenu = () => {
        menuContainer.innerHTML = '';
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'col';
            card.innerHTML = `
                <div class="card h-100 shadow-sm menu-card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title text-center">${item.name}</h5>
                        <p class="card-text text-center text-muted">${formatCurrency(item.price)}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-success add-to-cart-btn" data-item-id="${item.id}">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
            `;
            menuContainer.appendChild(card);
        });
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'list-group-item d-flex justify-content-between align-items-center cart-item';
            cartItem.innerHTML = `
                <div>
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">${item.options}</small>
                </div>
                <div class="d-flex align-items-center">
                    <div class="btn-group btn-group-sm me-2" role="group">
                        <button type="button" class="btn btn-outline-secondary decrease-quantity" data-index="${index}">-</button>
                        <span class="btn btn-light quantity-display">${item.quantity}</span>
                        <button type="button" class="btn btn-outline-secondary increase-quantity" data-index="${index}">+</button>
                    </div>
                    <span class="item-price me-2">${formatCurrency(item.price * item.quantity)}</span>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        cartTotalPrice.textContent = formatCurrency(total);
        saveCart();
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    menuContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const itemId = e.target.dataset.itemId;
            currentItem = menuItems.find(item => item.id === itemId);
            if (currentItem) {
                customizeItemName.textContent = currentItem.name;
                currentItemPrice = currentItem.price;

                // Reset modal options
                document.getElementById('ice100').checked = true;
                document.getElementById('sugar100').checked = true;
                toppingNhaDamCheckbox.checked = false;
                quantityInput.value = 1;


                // Show/hide options based on item
                if (currentItem.allowToppings) {
                    toppingOptionNhaDam.classList.remove('d-none');
                } else {
                    toppingOptionNhaDam.classList.add('d-none');
                }

                const itemsWithoutIceSugar = ['trà đá', 'bim bim', 'hướng dương', 'thăng long cứng', 'cay cay'];
                if (itemsWithoutIceSugar.includes(currentItem.name.toLowerCase())) {
                    iceSugarOptions.classList.add('d-none');
                } else {
                    iceSugarOptions.classList.remove('d-none');
                }

                updateModalTotalPrice();
                customizeModal.show();
            }
        }
    });

    addItemToCartButton.addEventListener('click', () => {
        let selectedIce = document.querySelector('input[name="ice"]:checked');
        let selectedSugar = document.querySelector('input[name="sugar"]:checked');
        let selectedTopping = toppingNhaDamCheckbox.checked ? 'Nha đam' : '';
        let quantity = parseInt(quantityInput.value) || 1;

        let optionsString = '';
        if (iceSugarOptions.classList.contains('d-none')) {
            optionsString = 'Không có tùy chỉnh';
        } else {
            if (selectedIce) {
                optionsString += `Đá: ${document.querySelector(`label[for="${selectedIce.id}"]`).textContent.replace('%', '')}%, `;
            }
            if (selectedSugar) {
                optionsString += `Đường: ${document.querySelector(`label[for="${selectedSugar.id}"]`).textContent.replace('%', '')}%, `;
            }
            if (selectedTopping) {
                optionsString += `Topping: ${selectedTopping}`;
            }
        }
        
        let existingItem = cart.find(item => item.name === currentItem.name && item.options === optionsString);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = (currentItemPrice + (selectedTopping ? 5000 : 0)) * existingItem.quantity;
        } else {
            let itemPrice = (currentItemPrice + (selectedTopping ? 5000 : 0)) * quantity;
            cart.push({
                name: currentItem.name,
                price: itemPrice,
                quantity: quantity,
                options: optionsString.trim().replace(/,$/, '')
            });
        }
        renderCart();
        customizeModal.hide();
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            renderCart();
        } else if (e.target.classList.contains('increase-quantity')) {
            const index = e.target.dataset.index;
            const item = cart[index];
            const basePricePerItem = item.price / item.quantity;
            item.quantity++;
            item.price = basePricePerItem * item.quantity;
            renderCart();
        } else if (e.target.classList.contains('decrease-quantity')) {
            const index = e.target.dataset.index;
            const item = cart[index];
            if (item.quantity > 1) {
                const basePricePerItem = item.price / item.quantity;
                item.quantity--;
                item.price = basePricePerItem * item.quantity;
                renderCart();
            } else {
                cart.splice(index, 1);
                renderCart();
            }
        }
    });

    clearCartButton.addEventListener('click', () => {
        cart = [];
        renderCart();
    });

    // Handle order type selection
    const dineInRadio = document.getElementById('dineIn');
    const deliveryRadio = document.getElementById('delivery');
    const dineInForm = document.getElementById('dineInForm');
    const deliveryForm = document.getElementById('deliveryForm');

    dineInRadio.addEventListener('change', () => {
        dineInForm.classList.remove('d-none');
        deliveryForm.classList.add('d-none');
    });

    deliveryRadio.addEventListener('change', () => {
        dineInForm.classList.add('d-none');
        deliveryForm.classList.remove('d-none');
    });

    placeOrderButton.addEventListener('click', async () => {
        if (cart.length === 0) {
            showToast('Giỏ hàng trống!', false);
            return;
        }

        let orderType = dineInRadio.checked ? 'dineIn' : 'delivery';
        let orderData = {
            items: cart,
            totalPrice: cart.reduce((acc, item) => acc + item.price, 0),
            status: 'Đang làm',
            isPaid: false,
            timestamp: serverTimestamp(),
            note: document.getElementById('customerNote').value
        };

        if (orderType === 'dineIn') {
            const tableNumber = document.getElementById('tableNumber').value;
            if (!tableNumber) {
                showToast('Vui lòng nhập số bàn!', false);
                return;
            }
            orderData.customerInfo = {
                type: 'Uống Tại Chỗ',
                tableNumber: tableNumber
            };
        } else {
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerAddress = document.getElementById('customerAddress').value;
            if (!customerName || !customerPhone || !customerAddress) {
                showToast('Vui lòng nhập đủ thông tin giao hàng!', false);
                return;
            }
            orderData.customerInfo = {
                type: 'Giao Hàng',
                name: customerName,
                phone: customerPhone,
                address: customerAddress
            };
        }

        try {
            const docRef = await addDoc(collection(db, "orders"), orderData);
            console.log("Document written with ID: ", docRef.id);
            showToast('Đơn hàng đã được gửi thành công!');
            cart = [];
            renderCart();
            document.getElementById('customerNote').value = '';
            document.getElementById('tableNumber').value = '';
            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('customerAddress').value = '';
        } catch (e) {
            console.error("Error adding document: ", e);
            showToast('Có lỗi xảy ra khi gửi đơn hàng.', false);
        }
    });

    const showToast = (message, isSuccess = true) => {
        const toastEl = document.getElementById('liveToast');
        const toastBody = document.getElementById('toast-message');
        toastBody.textContent = message;
        if (isSuccess) {
            toastEl.classList.remove('text-bg-danger');
            toastEl.classList.add('text-bg-success');
        } else {
            toastEl.classList.remove('text-bg-success');
            toastEl.classList.add('text-bg-danger');
        }
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    };

    renderMenu();
    renderCart();
});
