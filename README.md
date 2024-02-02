## Requirements
* Dawn 12/13.

## Changelog
* Small change to detect pills/selects in Dawn 13, kept compatibility with 12.

# Hide Unavailable Combinations

* Hide unavailable options - Hide or restyle variant buttons/drop down options for variant combinations that do not exist.
* Out of stock items will not be affected, this enhancement only affects _unavailable_ combinations. 

## Live Demonstration
The following website is using the default Dawn theme, the password is "dynamic":

https://dynamic-selectors.myshopify.com/products/phone-case

## Known Bugs
Screen seems to jump around a bit when you click on different options.

## Installation
1. Customize your theme.
2. Go to your product template page.
3. Create a "Custom liquid" block in the "Product information" tree (ensure this is _under_ the variant picker block).
4. Paste the contents of the [source.js](source.js) file into your recently created "Custom liquid" block **within javascript script tags**. i.e.:
```
<script language="javascript" type="text/javascript">
  PASTE CONTENTS HERE
</script>
```

![hide-unavailable](https://user-images.githubusercontent.com/4916365/218292562-cf9c8235-5fc6-49ff-aa86-e4020284b23f.png)

## Say thanks!

I've spent countless hours working on this solution, I could have made it into a subscription based app, or kept it for myself. But I'd prefer to give back to the Shopify community. 

But if would like to give a small donation, click the button below to say thanks!

<a href="https://www.buymeacoffee.com/jonohallnz"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=jonohallnz&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
