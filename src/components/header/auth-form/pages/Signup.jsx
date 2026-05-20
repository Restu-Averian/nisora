import AuthEmailForm from "../components/AuthEmailForm";

export default function Signup({ onLoginClick, onSuccess }) {
  return (
    <AuthEmailForm
      description="Enter your email to start your personal reading space. We'll send you a link to continue."
      emailInputId="signup-email"
      errorTitle="Failed to send sign-up link"
      footer={
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-center text-sm text-secondary-text">
          <span>Already have an account?</span>
          <button
            className="font-semibold text-primary-accent underline-offset-4 hover:text-hover-accent hover:underline"
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
