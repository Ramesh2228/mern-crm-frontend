import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { validateEmail } from "../utils/validators";
import "../styles/auth.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
const { login } = useContext(AuthContext);
  /* ===== Real-time validation ===== */
  useEffect(() => {
    const newErrors = {};

    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
  }, [form]);

  const isValid =
    form.email &&
    form.password &&
    Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const res = await axios.post("/auth/login", form);
      login(res.data.accessToken, res.data.refreshToken);
            navigate("/dashboard");

    }  catch (error) {
    if (error.response?.data?.message) {
      setErrors({ general: error.response.data.message });
    } else {
      setErrors({ general: "Login failed" });
    }
  }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        {errors.general && <p className="error">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button disabled={!isValid}>
            Login
          </button>
        </form>

        <p>
          Don't have an account?
          <Link to="/signup" color="#00f"> Sign Up</Link>
        </p>
      </div>
    </div>
  );
}