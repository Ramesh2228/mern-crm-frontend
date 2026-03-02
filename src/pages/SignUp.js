import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { validateEmail } from "../utils/validators";
import "../styles/auth.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
const [submitted, setSubmitted] = useState(false);
  /* ===== Real-time validation ===== */
  useEffect(() => {
    const newErrors = {};

    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (form.confirm && form.password !== form.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    if (submitted &&!form.name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
  }, [form]);

  const isValid =
    form.name &&
    form.email &&
    form.password &&
    form.confirm &&
    Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    try {
      await axios.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate("/");
    } catch {
      setErrors({ general: "Signup failed" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>

        {errors.general && <p className="error">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          {errors.name && <p className="error">{errors.name}</p>}

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) =>
              setForm({ ...form, confirm: e.target.value })
            }
          />
          {errors.confirm && <p className="error">{errors.confirm}</p>}

          <button disabled={!isValid}>
            Create Account
          </button>
        </form>

        <Link to="/" >Back to Login</Link>
      </div>
    </div>
  );
}