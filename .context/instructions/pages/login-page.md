# Login Page

## URL
/  (root path — the site opens directly to the login page)

## Purpose
The entry point of Sauce Demo. All users must authenticate here before
accessing any other page. No other page is reachable without a valid session.

## Elements

### Inputs
- Username input
  - Visible label: "Username"
  - Attribute: data-test="username"

- Password input
  - Visible label: "Password"
  - Attribute: data-test="password"
  - Input type: password (masked)

### Buttons
- Login submit button
  - Visible text: "Login"
  - Attribute: data-test="login-button"

### Feedback
- Error message container
  - Only visible when login fails
  - Attribute: data-test="error"
  - Contains a dismiss ✕ button (class: error-button)
  - Text content varies by error type (see Expected Behaviours below)

### Static Content (read-only)
- "Accepted usernames" block (bottom of the form — for reference only)
- "Password for all users" block (bottom of the form — for reference only)

## Actions
- Fill the username field with a given string
- Fill the password field with a given string
- Submit the login form (fill both fields + click Login button)
- Dismiss the error message by clicking the ✕ button
- Read the current error message text
- Check whether the error message container is currently visible

## Expected Behaviours
| Scenario                          | Result                                                       |
|-----------------------------------|--------------------------------------------------------------|
| Valid standard_user credentials   | Redirect to /inventory.html                                  |
| Wrong password                    | Error: "Username and password do not match"                  |
| locked_out_user credentials       | Error: "Sorry, this user has been locked out"                |
| Submit with both fields empty     | Error: "Epic sadface: Username is required"                  |
| Submit with username only         | Error: "Epic sadface: Password is required"                  |
| Click ✕ on error message          | Error container disappears, form remains on screen           |
