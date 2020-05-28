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
            {id: 0, name: 'Phone Bill', amount: '$'+50},
            {id: 1, name: 'Car Payment', amount: '$'+450},
            {id: 2, name: 'Grocery', amount: '$'+200}
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
        }
    }
})();

// UI
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list'
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
        }
    }
})();

// App
const AppCtrl = (function(ItemCtrl, UICtrl) {
    // Initializer/Public Method
    return {
        init: function(){
            // Fetch from data
            const items = ItemCtrl.getItems();
            // Add to list
            UICtrl.populateItemList(items);
        }
    }

})(ItemCtrl, UICtrl);
// Initialize
AppCtrl.init()