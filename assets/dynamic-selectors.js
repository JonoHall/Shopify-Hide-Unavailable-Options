let pickerType = (document.querySelector('variant-radios')) ? 'radios' : 'selects';
let variantSelects = (pickerType == 'radios') ? document.querySelector('variant-radios') : document.querySelector('variant-selects'); 
let fieldsets = (pickerType == 'radios') ? Array.from(variantSelects.querySelectorAll('fieldset')) : Array.from(variantSelects.querySelectorAll('.product-form__input--dropdown'));

this.rebuildOptions();

//gather a list of valid combinations of options, check to see if the input passed to it matches in a chain of valid options.
function validCombo(inputValue,optionLevel,productJson) {
  const selectedOptions = fieldsets.map((fieldset) => {
      return (pickerType == 'radios') ? Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value : Array.from(fieldset.querySelectorAll('select'), (select) => select.value);
  });

  for(var i = 0, validCombo = false; i < productJson.length && !validCombo; i++) {
    if(optionLevel == 1){
      validCombo = (productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == inputValue) ? true : false;
    } else {
      validCombo = (productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == selectedOptions[1] && productJson[i].option3 == inputValue) ? true : false;
    }
  }
  return validCombo;
}

function rebuildOptions() {
  const productJson = JSON.parse(variantSelects.querySelector('[type="application/json"]').textContent);
  variantSelects.addEventListener('change', rebuildOptions);
  
  //loop through the option sets starting from the 2nd set and disable any invalid options
  for(var optionLevel = 1, n = fieldsets.length; optionLevel < n; optionLevel++) {
    const inputs = (pickerType == 'radios') ? fieldsets[optionLevel].querySelectorAll('input') : fieldsets[optionLevel].querySelectorAll('option');

    inputs.forEach(input => {
      input.disabled = (validCombo(input.value,optionLevel,productJson)) ? false : true;
      if(pickerType == 'radios'){
        //get the label for the current input (this is what the user clicks, the "pill")
        const label = fieldsets[optionLevel].querySelector(`label[for="${input.id}"]`);

        label.style.display = (input.disabled) ? "none" : ""; //Hide the option, or comment this line out and use the following lines to style it..
        //label.style.opacity = (input.disabled) ? 0.5 : 1;
        //label.style.borderStyle = (input.disabled) ? "dashed" : "solid";
        //label.style.textDecoration = (input.disabled) ? "none" : "";
      } else {
        input.hidden = (validCombo(input.value,optionLevel,productJson)) ? false : true;
      }
    });
  };

  //if the default selected option is disabled with the function above, select the first available option instead
  for (var optionLevel = 1, n = fieldsets.length, change = false; optionLevel < n && !change; optionLevel++) {
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
}
