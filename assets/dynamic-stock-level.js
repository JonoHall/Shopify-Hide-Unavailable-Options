let maximumStock = 10; //Only show accurate stock level up to this number, then it will say a generic "More than x available".
this.updateStock();

function updateStock(){
  const variantRadios = document.querySelector('variant-radios');
  const fieldsets = Array.from(variantRadios.querySelectorAll('fieldset'));
  const productJson = JSON.parse(variantRadios.querySelector('[type="application/json"]').textContent);
  var inventoryQuantity = 0;

  variantRadios.addEventListener('change', this.updateStock);
  
  const selectedOptions = fieldsets.map((fieldset) => {
    return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
  });

  productJson.map(function(v) {
    if(v.option1 == selectedOptions[0] && v.option2 == selectedOptions[1] && v.option3 == selectedOptions[3]) inventoryQuantity = v.inventory_quantity;
  });
  
  var stockLevelDiv = document.querySelector('#stock-level');

  if(!stockLevelDiv){
    const quantityDiv = document.querySelector(".product-form__quantity");
    var stockLevelDiv = document.createElement("div");
    stockLevelDiv.id = 'stock-level';
    stockLevelDiv = quantityDiv.parentNode.insertBefore(stockLevelDiv, quantityDiv);
  }

  if(inventoryQuantity < 1){
    stockLevelDiv.innerHTML = "No stock available.";
  } else if (inventoryQuantity <= (maximumStock)) {
    stockLevelDiv.innerHTML = "Only " + inventoryQuantity + " left in stock!";
  } else {
    stockLevelDiv.innerHTML = "More than " + maximumStock + " available.";
  }
}