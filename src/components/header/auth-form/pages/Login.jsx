import AuthEmailForm from "../components/AuthEmailForm";

export default function Login({ onSignupClick, onSuccess }) {
  return (
    <AuthEmailForm
      description="Enter your email to receive a secure sign-in link. No password needed."
      emailInputId="login-email"
      errorTitle="Failed to send sign-in link"
      footer={
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-center text-sm text-secondary-text">
          <span>Don't have an account?</span>
          <button
            className="font-semibold text-primary-accent underline-offset-4 hover:text-hover-accent hover:underline"
            onClick={onSignupClick}
            type="button"
          >
            Sign up
          </button>
        </div>
      }
      heading="Sign in to Nisora"
      onSuccess={onSuccess}
      shouldCreateUser={false}
      submitLabel="Send sign-in link"
      successTitle="Sign-in link sent"
    />
  );
}
