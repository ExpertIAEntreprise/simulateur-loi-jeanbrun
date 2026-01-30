# Authentication Components - Accessibility Guide

## Quick Reference

All authentication components in this directory include comprehensive ARIA attributes for accessibility compliance.

### Component Status

| Component | WCAG Level | Screen Readers | Keyboard | Status |
|-----------|-----------|---|---|---|
| SignInButton | AA | ✓ | ✓ | Production |
| SignUpForm | AA | ✓ | ✓ | Production |
| ForgotPasswordForm | AA | ✓ | ✓ | Production |
| ResetPasswordForm | AA | ✓ | ✓ | Production |

## ARIA Attributes Used

### Form Level
- `aria-label`: Identifies form purpose ("Sign in form", "Sign up form", etc.)

### Input Level
- `aria-invalid`: Indicates validation error state
- `aria-describedby`: Links input to error message or hint text
- `aria-required`: Marks required fields (implicit with `required` attribute)

### Message Level
- `role="alert"`: For error messages (role alert)
- `role="status"`: For success/status messages
- `aria-live="polite"`: Announces message changes to screen readers

### Button Level
- `aria-busy`: Indicates button is processing (during form submission)

## Example: Error Handling

```tsx
// Correct pattern used in all forms:
<Input
  id="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? "signin-error" : undefined}
/>

{error && (
  <p
    id="signin-error"
    role="alert"
    aria-live="polite"
    className="text-sm text-destructive"
  >
    {error}
  </p>
)}
```

## Example: Button State

```tsx
// Correct pattern for submit button:
<Button
  type="submit"
  disabled={isPending}
  aria-busy={isPending}
>
  {isPending ? "Signing in..." : "Sign in"}
</Button>
```

## Testing These Components

### Automated Testing
```bash
npm run test:a11y
# Runs jest-axe tests for accessibility violations
```

### Manual Testing with Screen Reader

1. **Windows:** Use NVDA (free)
   - Download from https://www.nvaccess.org/download/
   - Press Ctrl+Alt+N to start

2. **macOS:** Use VoiceOver (built-in)
   - Press Cmd+F5 to enable
   - Use VO+U to open rotor

3. **Chrome:** Built-in screen reader
   - Enable in Settings > Accessibility

### Keyboard-Only Testing
1. Close trackpad/mouse
2. Use Tab to navigate form
3. Use Enter to submit
4. Verify focus is always visible

### Browser Tools
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/extension/
- Lighthouse in Chrome DevTools

## Adding New Auth Components

When creating new authentication forms:

### Step 1: Add Form Label
```tsx
<form aria-label="Your form name">
```

### Step 2: Label All Inputs
```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" />
```

### Step 3: Link Errors to Fields
```tsx
<Input
  aria-invalid={!!error}
  aria-describedby={error ? "error-id" : undefined}
/>
{error && (
  <p id="error-id" role="alert" aria-live="polite">
    {error}
  </p>
)}
```

### Step 4: Indicate Button State
```tsx
<Button
  disabled={isPending}
  aria-busy={isPending}
>
  {isPending ? "Loading..." : "Submit"}
</Button>
```

### Step 5: Test
```bash
npm run test:a11y
# Check for violations
```

## Common Mistakes to Avoid

### ❌ Don't: Use divs for form controls
```tsx
// WRONG - Not accessible
<div onClick={handleClick}>Submit</div>
```

### ✓ Do: Use semantic HTML
```tsx
// RIGHT - Fully accessible
<Button type="submit">Submit</Button>
```

---

### ❌ Don't: Skip error connection
```tsx
// WRONG - Error not linked to field
<Input id="email" />
{error && <p>{error}</p>}
```

### ✓ Do: Link errors with aria-describedby
```tsx
// RIGHT - Error connected
<Input id="email" aria-describedby={error ? "error-id" : undefined} />
{error && <p id="error-id" role="alert">{error}</p>}
```

---

### ❌ Don't: Hide placeholder labels
```tsx
// WRONG - No visible label
<Input placeholder="Email" />
```

### ✓ Do: Use visible labels with Label component
```tsx
// RIGHT - Visible and associated
<Label htmlFor="email">Email</Label>
<Input id="email" placeholder="you@example.com" />
```

---

### ❌ Don't: Use aria-live without role
```tsx
// WRONG - Status unclear
<p aria-live="polite">{message}</p>
```

### ✓ Do: Include proper role
```tsx
// RIGHT - Role and live region combined
<p role="status" aria-live="polite">{message}</p>
```

---

### ❌ Don't: Use aria-label instead of visible labels
```tsx
// WRONG - Label only in SR
<Input aria-label="Email" />
```

### ✓ Do: Use visible labels with Label component
```tsx
// RIGHT - Label visible to all users
<Label htmlFor="email">Email</Label>
<Input id="email" />
```

## Resources

### Documentation
- Read `/docs/A11Y-AUDIT-AUTH-FORMS.md` for detailed ARIA guide
- Read `/docs/A11Y-MANUAL-TESTING-GUIDE.md` for testing procedures
- Read `/docs/A11Y-IMPLEMENTATION-SUMMARY.md` for full implementation details

### Official Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Extension](https://wave.webaim.org/extension/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## Questions?

For accessibility questions:
1. Check this README first
2. Review the detailed guides in `/docs/`
3. Run automated tests: `npm run test:a11y`
4. Check WCAG 2.1 guidelines: https://www.w3.org/WAI/WCAG21/quickref/
5. Ask in accessibility channels or open an issue

## Compliance Level

All components in this directory meet:
- ✓ WCAG 2.1 Level AA
- ✓ Section 508 (US Federal Accessibility)
- ✓ EN 301 549 (EU Accessibility)
- ✓ AODA (Canada)
- ✓ AGSM (Australia)

Last Updated: 2026-01-30
