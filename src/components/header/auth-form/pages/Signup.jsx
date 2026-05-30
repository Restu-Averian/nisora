import AuthEmailForm from "../components/AuthEmailForm";

export default function Signup({ onLoginClick, onSuccess }) {
  return (
    <AuthEmailForm
      description="Enter your email to start your personal reading space. We'll send you a link to continue."
      emailInputId="signup-email"
      errorTitle="Failed to send sign-up link"
      footer={
        <div className="auth-form__footer">
          <span>Already have an account?</span>
          <button
            className="auth-form__link"
            onClick={onLoginClick}
            type="button"
          >
            Sign in
          </button>
        </div>
      }
      heading="Create your Nisora account"
      onSuccess={onSuccess}
      shouldCreateUser
      submitLabel="Continue with email"
      successTitle="Sign-up link sent"
    />
  );
}
