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
        },
        updateItem: function(name, amount){
            // amount to number
            amount = parseInt(amount);
            // Return updated item
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.amount = amount;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            // Get ids
            ids = data.items.map(item => item.id);
            // Get index
            const index = ids.indexOf(id);
            // Break item index
            data.items.splice(index, 1)
        },
        clearAllItems: function(){
            data.items = [];
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
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
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
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Convert nodeList into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong><em>$${item.amount}</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i></a>`;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Convert list to array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
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
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // Item update submit
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
         // Item delete submit
         document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Back btn 
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        // Clear btn 
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearListClick);
        // Disable enter on submit
        document.addEventListener('keypress', function(event){
            if(event.keycode === 13 || event.which === 13){
                event.preventDefault();
                return false;
            }
        })
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
    };

    // Edit icon event
    const itemEditClick = function(event){
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

    // Update item submit
    const itemUpdateSubmit = function(event){
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name, input.amount);
        // Update in UI
        UICtrl.updateListItem(updatedItem);
        // Get total amount
        const totalAmount = ItemCtrl.getTotalAmount();
        // Add total to UI
        UICtrl.addTotalAmountUI(totalAmount);
        // Clear fields
        UICtrl.clearEditState();

        event.preventDefault();
    }

    // Delete item submit
    const itemDeleteSubmit = function(event){
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete in data
        ItemCtrl.deleteItem(currentItem.id);
        // delete in UI
        UICtrl.deleteListItem(currentItem.id);

        
        // Get total amount
        const totalAmount = ItemCtrl.getTotalAmount();
        // Add total to UI
        UICtrl.addTotalAmountUI(totalAmount);
        // Clear fields
        UICtrl.clearEditState();

        event.preventDefault();
    }

    // Clear item event
    const clearListClick = function(){
        // Delete from data
        ItemCtrl.clearAllItems();
        // Get total amount
        const totalAmount = ItemCtrl.getTotalAmount();
        // Add total to UI
        UICtrl.addTotalAmountUI(totalAmount);
        // Remove in UI
        UICtrl.removeItems();

        
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