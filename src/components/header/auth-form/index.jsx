import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AuthFormContent({ onSuccessCallback }) {
  const [authContent, setAuthContent] = useState("login");

  if (authContent === "signup") {
    return (
      <Signup
        onLoginClick={() => {
          setAuthContent("login");
        }}
        onSuccessCallback={onSuccessCallback}
      />
    );
  }

  return (
    <Login
      onSignupClick={() => {
        setAuthContent("signup");
      }}
      onSuccessCallback={onSuccessCallback}
    />
  );
}

export default function AuthForm({
  showHeaderInfo = false,
  onSuccessCallback,
}) {
  return (
    <AuthFormContent
      key={showHeaderInfo ? "auth-open" : "auth-closed"}
      onSuccessCallback={onSuccessCallback}
    />
  );
}
