# Checkout Page

## URLs
- Step One (Customer Info): /checkout-step-one.html
- Step Two (Order Overview): /checkout-step-two.html
- Complete (Confirmation):   /checkout-complete.html

## Purpose
A three-step checkout flow. Step One collects customer details. Step Two shows
an order summary. The Complete page confirms the order was placed successfully.

---

## Step One — Customer Information

### Elements

#### Inputs
- First Name input
  - Visible label: "First Name"
  - Attribute: data-test="firstName"

- Last Name input
  - Visible label: "Last Name"
  - Attribute: data-test="lastName"

- Zip / Postal Code input
  - Visible label: "Zip/Postal Code"
  - Attribute: data-test="postalCode"

#### Buttons
- Continue button
  - Visible text: "Continue"
  - Attribute: data-test="continue"
- Cancel button
  - Visible text: "Cancel"
  - Attribute: data-test="cancel"

#### Feedback
- Error message container
  - Attribute: data-test="error"
  - Visible only when form validation fails

### Actions
- Fill First Name field
- Fill Last Name field
- Fill Zip/Postal Code field
- Click Continue to proceed to Step Two
- Click Cancel to return to cart

### Expected Behaviours (Step One)
| Scenario                            | Result                                       |
|-------------------------------------|----------------------------------------------|
| Fill all fields and click Continue  | Navigates to /checkout-step-two.html         |
| Click Continue with empty fields    | Error: "First Name is required"              |

---

## Step Two — Order Overview

### Elements
- Summary item list: .cart_list
- Item total label: .summary_subtotal_label
- Tax label: .summary_tax_label
- Total label: .summary_total_label
- Finish button
  - Visible text: "Finish"
  - Attribute: data-test="finish"
- Cancel button
  - Visible text: "Cancel"
  - Attribute: data-test="cancel"

### Actions
- Review order summary
- Click Finish to place the order
- Click Cancel to return to cart

### Expected Behaviours (Step Two)
| Scenario          | Result                                    |
|-------------------|-------------------------------------------|
| Click Finish      | Navigates to /checkout-complete.html      |

---

## Checkout Complete — Order Confirmation

### Elements
- Confirmation header
  - Text: "Thank you for your order!"
  - Attribute: data-test="complete-header"
  - Tag: h2
- Confirmation sub-text
  - Class: complete-text
  - Text: "Your order has been dispatched..."
- Pony Express image
  - Class: pony_express
- Back Home button
  - Visible text: "Back Home"
  - Attribute: data-test="back-to-products"

### Expected Behaviours (Complete)
| Scenario                        | Result                                               |
|---------------------------------|------------------------------------------------------|
| Order placed successfully       | "Thank you for your order!" header is visible        |
| Click Back Home                 | Navigates back to /inventory.html                    |
