import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AuthFormContent({ onSuccess }) {
  const [authContent, setAuthContent] = useState("login");

  if (authContent === "signup") {
    return (
      <Signup
        onLoginClick={() => {
          setAuthContent("login");
        }}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <Login
      onSignupClick={() => {
        setAuthContent("signup");
      }}
      onSuccess={onSuccess}
    />
  );
}

export default function AuthForm({ showHeaderInfo = false, onSuccess }) {
  return (
    <AuthFormContent
      key={showHeaderInfo ? "auth-open" : "auth-closed"}
      onSuccess={onSuccess}
    />
  );
}
