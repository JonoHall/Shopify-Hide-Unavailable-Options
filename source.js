// Source: https://github.com/JonoHall/Shopify-Hide-Unavailable-Option
var variantSelects = (document.querySelector('variant-selects')) ? document.querySelector('variant-selects') : document.querySelector('variant-radios');
const productJson = {{ product.variants | json }};
let selectedOptions = [];

this.rebuildOptions(variantSelects);

// gather a list of valid combinations of options, check to see if the input passed to it matches in a chain of valid options.
function validCombo(inputValue, optionLevel) {
  for(let i = 0; i < productJson.length; i++) {
    if(optionLevel == 1){
      if (productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == inputValue) {  return true; }
    } else {
      if (productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == selectedOptions[1] && productJson[i].option3 == inputValue) {  return true; }
    }
  }
}

function rebuildOptions(variantSelects) {
  const pickerType = (variantSelects.querySelectorAll('fieldset').length > 0) ? 'radios' : 'selects';
  const fieldsets = (pickerType == 'radios') ? Array.from(variantSelects.querySelectorAll('fieldset')) : Array.from(variantSelects.querySelectorAll('.product-form__input--dropdown'));
    selectedOptions = fieldsets.map((fieldset) => {
        return (pickerType == 'radios') ? Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value : Array.from(fieldset.querySelectorAll('select'), (select) => select.value);
    });
    
    //loop through the option sets starting from the 2nd set and disable any invalid options
    for(let optionLevel = 1, n = fieldsets.length; optionLevel < n; optionLevel++) {
        const inputs = (pickerType == 'radios') ? fieldsets[optionLevel].querySelectorAll('input') : fieldsets[optionLevel].querySelectorAll('option');

        inputs.forEach(input => {
          input.disabled = (validCombo(input.value,optionLevel)) ? false : true;
          if(pickerType == 'radios'){
              //get the label for the current input (this is what the user clicks, the "pill")
              const label = fieldsets[optionLevel].querySelector(`label[for="${input.id}"]`);
  
              label.style.display = (input.disabled) ? "none" : ""; //Hide the option, or comment this line out and use the following lines to style it..
              //label.style.opacity = (input.disabled) ? 0.5 : 1;
              //label.style.borderStyle = (input.disabled) ? "dashed" : "solid";
              //label.style.textDecoration = (input.disabled) ? "none" : "";
          } else {
              input.hidden = (validCombo(input.value,optionLevel)) ? false : true;
          }
        });
    }

    //if the default selected option is disabled with the function above, select the first available option instead
    for (let optionLevel = 1, fieldsetsLength = fieldsets.length, change = false; optionLevel < fieldsetsLength && !change; optionLevel++) {
        if(pickerType == 'radios'){
        if(fieldsets[optionLevel].querySelector('input:checked').disabled === true) {
            change = (fieldsets[optionLevel].querySelector('input:not(:disabled)').checked = true);
        }
        } else {
        if(fieldsets[optionLevel].querySelector('option:checked').disabled === true) {
            change = (fieldsets[optionLevel].querySelector('option:not(:disabled)').selected = "selected");
        }
        }
        //if a new option has been selected, restart the whole process
        if(change) variantSelects.dispatchEvent(new Event('change', { bubbles: true }));
    }

// Select the node that will be observed for mutations
const targetNode = variantSelects.parentElement;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeName == "VARIANT-SELECTS") {
            variantSelects = addedNode;
            this.rebuildOptions(addedNode);   
        }
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
}
