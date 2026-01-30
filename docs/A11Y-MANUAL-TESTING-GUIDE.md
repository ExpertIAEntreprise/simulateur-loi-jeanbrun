# Accessibility Manual Testing Guide - Authentication Forms

## Overview

This guide provides step-by-step instructions to manually test authentication forms for accessibility with screen readers and keyboard navigation.

## Tools You'll Need

### Screen Readers
- **Windows:** NVDA (free) or JAWS (commercial)
- **macOS:** VoiceOver (built-in)
- **Linux:** Orca (free)

### Browser Extensions
- axe DevTools (Chrome, Firefox, Edge)
- WAVE (Chrome, Firefox, Edge)
- Lighthouse (Chrome DevTools built-in)

## Test Environment Setup

### 1. Enable Screen Reader (Example: NVDA on Windows)

```bash
# Download NVDA from https://www.nvaccess.org/download/
# Install and launch
# Press Ctrl+Alt+N to start
```

### 2. Start Dev Server

```bash
cd /root/simulateur_loi_Jeanbrun
npm run dev
# Navigate to http://localhost:3000/login
```

### 3. Open DevTools (Accessibility Panel)

- Press F12 to open DevTools
- Go to Accessibility tab

## Manual Testing Procedures

### Test 1: Form Identification

**What to Test:** Form should be clearly identified

#### With Screen Reader
1. Navigate to login page
2. Press H to move to next heading (screen reader)
3. Should hear: "Sign in form" or similar
4. Arrow down with NVDA should list form sections

#### Visual Check
- Open Chrome DevTools → Accessibility panel
- Expand tree and look for `<form aria-label="Sign in form">`

#### Expected Result
✓ Form has `aria-label` attribute
✓ Screen reader announces form purpose

---

### Test 2: Input Field Labeling

**What to Test:** All inputs have associated labels

#### With Screen Reader
1. Tab to email field
2. Screen reader should say: "Email, edit text"
3. Tab to password field
4. Screen reader should say: "Password, edit text"

#### Visual Check
```
Inspect each input:
<Input
  id="email"
  ...
/>
<!-- Check for paired Label -->
<Label htmlFor="email">Email</Label>
```

#### Expected Result
✓ Each input has `id` attribute
✓ Each label has matching `htmlFor` attribute
✓ Screen reader announces label with field

---

### Test 3: Error Message Association

**What to Test:** Errors are linked to the fields that caused them

#### Setup
1. Fill login form with invalid credentials
2. Submit form to trigger error

#### With Screen Reader
1. Tab back to email field (field with error)
2. Screen reader should say: "Email, edit text, invalid entry, [error message]"
3. The error message should be read in context

#### Visual Check
```
When error exists:
<Input
  id="email"
  aria-invalid="true"
  aria-describedby="signin-error"
/>

<p id="signin-error" role="alert" aria-live="polite">
  Failed to sign in
</p>
```

#### Expected Result
✓ Input has `aria-invalid="true"` when error exists
✓ Input has `aria-describedby="signin-error"`
✓ Error message has `id="signin-error"`
✓ Screen reader reads error when focused on field

---

### Test 4: Error Announcement

**What to Test:** Errors are immediately announced (not just visible)

#### Setup
1. Open page with screen reader running
2. Submit login form with invalid credentials

#### With Screen Reader
- Should hear immediate announcement of error
- Message should be announced even if focus hasn't moved
- Error should appear in "region" or "alert" manner

#### Browser Check
```
Open DevTools > Accessibility
- Look for: role="alert"
- Look for: aria-live="polite"
```

#### Expected Result
✓ Error appears as `role="alert"`
✓ Error has `aria-live="polite"`
✓ Screen reader announces error immediately

---

### Test 5: Loading State Indication

**What to Test:** Button state changes during form submission

#### Setup
1. Enter valid credentials
2. Submit form
3. Listen to screen reader

#### With Screen Reader
1. Before submit: Screen reader says "Sign in, button"
2. During loading: Should hear "Signing in..., button, busy"
3. Button should become `disabled`

#### Visual Check
```
During loading:
<Button
  type="submit"
  disabled={true}
  aria-busy={true}
>
  Signing in...
</Button>
```

#### Expected Result
✓ Button changes text during loading
✓ Button has `aria-busy="true"` while loading
✓ Button is `disabled` during loading
✓ Screen reader announces busy state

---

### Test 6: Success/Status Messages

**What to Test:** Success messages in forgot password form

#### Setup
1. Navigate to /forgot-password
2. Enter email and submit
3. Check for success message

#### With Screen Reader
1. After submit, should hear success announcement
2. Message should be announced in "status" manner
3. Should not require focus change

#### Browser Check
```
Success div should have:
<div role="status" aria-live="polite">
  If an account exists with that email, a password reset link has been sent...
</div>
```

#### Expected Result
✓ Success message has `role="status"`
✓ Success message has `aria-live="polite"`
✓ Screen reader announces it immediately

---

### Test 7: Keyboard Navigation

**What to Test:** All form controls are keyboard accessible

#### Procedure
1. Close screen reader (for this test)
2. Tab through the form
3. Press Shift+Tab to go backwards
4. Check focus is visible

#### Steps
```
1. Focus on email field (Tab)
2. Focus on password field (Tab)
3. Focus on submit button (Tab)
4. Focus should be visible (browser default or custom style)
5. Shift+Tab should go backwards
```

#### Expected Result
✓ Can reach all inputs with Tab
✓ Can reach submit button with Tab
✓ Focus indicator is visible
✓ Shift+Tab navigates backwards
✓ Can submit with Enter on focused button

---

### Test 8: Form Submission with Keyboard

**What to Test:** Can submit form using only keyboard

