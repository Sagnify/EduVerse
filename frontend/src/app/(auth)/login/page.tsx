"use client";
import { FormEvent, useState } from "react";
import { loginUser } from "./actions/login";

export default function Login() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    const fd = new FormData(e.currentTarget);
    const formData = {
      username: fd.get("u_name") as string,
      password: fd.get("p_word") as string,
    };

    const result = await loginUser(formData);

    if (result.success) {
      setSuccessMessage(result.message);
      // Redirect to /mytodos
      window.location.href = "/";
      console.log("Login successful!");
    } else {
      setErrorMessage(result.message);
    }

    setIsLoading(false);
  }

  return (
    <div className="col-md-6">
      <h3>Login</h3>
      <hr />
      <form onSubmit={submitHandler}>
        <div className="form-outline mb-4">
          <input
            type="text"
            id="username"
            className="form-control"
            name="u_name"
            required
          />
          <label className="form-label" htmlFor="username">
            Username
          </label>
        </div>

        <div className="form-outline mb-4">
          <input
            type="password"
            id="loginPassword"
            className="form-control"
            name="p_word"
            required
          />
          <label className="form-label" htmlFor="loginPassword">
            Password
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
    </div>
  );
}
