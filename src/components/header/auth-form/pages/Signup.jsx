import AuthEmailForm from "../components/auth-email-form";

export default function Signup({ onLoginClick, onSuccessCallback }) {
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
      onSuccessCallback={onSuccessCallback}
      shouldCreateUser
      submitLabel="Continue with email"
      successTitle="Sign-up link sent"
    />
  );
}
