import { useState, useEffect } from "react";
import axios from "../api/axios";
import { validateEmail, validatePhone } from "../utils/validators";

export default function ContactModal({ editData, onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  /* ===== Validation ===== */
  useEffect(() => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!validateEmail(form.email)) {
      newErrors.email = "Valid email required";
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
  }, [form]);

  const isValid =
    form.name &&
    form.email &&
    Object.keys(errors).length === 0;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) return;

    try {
      if (editData) {
        await axios.put(`/contacts/${editData._id}`, form);
      } else {
        await axios.post("/contacts", form);
      }

      refresh();
      onClose();
    } catch {
      setErrors({ general: "Something went wrong" });
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-header">
          <h3>{editData ? "Edit" : "Add"} Contact</h3>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit} className="modal-form">

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {(touched.name || submitted) && errors.name &&
            <p className="error">{errors.name}</p>
          }

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {(touched.email || submitted) && errors.email &&
            <p className="error">{errors.email}</p>
          }

          <input
            placeholder="Phone"
            value={form.phone}
            maxLength={10}
            onChange={(e) =>
              handleChange(
                "phone",
                e.target.value.replace(/\D/g, "")
              )
            }
            onBlur={() => handleBlur("phone")}
          />
          {(touched.phone || submitted) && errors.phone &&
            <p className="error">{errors.phone}</p>
          }

          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) =>
              handleChange("company", e.target.value)
            }
          />

          <select
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value)
            }
          >
            <option>Lead</option>
            <option>Prospect</option>
            <option>Customer</option>
          </select>

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              handleChange("notes", e.target.value)
            }
          />

          <button
            className="primary-btn"
            disabled={!isValid}
          >
            {editData ? "Update" : "Save"}
          </button>

        </form>
      </div>
    </div>
  );
}