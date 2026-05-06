# Cart Page

## URL
/cart.html

## Purpose
Displays all items added to the cart. Users can review items, remove them,
continue shopping, or proceed to checkout from this page.

## Elements

### Cart Items
- Cart item list container
  - Class: cart_list
- Individual cart item
  - Class: cart_item
- Item name (within a cart item)
  - Class: inventory_item_name
- Item price (within a cart item)
  - Class: inventory_item_price

### Buttons
- Checkout button
  - Visible text: "Checkout"
  - Attribute: data-test="checkout"
- Continue Shopping button
  - Visible text: "Continue Shopping"
  - Attribute: data-test="continue-shopping"
- Remove button (per item)
  - Attribute: data-test="remove-{product-slug}"

### Header
- Cart icon (top right, same as inventory page)
  - Attribute: data-test="shopping-cart-link"
- Page title
  - Class: title
  - Text content: "Your Cart"

## Actions
- Verify number of items in the cart
- Click Checkout button to proceed to checkout step one
- Click Continue Shopping to go back to inventory
- Remove an item from the cart

## Expected Behaviours
| Scenario                          | Result                                            |
|-----------------------------------|---------------------------------------------------|
| Navigate to cart with 2 items     | Two cart items are listed                         |
| Click Checkout                    | Navigates to /checkout-step-one.html              |
| Click Continue Shopping           | Navigates back to /inventory.html                 |
