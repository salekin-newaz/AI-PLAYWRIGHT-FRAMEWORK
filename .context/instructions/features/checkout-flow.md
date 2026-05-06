# Checkout Flow Tests

## Pages Used
- InventoryPage
- CartPage
- CheckoutPage

## Context
This spec covers the end-to-end happy path checkout flow for a logged-in user.
The user adds the first two products to the cart, proceeds through checkout,
fills in customer details, confirms the order, and verifies the success confirmation.

## Fixture
- Use: auth fixture (user is already logged in as standard_user)
- Test starts at /inventory.html — no login steps needed in the test body

## Test Data
- Customer details are hardcoded inline (not from users.json — checkout info is not credential data)
  - First Name: "John"
  - Last Name:  "Doe"
  - Zip Code:   "12345"

## Test Scenarios

### 1 — Happy Path: Add two products and complete checkout
- Add the first product to cart by clicking the first "Add to cart" button
  - Cart badge should show 1
- Add the second product to cart by clicking the second "Add to cart" button
  - Cart badge should show 2
- Click the cart icon (top right header)
  - URL should contain /cart.html
  - Two items should be listed in the cart
- Click the "Checkout" button
  - URL should contain /checkout-step-one.html
- Fill in First Name: "John"
- Fill in Last Name: "Doe"
- Fill in Zip/Postal Code: "12345"
- Click the "Continue" button
  - URL should contain /checkout-step-two.html
- Click the "Finish" button
  - URL should contain /checkout-complete.html
  - The confirmation header "Thank you for your order!" should be visible

## Preconditions
- User is authenticated as standard_user (handled by auth fixture)
- Application is accessible at BASE_URL
