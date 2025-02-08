const itemsData = {
  items: [
    "Caixa de Eletrônicos",
    "Móveis de Escritório",
    "Material de Construção",
    "Alimentos não perecíveis",
    "Equipamentos de Ginástica",
    "Livros",
    "Roupas",
    "Brinquedos",
    "Ferramentas",
    "Produtos de Limpeza",
    "Equipamentos de Informática",
    "Material Escolar",
    "Utensílios Domésticos",
    "Produtos de Jardinagem",
    "Equipamentos Esportivos",
    "Instrumentos Musicais",
    "Peças Automotivas",
    "Artigos de Decoração",
    "Material de Pintura",
    "Equipamentos de Camping",
  ],
};

// Estado global da aplicação
let items = [];

// Implementação do algoritmo Knapsack com Programação Dinâmica
function knapsackDP(capacity, weights, values, n) {
  // Criação da matriz de programação dinâmica
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  // Matriz para rastrear os itens selecionados
  const selected = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(false));

  // Preenchimento da matriz dp
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        // Se podemos incluir o item atual
        const includeItem = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const excludeItem = dp[i - 1][w];

        if (includeItem > excludeItem) {
          dp[i][w] = includeItem;
          selected[i][w] = true;
        } else {
          dp[i][w] = excludeItem;
          selected[i][w] = false;
        }
      } else {
        // Se não podemos incluir o item atual
        dp[i][w] = dp[i - 1][w];
        selected[i][w] = false;
      }
    }
  }

  // Recuperar os itens selecionados
  const selectedItems = [];
  let i = n;
  let w = capacity;

  while (i > 0 && w > 0) {
    if (selected[i][w]) {
      selectedItems.push(i - 1);
      w -= weights[i - 1];
    }
    i--;
  }

  return {
    maxValue: dp[n][capacity],
    selectedItems: selectedItems,
  };
}

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

// Funções de manipulação da interface
function addItem() {
  const name = itemNameInput.value.trim();
  const weight = parseFloat(itemWeightInput.value);
  const value = parseFloat(itemValueInput.value);

  if (!name || isNaN(weight) || isNaN(value)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const item = {
    name,
    weight,
    value,
  };

  items.push(item);
  updateItemsList();
  clearInputs();
}

function removeItem(index) {
  items.splice(index, 1);
  updateItemsList();
}

function clearInputs() {
  itemNameInput.value = "";
  itemWeightInput.value = "";
  itemValueInput.value = "";
  itemNameInput.focus();
}

function updateItemsList() {
  itemsListElement.innerHTML = "";

  items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${item.name}</td>
              <td>${item.weight.toFixed(1)} kg</td>
              <td>R$ ${item.value.toFixed(2)}</td>
              <td>
                  <button class="btn-delete" onclick="removeItem(${index})">Remover</button>
              </td>
          `;
    itemsListElement.appendChild(row);
  });
}

function optimizeLoad() {
  const maxWeight = parseFloat(maxWeightInput.value);

  if (isNaN(maxWeight) || maxWeight <= 0) {
    alert("Por favor, insira uma capacidade máxima válida.");
    return;
  }

  if (items.length === 0) {
    alert("Por favor, adicione alguns itens primeiro.");
    return;
  }

  const weights = items.map((item) => Math.round(item.weight * 10)); // Multiplicamos por 10 para trabalhar com números inteiros
  const values = items.map((item) => Math.round(item.value * 100)); // Multiplicamos por 100 para trabalhar com números inteiros
  const capacity = Math.round(maxWeight * 10); // Multiplicamos por 10 para manter a mesma escala dos pesos

  const result = knapsackDP(capacity, weights, values, items.length);

  // Calcular totais
  let totalWeight = 0;
  let totalValue = 0;

  // Limpar lista de itens selecionados
  selectedItemsElement.innerHTML = "";

  // Adicionar itens selecionados à lista
  result.selectedItems.forEach((index) => {
    const item = items[index];
    totalWeight += item.weight;
    totalValue += item.value;

    const li = document.createElement("li");
    li.innerHTML = `
              <span>${item.name}</span>
              <span>${item.weight.toFixed(1)} kg - R$ ${item.value.toFixed(
      2
    )}</span>
          `;
    selectedItemsElement.appendChild(li);
  });

  // Atualizar sumário
  totalValueElement.textContent = `R$ ${totalValue.toFixed(2)}`;
  totalWeightElement.textContent = `${totalWeight.toFixed(1)} kg`;
}

// Event Listeners
addItemButton.addEventListener("click", addItem);
optimizeButton.addEventListener("click", optimizeLoad);

// Permitir adicionar item com Enter
[itemNameInput, itemWeightInput, itemValueInput].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  });
});
