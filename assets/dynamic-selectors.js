this.rebuildOptions();

function rebuildOptions() {
  const variantRadios = document.querySelector('variant-radios');
  //get the option sets (option1, option2 etc)
  const fieldsets = Array.from(variantRadios.querySelectorAll('fieldset'));
  //build an array of currently selected options
  const selectedOptions = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
  });

  //loop through the option sets starting from the 2nd set and disable any invalid options
  for (var optionLevel = 1, n = fieldsets.length; optionLevel < n; optionLevel++) {
      const inputs = fieldsets[optionLevel].querySelectorAll('input');
      inputs.forEach(input => {
          //get the label for the current input and hide it if it is not a valid combo option
          const label = fieldsets[optionLevel].querySelector(`label[for="${input.id}"]`);
          input.disabled = (!this.validCombo(input.value,optionLevel,selectedOptions)) ? true : false;

          if(input.disabled){
            label.style.display = "none"; //Hide the option, or style it like below..
            //label.style.opacity = "0.3";
            //label.style.borderStyle = "dashed";
          } else {
            label.style.display = ""; //Show the option, or style it like below..
            //label.style.opacity = "1";
            //label.style.borderStyle = "solid";
          }
      });
  };

  //if the default selected option is disabled with the function above, select the first available option instead
  for (var optionLevel = 1, n = fieldsets.length, change = false; optionLevel < n && !change; optionLevel++) {
      if(fieldsets[optionLevel].querySelector('input:checked').disabled === true) {
          fieldsets[optionLevel].querySelector(`input:not(:disabled)`).checked = true;

          //if an option has been changed, break out of the loop and restart the whole process with the newly selected option
          change = true;
          variantRadios.dispatchEvent(new Event('change', { bubbles: true }));
      }
  }

  variantRadios.addEventListener('change', rebuildOptions());
}

//gather a list of valid combinations of options, check to see if the input passed to it matches in a chain of valid options.
function validCombo(inputValue,optionLevel,selectedOptions) {
    const variantRadios = document.querySelector('variant-radios');
    const productJson = JSON.parse(variantRadios.querySelector('[type="application/json"]').textContent);
    for (var i = 0, validCombo = false; i < productJson.length && !validCombo; i++) {
      if(optionLevel == 1){
        if(productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == inputValue) validCombo = true;
      } else {
        if(productJson[i].option1 == selectedOptions[0] && productJson[i].option2 == selectedOptions[1] && productJson[i].option3 == inputValue) validCombo = true;
      }
    }
    return validCombo;
}