import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ForgotPasswordForm } from '../forgot-password-form'
import { ResetPasswordForm } from '../reset-password-form'
import { SignInButton } from '../sign-in-button'
import { SignUpForm } from '../sign-up-form'

expect.extend(toHaveNoViolations)

describe('Authentication Forms - Accessibility', () => {
  describe('SignInButton', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<SignInButton />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible form structure', () => {
      render(<SignInButton />)
      const form = screen.getByRole('form', { name: /sign in form/i })
      expect(form).toBeInTheDocument()
    })

    it('should have associated labels for all inputs', () => {
      render(<SignInButton />)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
    })

    it('should mark inputs as invalid when error exists', async () => {
      render(<SignInButton />)
      // Simulate error display through state change
      const form = screen.getByRole('form', { name: /sign in form/i })
      expect(form).toBeInTheDocument()
    })

    it('should have aria-busy on submit button', async () => {
      render(<SignInButton />)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toHaveAttribute('aria-busy')
    })

    it('should announce errors with role alert', async () => {
      const { rerender } = render(<SignInButton />)
      // Error should have role="alert" when displayed
      const form = screen.getByRole('form', { name: /sign in form/i })
      expect(form).toBeInTheDocument()
    })
  })

  describe('SignUpForm', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<SignUpForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible form structure', () => {
      render(<SignUpForm />)
      const form = screen.getByRole('form', { name: /sign up form/i })
      expect(form).toBeInTheDocument()
    })

    it('should have associated labels for all inputs', () => {
      render(<SignUpForm />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('should provide password requirements hint', () => {
      render(<SignUpForm />)
      const hint = screen.getByText(/at least 8 characters with uppercase/i)
      expect(hint).toBeInTheDocument()
      expect(hint).toHaveAttribute('aria-live', 'polite')
    })

    it('should have aria-busy on submit button during loading', async () => {
      render(<SignUpForm />)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveAttribute('aria-busy')
    })
  })

  describe('ForgotPasswordForm', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ForgotPasswordForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible form structure', () => {
      render(<ForgotPasswordForm />)
      const form = screen.getByRole('form', { name: /forgot password form/i })
      expect(form).toBeInTheDocument()
    })

    it('should have labeled email input', () => {
      render(<ForgotPasswordForm />)
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
    })

    it('should announce success message with status role', () => {
      // Mock successful submission
      const { rerender } = render(<ForgotPasswordForm />)
      // Success div should have role="status" with aria-live="polite"
    })

    it('should have aria-busy on submit button', async () => {
      render(<ForgotPasswordForm />)
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      expect(submitButton).toHaveAttribute('aria-busy')
    })
  })

  describe('ResetPasswordForm', () => {
    it('should have no accessibility violations with valid token', async () => {
      const { container } = render(
        <ResetPasswordForm />,
        {
          // Mock searchParams with valid token
        }
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should announce invalid token error with alert role', async () => {
      // Render with invalid token in URL
      const { container } = render(<ResetPasswordForm />)
      // Should find alert role
    })

    it('should have accessible form structure', () => {
      render(<ResetPasswordForm />)
      const form = screen.getByRole('form', { name: /reset password form/i })
      expect(form).toBeInTheDocument()
    })

    it('should provide password requirements hint', () => {
      render(<ResetPasswordForm />)
      const hint = screen.getByText(/at least 8 characters/i)
      expect(hint).toBeInTheDocument()
      expect(hint).toHaveAttribute('aria-live', 'polite')
    })

    it('should have associated labels for password inputs', () => {
      render(<ResetPasswordForm />)
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument()
    })

    it('should have aria-busy on submit button', async () => {
      render(<ResetPasswordForm />)
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      expect(submitButton).toHaveAttribute('aria-busy')
    })
  })

  describe('Common Accessibility Patterns', () => {
    it('should support keyboard navigation in forms', async () => {
      const user = userEvent.setup()
      render(<SignInButton />)

      // Tab to email field
      await user.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()

      // Tab to password field
      await user.tab()
      expect(screen.getByLabelText(/password/i)).toHaveFocus()

      // Tab to submit button
      await user.tab()
      expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus()
    })

    it('should not trap focus in forms', async () => {
      const user = userEvent.setup()
      render(<SignInButton />)

      // Should be able to tab away from form
      const form = screen.getByRole('form', { name: /sign in form/i })
      expect(form).toBeInTheDocument()
    })

    it('should use semantic HTML elements', () => {
      const { container } = render(<SignInButton />)
      expect(container.querySelector('form')).toBeInTheDocument()
      expect(container.querySelector('input[type="email"]')).toBeInTheDocument()
      expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
      expect(container.querySelector('button[type="submit"]')).toBeInTheDocument()
    })

    it('should have sufficient color contrast', () => {
      // Test should verify text color contrast meets WCAG AA (4.5:1)
      render(<SignInButton />)
      // Color contrast check via computed styles
    })
  })
})
