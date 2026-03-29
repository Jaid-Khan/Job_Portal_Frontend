import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styling/CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Job",
    organization: "",
    description: "",
    status: "draft",
    tags: [],
    dates: {
      formStart: "",
      lastDate: "",
      feeLastDate: "",
      examDate: "",
      admitCardDate: "",
    },
    ageLimit: {
      min: "",
      max: "",
      relaxation: "",
    },
    fees: [],
    vacancy: [],
    links: [],
    documents: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  // ---------- Simple Fields ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ---------- Nested Fields ----------
  const handleNestedChange = (section, field, value) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [field]: value,
      },
    });
  };

  // ---------- Tags Management ----------
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // ---------- Fees Management ----------
  const addFee = () => {
    setForm({
      ...form,
      fees: [...form.fees, { category: "", amount: "" }],
    });
  };

  const updateFee = (index, key, value) => {
    const updated = [...form.fees];
    updated[index][key] = key === "amount" ? Number(value) : value;
    setForm({ ...form, fees: updated });
  };

  const removeFee = (index) => {
    const updated = form.fees.filter((_, i) => i !== index);
    setForm({ ...form, fees: updated });
  };

  // ---------- Vacancy Management ----------
  const addVacancy = () => {
    setForm({
      ...form,
      vacancy: [
        ...form.vacancy,
        {
          postName: "",
          total: "",
          eligibility: "",
          categoryWise: [],
        },
      ],
    });
  };

  const updateVacancy = (index, field, value) => {
    const updated = [...form.vacancy];
    updated[index][field] = field === "total" ? Number(value) : value;
    setForm({ ...form, vacancy: updated });
  };

  const removeVacancy = (index) => {
    const updated = form.vacancy.filter((_, i) => i !== index);
    setForm({ ...form, vacancy: updated });
  };

  const addCategoryWise = (vacancyIndex) => {
    const updated = [...form.vacancy];
    updated[vacancyIndex].categoryWise.push({ category: "", seats: "" });
    setForm({ ...form, vacancy: updated });
  };

  const updateCategoryWise = (vacancyIndex, catIndex, field, value) => {
    const updated = [...form.vacancy];
    updated[vacancyIndex].categoryWise[catIndex][field] = 
      field === "seats" ? Number(value) : value;
    setForm({ ...form, vacancy: updated });
  };

  const removeCategoryWise = (vacancyIndex, catIndex) => {
    const updated = [...form.vacancy];
    updated[vacancyIndex].categoryWise = updated[vacancyIndex].categoryWise.filter(
      (_, i) => i !== catIndex
    );
    setForm({ ...form, vacancy: updated });
  };

  // ---------- Links Management ----------
  const addLink = () => {
    setForm({
      ...form,
      links: [...form.links, { title: "", url: "" }],
    });
  };

  const updateLink = (index, key, value) => {
    const updated = [...form.links];
    updated[index][key] = value;
    setForm({ ...form, links: updated });
  };

  const removeLink = (index) => {
    const updated = form.links.filter((_, i) => i !== index);
    setForm({ ...form, links: updated });
  };

  // ---------- Documents Management ----------
  const addDocument = () => {
    setForm({
      ...form,
      documents: [...form.documents, { name: "", description: "" }],
    });
  };

  const updateDocument = (index, key, value) => {
    const updated = [...form.documents];
    updated[index][key] = value;
    setForm({ ...form, documents: updated });
  };

  const removeDocument = (index) => {
    const updated = form.documents.filter((_, i) => i !== index);
    setForm({ ...form, documents: updated });
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!form.title || !form.organization) {
      setError("Title and Organization are required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Process form data
      const processedForm = {
        ...form,
        dates: Object.fromEntries(
          Object.entries(form.dates).map(([key, value]) => [key, value || null])
        ),
        ageLimit: {
          min: form.ageLimit.min ? Number(form.ageLimit.min) : undefined,
          max: form.ageLimit.max ? Number(form.ageLimit.max) : undefined,
          relaxation: form.ageLimit.relaxation || undefined,
        },
        fees: form.fees.filter(f => f.category && f.amount),
        vacancy: form.vacancy.map(v => ({
          ...v,
          total: v.total ? Number(v.total) : 0,
          categoryWise: v.categoryWise.filter(c => c.category && c.seats)
        })),
        links: form.links.filter(l => l.title && l.url),
        documents: form.documents.filter(d => d.name),
      };

      const res = await axios.post("/posts", processedForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("✅ Post Created Successfully!");
        navigate("/admin/dashboard");
      } else {
        setError(res.data.message || "Error creating post");
      }
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creating post");
      if (err.response?.status === 401) {
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="form-header">
        <button onClick={() => navigate("/admin/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>📝 Create New Post</h1>
        <p>Fill in all details according to the schema</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        {/* ========== BASIC INFO ========== */}
        <section className="form-section">
          <h2>📌 Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Recruitment for IT Officer 2025"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="Job">Job</option>
                <option value="Admit Card">Admit Card</option>
                <option value="Result">Result</option>
                <option value="Answer Key">Answer Key</option>
              </select>
            </div>

            <div className="form-group">
              <label>Organization *</label>
              <input
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                placeholder="e.g., UPSC, SSC, Indian Railways"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">📄 Draft</option>
                <option value="published">🚀 Published</option>
              </select>
            </div>
          </div>
        </section>

        {/* ========== IMPORTANT DATES ========== */}
        <section className="form-section">
          <h2>📅 Important Dates</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Form Start Date</label>
              <input
                type="date"
                value={form.dates.formStart}
                onChange={(e) => handleNestedChange("dates", "formStart", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Last Date to Apply</label>
              <input
                type="date"
                value={form.dates.lastDate}
                onChange={(e) => handleNestedChange("dates", "lastDate", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fee Last Date</label>
              <input
                type="date"
                value={form.dates.feeLastDate}
                onChange={(e) => handleNestedChange("dates", "feeLastDate", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Exam Date</label>
              <input
                type="date"
                value={form.dates.examDate}
                onChange={(e) => handleNestedChange("dates", "examDate", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Admit Card Date</label>
              <input
                type="date"
                value={form.dates.admitCardDate}
                onChange={(e) => handleNestedChange("dates", "admitCardDate", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ========== AGE LIMIT ========== */}
        <section className="form-section">
          <h2>👤 Age Limit</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Minimum Age</label>
              <input
                type="number"
                placeholder="e.g., 18"
                value={form.ageLimit.min}
                onChange={(e) => handleNestedChange("ageLimit", "min", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Maximum Age</label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={form.ageLimit.max}
                onChange={(e) => handleNestedChange("ageLimit", "max", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Relaxation (if any)</label>
              <input
                type="text"
                placeholder="e.g., SC/ST +5 years, OBC +3 years"
                value={form.ageLimit.relaxation}
                onChange={(e) => handleNestedChange("ageLimit", "relaxation", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ========== APPLICATION FEES ========== */}
        <section className="form-section">
          <h2>💰 Application Fees</h2>
          <button type="button" className="btn-add" onClick={addFee}>
            + Add Fee Category
          </button>
          
          {form.fees.map((fee, idx) => (
            <div key={idx} className="array-item">
              <div className="array-fields">
                <input
                  type="text"
                  placeholder="Category (e.g., GEN/OBC/SC/ST/EWS)"
                  value={fee.category}
                  onChange={(e) => updateFee(idx, "category", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={fee.amount}
                  onChange={(e) => updateFee(idx, "amount", e.target.value)}
                />
              </div>
              <button type="button" className="btn-remove" onClick={() => removeFee(idx)}>
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* ========== VACANCY DETAILS ========== */}
        <section className="form-section">
          <h2>🎯 Vacancy Details</h2>
          <button type="button" className="btn-add" onClick={addVacancy}>
            + Add Post/Vacancy
          </button>
          
          {form.vacancy.map((vac, vacIdx) => (
            <div key={vacIdx} className="vacancy-card">
              <div className="vacancy-header">
                <h3>Post #{vacIdx + 1}</h3>
                <button type="button" className="btn-remove" onClick={() => removeVacancy(vacIdx)}>
                  Remove Post
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Post Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Junior Engineer, Clerk"
                    value={vac.postName}
                    onChange={(e) => updateVacancy(vacIdx, "postName", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Total Vacancies *</label>
                  <input
                    type="number"
                    placeholder="Total seats"
                    value={vac.total}
                    onChange={(e) => updateVacancy(vacIdx, "total", e.target.value)}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Eligibility (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., B.Tech / Graduate / Diploma"
                    value={vac.eligibility}
                    onChange={(e) => updateVacancy(vacIdx, "eligibility", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sub-section">
                <label>📊 Category-wise Seats</label>
                <button type="button" className="btn-add-small" onClick={() => addCategoryWise(vacIdx)}>
                  + Add Category
                </button>
                
                {vac.categoryWise.map((cat, catIdx) => (
                  <div key={catIdx} className="array-item compact">
                    <input
                      type="text"
                      placeholder="Category (GEN/OBC/SC/ST/EWS)"
                      value={cat.category}
                      onChange={(e) => updateCategoryWise(vacIdx, catIdx, "category", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Seats"
                      value={cat.seats}
                      onChange={(e) => updateCategoryWise(vacIdx, catIdx, "seats", e.target.value)}
                    />
                    <button type="button" className="btn-remove-small" onClick={() => removeCategoryWise(vacIdx, catIdx)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ========== IMPORTANT LINKS ========== */}
        <section className="form-section">
          <h2>🔗 Important Links</h2>
          <button type="button" className="btn-add" onClick={addLink}>
            + Add Link
          </button>
          
          {form.links.map((link, idx) => (
            <div key={idx} className="array-item">
              <div className="array-fields">
                <input
                  type="text"
                  placeholder="Link Title (e.g., Apply Online)"
                  value={link.title}
                  onChange={(e) => updateLink(idx, "title", e.target.value)}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                />
              </div>
              <button type="button" className="btn-remove" onClick={() => removeLink(idx)}>
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* ========== REQUIRED DOCUMENTS ========== */}
        <section className="form-section">
          <h2>📄 Required Documents</h2>
          <button type="button" className="btn-add" onClick={addDocument}>
            + Add Document
          </button>
          
          {form.documents.map((doc, idx) => (
            <div key={idx} className="array-item">
              <div className="array-fields">
                <input
                  type="text"
                  placeholder="Document Name (e.g., Aadhar Card)"
                  value={doc.name}
                  onChange={(e) => updateDocument(idx, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={doc.description}
                  onChange={(e) => updateDocument(idx, "description", e.target.value)}
                />
              </div>
              <button type="button" className="btn-remove" onClick={() => removeDocument(idx)}>
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* ========== TAGS ========== */}
        <section className="form-section">
          <h2>🏷️ Tags (for search/filter)</h2>
          <div className="tags-input-container">
            <div className="tags-list">
              {form.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Type tag and press Enter"
                className="tag-input"
              />
            </div>
          </div>
        </section>

        {/* ========== FULL DESCRIPTION ========== */}
        <section className="form-section">
          <h2>📝 Full Description</h2>
          <textarea
            name="description"
            rows="8"
            value={form.description}
            onChange={handleChange}
            placeholder="Provide detailed description about the post, eligibility, selection process, etc..."
            className="description-textarea"
          />
        </section>

        {/* ========== SUBMIT BUTTON ========== */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating..." : "✨ Create Post"}
          </button>
          <button
            type="button"
            className="btn-reset"
            onClick={() => window.location.reload()}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;