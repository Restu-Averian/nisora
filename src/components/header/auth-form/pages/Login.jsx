import AuthEmailForm from "../components/auth-email-form";

export default function Login({ onSignupClick, onSuccessCallback }) {
  return (
    <AuthEmailForm
      description="Enter your email to receive a secure sign-in link. No password needed."
      emailInputId="login-email"
      errorTitle="Failed to send sign-in link"
      footer={
        <div className="auth-form__footer">
          <span>Don't have an account?</span>
          <button
            className="auth-form__link"
            onClick={onSignupClick}
            type="button"
          >
            Sign up
          </button>
        </div>
      }
      heading="Sign in to Nisora"
      onSuccessCallback={onSuccessCallback}
      shouldCreateUser={false}
      submitLabel="Send sign-in link"
      successTitle="Sign-in link sent"
    />
  );
}
