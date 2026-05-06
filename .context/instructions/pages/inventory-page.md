# Inventory Page

## URL
/inventory.html

## Purpose
The main product listing page shown after a successful login. Displays all available
products. Users can add items to the cart from here and navigate to the cart via
the cart icon in the header.

## Elements

### Product Items
- Product list container
  - Class: inventory_list
- Individual product item
  - Class: inventory_item
- Add to Cart button (per product)
  - Attribute: data-test="add-to-cart-{product-slug}"
  - Generic selector for all add-to-cart buttons: button[data-test^="add-to-cart"]
- First product's Add to Cart button
  - Select via: button[data-test^="add-to-cart"]:nth-of-type(1) or first() on the list
- Second product's Add to Cart button
  - Select via: button[data-test^="add-to-cart"]:nth-of-type(2) or nth(1) on the list

### Header
- Cart icon (top right)
  - Class: shopping_cart_link
  - Attribute: data-test="shopping-cart-link"
- Cart badge (shows item count)
  - Class: shopping_cart_badge
- Page title
  - Class: title
  - Text content: "Products"

### Sort Dropdown
- Sort container
  - Class: product_sort_container
  - Attribute: data-test="product-sort-container"
- Sort options (select by visible label):
  - "Name (A to Z)"       → option value: "az"   (default)
  - "Name (Z to A)"       → option value: "za"
  - "Price (low to high)" → option value: "lohi"
  - "Price (high to low)" → option value: "hilo"

## Actions
- Add the first product to cart (click first Add to Cart button)
- Add the second product to cart (click second Add to Cart button)
- Click the cart icon to navigate to the cart page
- Read the cart badge count
- Sort products by selecting an option from the sort dropdown (use selectOption with visible label text)
- Read the first product name after sorting

## Expected Behaviours
| Scenario                              | Result                                                        |
|---------------------------------------|---------------------------------------------------------------|
| Page loads after login                | URL is /inventory.html, "Products" title shown                |
| Click Add to Cart on first product    | Cart badge shows 1                                            |
| Click Add to Cart on second product   | Cart badge shows 2                                            |
| Click cart icon                       | Navigates to /cart.html                                       |
| Select "Price (low to high)" in sort  | Products re-order; lowest-priced item appears first in list   |
