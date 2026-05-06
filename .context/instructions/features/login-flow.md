# Login Feature Tests

## Pages Used
- LoginPage

## Context
Sauce Demo requires all users to authenticate before accessing any feature.
This spec covers all login states: success, validation errors, locked accounts,
and error dismissal. These are the first and most critical tests in the suite.

## Fixture
- Use: base fixture (no pre-auth needed — we ARE testing login itself)
- Each test must start with a fresh browser context at the login page

## Test Scenarios

### 1 — Happy Path
- Log in with standard_user credentials
  - After login, page URL should contain /inventory.html
  - Page heading should display the text "Products"
  - Shopping cart icon should be present and visible in the header

### 2 — Locked Out User
- Attempt login with locked_out_user credentials
  - URL should remain on the login page (no redirect occurred)
  - Error message container should be visible
  - Error text should contain the phrase "locked out"

### 3 — Wrong Password
- Attempt login with standard_user username and an incorrect password
  - Error message container should be visible
  - Error text should contain "Username and password do not match"
  - URL should remain on the login page (no redirect occurred)

### 4 — Empty Form Submission
- Click the Login button without filling in any field
  - Error message container should be visible
  - Error text should contain "Username is required"

### 5 — Missing Password Only
- Fill username field with standard_user value, leave password empty, then submit
  - Error message container should be visible
  - Error text should contain "Password is required"

### 6 — Error Message Dismissal
- Trigger a login error (use wrong password scenario)
  - Confirm the error message is visible
  - Click the ✕ dismiss button on the error container
  - Error message container should no longer be visible
  - Login form inputs should still be present on the page

## Test Data Source
- Load all credentials from: test-data/users.json
- Do NOT hardcode any username or password string in the spec file
- Reference keys: standard_user, locked_out_user, invalid_user

## Preconditions
- Application is accessible at BASE_URL
- No active browser session (fresh context per test — handled by fixture)
