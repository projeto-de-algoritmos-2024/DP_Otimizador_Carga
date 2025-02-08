// Elementos do DOM
const maxWeightInput = document.getElementById("maxWeight");
const itemNameInput = document.getElementById("itemName");
const itemWeightInput = document.getElementById("itemWeight");
const itemValueInput = document.getElementById("itemValue");
const addItemButton = document.getElementById("addItem");
const generateItemsButton = document.getElementById("generateItems");
const optimizeButton = document.getElementById("optimize");
const itemsListElement = document.getElementById("itemsList");
const totalValueElement = document.getElementById("totalValue");
const totalWeightElement = document.getElementById("totalWeight");
const selectedItemsElement = document.getElementById("selectedItems");

// Event Listeners
addItemButton.addEventListener("click", addItem);
optimizeButton.addEventListener("click", optimizeLoad);
