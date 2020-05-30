// Storage

// Item
const ItemCtrl = (function() {
    // Item Contstructor
    const Item = function(id, name, amount){
        this.id = id;
        this.name = name;
        this.amount = amount;
    }

    // Data
    const data = {
        items: [
            // Hard code example
            // {id: 0, name: 'Phone Bill', amount: '$'+50},
            // {id: 1, name: 'Car Payment', amount: '$'+450},
            // {id: 2, name: 'Grocery', amount: '$'+200}
        ],
        currentItem: null,
        totalAmount: 0
    }

    // Log Data/Public Method
    return {
        getItems: function(){
            return data.items;
        },
        logData: function(){
            return data;
        },
        addItemInput: function(name, amount){
            // Create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id +1;
            } else {
                ID = 0;
            }

            amount = parseInt(amount);
            //  Create new item
            const newItemData = new Item(ID, name, amount);
            // Add to item array
            data.items.push(newItemData);
            return newItemData;
        },
        getTotalAmount: function(){
            let total = 0;
            // Loop through item amounts
            data.items.forEach(function(item){
                total += item.amount;
            });
            // Set total amount in data
            data.totalAmount = total;
            
            return data.totalAmount;
        },
        getItemById: function(id){
            let found = null;
            // Loop through IDs
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        }
    }
})();

// UI
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemName: '#item-name',
        itemAmount: '#item-amount',
        totalAmount: '.total-spend',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn'
    }

    // Public Method
    return {
        populateItemList: function(items){
            let html = '';
            // Add Item
            items.forEach(function(item){
                html += `<li class="collection-item" id="item.${item.id}">
                <strong>${item.name}</strong><em>${item.amount}</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i></a>
            </li>`
            });

            // Insert item to list
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        // Get item input 
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemName).value,
                amount: document.querySelector(UISelectors.itemAmount).value
            }
        },

        // Set UI Selectors public to use in AppCtrl
        getSelectors: function(){
            return UISelectors;
        },

        //  Add list item
        addListItem: function(item){
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name}</strong><em>$${item.amount}</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i></a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        
        clearInput: function(){
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemAmount).value = '';
        },

        addTotalAmountUI: function(totalAmount){
            document.querySelector(UISelectors.totalAmount).textContent = totalAmount;
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemAmount).value = ItemCtrl.getCurrentItem().amount;
            UICtrl.showEditState();
        },

        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        }
    }
})();

// App
const AppCtrl = (function(ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEvents = function(){
        // Grab UIselectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItem);
        // Edit icon event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
    }

    // Add item func
    const addItem = function(event){
        // Get item input from UICtrl
        const input = UICtrl.getItemInput();
        // item input check
        if(input.name !== '' && input.amount !== ''){
            // Add item
            const newItem = ItemCtrl.addItemInput(input.name, input.amount);
            // Add item UI
            UICtrl.addListItem(newItem);
            // Get total amount
            const totalAmount = ItemCtrl.getTotalAmount();
            // Add total to UI
            UICtrl.addTotalAmountUI(totalAmount);
            // Clear fields
            UICtrl.clearInput();
        } else {
            alert('Please complete fields')
        }

        event.preventDefault();
    }

    const itemUpdateSubmit = function(event){
        if(event.target.classList.contains('edit-item')){
            // Get item id
            const listId = event.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            // Get ID number
            const id = parseInt(listIdArr[1]);
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();
        }
        
        event.preventDefault();
    }

    // Initializer/Public Method
    return {
        init: function(){
            // Clear edit state
            UICtrl.clearEditState();
            // Fetch from data
            const items = ItemCtrl.getItems();
            // Add to list
            UICtrl.populateItemList(items);
            // Load event
            loadEvents();
            // Get total amount
            const totalAmount = ItemCtrl.getTotalAmount();
            // Add total to UI
            UICtrl.addTotalAmountUI(totalAmount);
        }
    }

})(ItemCtrl, UICtrl);
// Initialize
AppCtrl.init()