#### Procedure
1. Tab to email field
2. Type email
3. Tab to password field
4. Type password
5. Tab to submit button
6. Press Enter
7. Form should submit

#### Expected Result
✓ Form submits with Enter key
✓ No mouse required
✓ All interactions work via Tab/Enter/Space

---

### Test 9: Invalid Password Feedback

**What to Test:** Password requirements are communicated clearly

#### With SignUpForm
1. Navigate to /register
2. Tab to password field
3. Should hear password requirements

#### With Screen Reader
- Should hear: "Password must be at least 8 characters with uppercase, lowercase, and numbers"
- This should be read when focused on field

#### Expected Result
✓ Password hint has `aria-live="polite"`
✓ Hint is associated with `aria-describedby`
✓ Requirements are clear and accessible

---

### Test 10: Color Contrast

**What to Test:** Text is readable for users with low vision

#### Using Browser Tool
1. Open axe DevTools
2. Run scan
3. Check "Color Contrast" section

#### Using Lighthouse
1. DevTools → Lighthouse
2. Audit with "Accessibility" selected
3. Check contrast results

#### Manual Check
- Error messages (red text): Should have 4.5:1 contrast minimum
- Labels: Should have 4.5:1 contrast minimum
- Buttons: Should have 4.5:1 contrast minimum

#### Expected Result
✓ All text meets WCAG AA (4.5:1 minimum)
✓ Red error text passes contrast test
✓ All form text is readable

---

## Automated Testing with Tools

### axe DevTools (Chrome/Firefox)

```
1. Open DevTools
2. Click axe DevTools icon
3. Click "Scan ALL of my page"
4. Check results for:
   - Violations: Should be 0
   - Best Practices: Address all
```

### WAVE (Chrome/Firefox)

```
1. Install WAVE extension
2. Click WAVE icon on page
3. Check for:
   - Red icons (errors)
   - Yellow icons (warnings)
   - Ensure all form fields have labels
```

### Lighthouse (Chrome DevTools)

```
1. DevTools → Lighthouse
2. Check "Accessibility"
3. Run audit
4. Expected score: 90+
5. Address all "Failing Audits"
```

---

## Quick Accessibility Checklist

### Form Structure
- [ ] Form has `aria-label`
- [ ] All inputs have `id` attributes
- [ ] All labels have `htmlFor` matching input `id`
- [ ] Labels use `<Label>` component

### Error Handling
- [ ] Errors have unique `id` attribute
- [ ] Errors have `role="alert"`
- [ ] Errors have `aria-live="polite"`
- [ ] Inputs have `aria-describedby` pointing to error
- [ ] Inputs have `aria-invalid="true"` when error exists

### Buttons
- [ ] Submit button has `type="submit"`
- [ ] Button has `aria-busy` during loading
- [ ] Button is `disabled` during loading
- [ ] Button text changes during loading

### Status Messages
- [ ] Success messages have `role="status"`
- [ ] Status messages have `aria-live="polite"`
- [ ] Error alerts have `role="alert"`
- [ ] Important messages are announced

### Keyboard Navigation
- [ ] All inputs reachable with Tab
- [ ] Submit button reachable with Tab
- [ ] Can submit with Enter key
- [ ] Focus indicator visible
- [ ] No focus traps

### Semantic HTML
- [ ] Using `<form>` element
- [ ] Using `<input>` elements (not divs)
- [ ] Using `<button>` elements
- [ ] Using `<label>` elements

### Assistive Technology
- [ ] Screen reader announces form purpose
- [ ] Screen reader announces field labels
- [ ] Screen reader announces validation errors
- [ ] Screen reader announces loading state
- [ ] Screen reader announces success messages

---

## Common Issues and Solutions

### Issue: Screen reader doesn't announce error

**Solution:**
- Add `role="alert"` to error message
- Add `aria-live="polite"` to error container
- Ensure input has `aria-describedby="error-id"`

### Issue: Error message not linked to field

**Solution:**
- Add unique `id` to error message
- Add `aria-describedby="that-id"` to input
- Ensure `aria-invalid="true"` on input

### Issue: Loading state not announced

**Solution:**
- Add `aria-busy="true"` to button during loading
- Disable button with `disabled={isPending}`
- Update button text to show state ("Signing in...")

### Issue: Focus not visible

**Solution:**
- Check browser default focus styles
- If needed, add custom focus indicator:
```css
input:focus {
  outline: 2px solid #4F46E5; /* tailwind blue-600 */
  outline-offset: 2px;
}
```

### Issue: Screen reader can't find form label

**Solution:**
- Add `aria-label="Form Name"` to `<form>` element
- Ensure form has semantic structure
- Don't use empty labels

---

## Resources

- [Web Accessibility by Google - Udacity Course](https://www.udacity.com/course/web-accessibility--ud891)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN - ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [NVDA Documentation](https://www.nvaccess.org/about-nvda/)
- [WebAIM - Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

## Reporting Results

Document your findings in this format:

```markdown
### Test Date: [Date]
### Tester: [Name]
### Browser: [Browser/Version]
### Screen Reader: [SR/Version]

#### Pass
- [ ] Test 1: Form Identification
- [ ] Test 2: Input Labeling
- [ ] Test 3: Error Association
- [ ] Test 4: Error Announcement
- [ ] Test 5: Loading State
- [ ] Test 6: Success Messages
- [ ] Test 7: Keyboard Navigation
- [ ] Test 8: Form Submission
- [ ] Test 9: Password Feedback
- [ ] Test 10: Color Contrast

#### Issues Found
- Issue 1: [Description]
- Issue 2: [Description]

#### Recommendations
- Recommendation 1: [Description]
- Recommendation 2: [Description]
```
