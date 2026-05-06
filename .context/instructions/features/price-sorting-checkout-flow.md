# Price Sorting Checkout Flow Tests

## Jira Ticket
- Key: TP-1
- Summary: [E2E] Verify Price Sort → Add to Cart → Checkout → Order Confirmation

## Pages Used
- InventoryPage
- CartPage
- CheckoutPage

## Context
Verifies that a logged-in user can sort products by price (low to high), add the
cheapest product to cart, and complete the full checkout journey ending with a
successful order confirmation screen.

This is distinct from checkout-flow.md which adds two unsorted products.
This flow focuses on the sort-first behaviour and single-item checkout.

## Fixture
- Use: auth fixture (user is already logged in as standard_user)
- Test starts at /inventory.html — no login steps needed in the test body

## Test Data
- Sort option: "Price (low to high)"
- Product added: first item shown after sort (cheapest item — do NOT hardcode name)
- Customer info (from TP-1 ticket):
  - First Name: "Md Salekin"
  - Last Name:  "Newaz"
  - Zip Code:   "1234"

## Test Scenarios

### 1 — Happy Path: Sort by price, add cheapest product, complete checkout
- On the inventory page, locate the sort dropdown (data-test="product-sort-container")
- Select "Price (low to high)" from the dropdown
  - Products should re-order with the lowest-priced item appearing first
- Click "Add to cart" on the first product in the sorted list
  - Cart badge should show 1
  - The button on that product should change to "Remove"
- Click the cart icon (top right header)
  - URL should contain /cart.html
  - Exactly 1 item should be listed in the cart
- Click the "Checkout" button
  - URL should contain /checkout-step-one.html
- Fill in First Name: "Md Salekin"
- Fill in Last Name: "Newaz"
- Fill in Zip/Postal Code: "1234"
- Click the "Continue" button
  - URL should contain /checkout-step-two.html
  - Order overview should show 1 item
- Click the "Finish" button
  - URL should contain /checkout-complete.html
  - The confirmation header "Thank you for your order!" should be visible

## Preconditions
- User is authenticated as standard_user (handled by auth fixture)
- Cart is empty at the start of the test (guaranteed by fresh fixture context)
- Application is accessible at BASE_URL
