import React from "react";
import { useAppContext } from "../context/AppContext";

/**
 * Login component with:
 * - login / register
 * - forgot password -> send OTP -> verify OTP -> reset password
 *
 * Backend endpoints expected:
 * POST /api/send-otp         { email }
 * POST /api/verify-otp       { email, otp }
 * POST /api/reset-password   { email, newPassword }
 *
 * (A sample backend is provided after this file.)
 */

const Login = () => {
  const { setShowUserLogin, setUser } = useAppContext();

  // states
  const [state, setState] = React.useState("login"); // login | register | forgot | verifyOtp | resetPassword
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(""); // success / error messages

  // common helper for showing messages
  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // original login submit (demo)
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // demo: bypass real auth and set user (replace with real auth call)
    setUser({
      email: "test@groceryguru.dev",
      name: "GroceryGuru",
    });
    setShowUserLogin(false);
  };

  // 1) Send OTP
  const sendOtpHandler = async () => {
    if (!email) return showMsg("Please enter email");
    try {
      setLoading(true);
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg("OTP sent to your email. Please check inbox.");
        setState("verifyOtp");
      } else {
        showMsg(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      showMsg("Network error while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // 2) Verify OTP
  const verifyOtpHandler = async () => {
    if (!otp) return showMsg("Please enter OTP");
    try {
      setLoading(true);
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg("OTP verified. Ab aap new password set kar sakte hain.");
        setState("resetPassword");
      } else {
        showMsg(data.message || "Invalid or expired OTP");
      }
    } catch (err) {
      console.error(err);
      showMsg("Network error while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3) Reset password
  const resetPasswordHandler = async () => {
    if (!newPassword) return showMsg("Please enter new password");
    try {
      setLoading(true);
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg("Password updated. Please login with new password.");
        setState("login");
      } else {
        showMsg(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      showMsg("Network error while updating password");
    } finally {
      setLoading(false);
    }
  };

  // small register handler (demo)
  const onRegisterHandler = async (e) => {
    e.preventDefault();
    // add real register call here
    showMsg("Account created (demo). You can login now.");
    setState("login");
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={
          state === "register"
            ? onRegisterHandler
            : state === "login"
            ? onSubmitHandler
            : (e) => e.preventDefault()
        }
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login"
            ? "Login"
            : state === "register"
            ? "Sign Up"
            : state === "forgot"
            ? "Forgot Password"
            : state === "verifyOtp"
            ? "Verify OTP"
            : "Reset Password"}
        </p>

        {/* Name for register */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* Email - used in many states */}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        {/* Password (only login/register) */}
        {(state === "login" || state === "register") && (
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
            <br />
            <br />
            <span
              onClick={() => setState("forgot")}
              className="text-primary cursor-pointer"
            >
              Forget password
            </span>
          </div>
        )}

        {/* Forgot: show send OTP */}
        {state === "forgot" && (
          <div className="w-full">
            <p>Enter your registered email to receive OTP</p>
            <button
              type="button"
              onClick={sendOtpHandler}
              className="bg-primary text-white w-full py-2 rounded mt-2"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p
              className="mt-2 cursor-pointer text-primary"
              onClick={() => setState("login")}
            >
              Back to login
            </p>
          </div>
        )}

        {/* Verify OTP */}
        {state === "verifyOtp" && (
          <div className="w-full">
            <p>Enter the 6-digit OTP sent to your email</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 mt-1 w-full"
              type="text"
              required
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={verifyOtpHandler}
                className="bg-primary text-white w-full py-2 rounded"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={sendOtpHandler}
                className="border w-28 py-2 rounded"
                disabled={loading}
              >
                Resend
              </button>
            </div>
            <p
              className="mt-2 cursor-pointer text-primary"
              onClick={() => setState("forgot")}
            >
              Change email
            </p>
          </div>
        )}

        {/* Reset Password */}
        {state === "resetPassword" && (
          <div className="w-full">
            <p>New Password</p>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 mt-1 w-full"
              type="password"
              required
            />
            <button
              type="button"
              onClick={resetPasswordHandler}
              className="bg-primary text-white w-full py-2 rounded mt-4"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* Login/Register toggles */}
        {(state === "login" || state === "register") && (
          <>
            {state === "register" ? (
              <p>
                Already have account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-primary cursor-pointer"
                >
                  click here
                </span>
              </p>
            ) : (
              <p>
                Create an account?{" "}
                <span
                  onClick={() => setState("register")}
                  className="text-primary cursor-pointer"
                >
                  click here
                </span>
              </p>
            )}

            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
              {state === "register" ? "Create Account" : "Login"}
            </button>
          </>
        )}

        {/* messages */}
        {message && (
          <p className="text-sm text-center w-full text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
