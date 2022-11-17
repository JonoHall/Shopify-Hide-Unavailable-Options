let pickerType = (document.querySelector('variant-radios')) ? 'radios' : 'selects';
let variantSelects = (pickerType == 'radios') ? document.querySelector('variant-radios') : document.querySelector('variant-selects');
let productJson = JSON.parse(variantSelects.querySelector('[type="application/json"]').textContent);
let fieldsets = (pickerType == 'radios') ? Array.from(variantSelects.querySelectorAll('fieldset')) : Array.from(variantSelects.querySelectorAll('.product-form__input--dropdown'));

this.rebuildOptions();

//gather a list of valid combinations of options, check to see if the input passed to it matches in a chain of valid options.
function validCombo(inputValue,optionLevel,selectedOptions) {
    for (var i = 0, validCombo = false; i < productJson.length && !validCombo; i++) {
      if(optionLevel == 1){
        if(productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == inputValue) validCombo = true;
      } else {
        if(productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == selectedOptions[1] && productJson[i].option3 == inputValue) validCombo = true;
      }
    }
    return validCombo;
}

function rebuildOptions() {
  variantSelects.addEventListener('change', rebuildOptions);
  
  //build an array of currently selected options
  const selectedOptions = fieldsets.map((fieldset) => {
      var options = (pickerType == 'radios') ? Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value : Array.from(fieldset.querySelectorAll('select'), (select) => select.value);
      return options;
  });
  
  //loop through the option sets starting from the 2nd set and disable any invalid options
  for (var optionLevel = 1, n = fieldsets.length; optionLevel < n; optionLevel++) {
      const inputs = (pickerType == 'radios') ? fieldsets[optionLevel].querySelectorAll('input') : fieldsets[optionLevel].querySelectorAll('option');

      inputs.forEach(input => {
        input.disabled = (!validCombo(input.value,optionLevel,selectedOptions)) ? true : false;
        if(pickerType == 'radios'){
          //get the label for the current input and hide it if it is not a valid combo option
          const label = fieldsets[optionLevel].querySelector(`label[for="${input.id}"]`);

          if(input.disabled){
            label.style.display = "none"; //Hide the option, or comment this line out and style it like below..
            //label.style.opacity = "0.3";
            //label.style.borderStyle = "dashed";
          } else {
            label.style.display = ""; //Show the option, or comment this line out and style it like below..
            //label.style.opacity = "1";
            //label.style.borderStyle = "solid";
          }
        } else {
          input.hidden = (!validCombo(input.value,optionLevel,selectedOptions)) ? true : false;
        }
      });
  };

  //if the default selected option is disabled with the function above, select the first available option instead
  for (var optionLevel = 1, n = fieldsets.length, change = false; optionLevel < n && !change; optionLevel++) {
      if(pickerType == 'radios'){
        if(fieldsets[optionLevel].querySelector('input:checked').disabled === true) {
          fieldsets[optionLevel].querySelector('input:not(:disabled)').checked = true;

          //if an option has been changed, break out of the loop and restart the whole process with the newly selected option
          change = true;
          variantSelects.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        if(fieldsets[optionLevel].querySelector('option:checked').disabled === true) {
          fieldsets[optionLevel].querySelector('option:not(:disabled)').selected = "selected";
          //if an option has been changed, break out of the loop and restart the whole process with the newly selected option
          change = true;
          variantSelects.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      
  }

}
