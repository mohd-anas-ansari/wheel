import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { setAuthHeaders } from "apis/axios";
import { useAuthDispatch } from "contexts/auth";
import { useUserDispatch } from "contexts/user";
import { Button, Input, Toastr } from "neetoui";
import authenticationApi from "apis/authentication";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const authDispatch = useAuthDispatch();
  const userDispatch = useUserDispatch();

  const linkBaseClass =
    "block mt-2 text-base text-indigo-500 no-underline transition-all duration-300 ease-in-out hover:text-indigo-600";

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      setLoading(true);
      const {
        data: { auth_token, user, is_admin },
      } = await authenticationApi.login({ user: { email, password } });
      authDispatch({ type: "LOGIN", payload: { auth_token, email, is_admin } });
      userDispatch({ type: "SET_USER", payload: { user } });
      setAuthHeaders();
      history.push("/");
      Toastr.success("Logged in successfully.");
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center h-full mx-auto lg:w-4/12">
        <h2 className="mb-5 text-3xl font-semibold text-center text-gray-800">
          Sign In
        </h2>
        <form
          className="w-full p-8 space-y-4 bg-white border rounded-md shadow"
          onSubmit={handleSubmit}
        >
          <Input
            required
            type="email"
            value={email}
            label="Email"
            placeholder="oliver@example.com"
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Password"
            placeholder="******"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" loading={loading} fullWidth label="Login" />
        </form>
        <div className="mt-2 text-center">
          <Link className={linkBaseClass} to="/signup">
            Signup
          </Link>
          <Link className={linkBaseClass} to="/my/password/new">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

export default Login;
