import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styling/AdminDashboard.css";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
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
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, [checkAuth, fetchPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post deleted successfully");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  // ---------- Edit Post Functions ----------
  const handleEdit = (post) => {
    setEditingPost(post);
    setEditForm({
      title: post.title || "",
      category: post.category || "Job",
      organization: post.organization || "",
      description: post.description || "",
      status: post.status || "draft",
      tags: post.tags || [],
      dates: {
        formStart: post.dates?.formStart ? post.dates.formStart.split('T')[0] : "",
        lastDate: post.dates?.lastDate ? post.dates.lastDate.split('T')[0] : "",
        feeLastDate: post.dates?.feeLastDate ? post.dates.feeLastDate.split('T')[0] : "",
        examDate: post.dates?.examDate ? post.dates.examDate.split('T')[0] : "",
        admitCardDate: post.dates?.admitCardDate ? post.dates.admitCardDate.split('T')[0] : "",
      },
      ageLimit: {
        min: post.ageLimit?.min || "",
        max: post.ageLimit?.max || "",
        relaxation: post.ageLimit?.relaxation || "",
      },
      fees: post.fees || [],
      vacancy: post.vacancy || [],
      links: post.links || [],
      documents: post.documents || [],
    });
    setTagInput("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditNestedChange = (section, field, value) => {
    setEditForm({
      ...editForm,
      [section]: {
        ...editForm[section],
        [field]: value,
      },
    });
  };

  // Tags Management for Edit
  const addEditTag = () => {
    if (tagInput.trim() && !editForm.tags.includes(tagInput.trim())) {
      setEditForm({ ...editForm, tags: [...editForm.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeEditTag = (tagToRemove) => {
    setEditForm({ ...editForm, tags: editForm.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleEditTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEditTag();
    }
  };

  // Fees Management for Edit
  const addEditFee = () => {
    setEditForm({
      ...editForm,
      fees: [...editForm.fees, { category: "", amount: "" }],
    });
  };

  const updateEditFee = (index, key, value) => {
    const updated = [...editForm.fees];
    updated[index][key] = key === "amount" ? Number(value) : value;
    setEditForm({ ...editForm, fees: updated });
  };

  const removeEditFee = (index) => {
    const updated = editForm.fees.filter((_, i) => i !== index);
    setEditForm({ ...editForm, fees: updated });
  };

  // Vacancy Management for Edit
  const addEditVacancy = () => {
    setEditForm({
      ...editForm,
      vacancy: [
        ...editForm.vacancy,
        {
          postName: "",
          total: "",
          eligibility: "",
          categoryWise: [],
        },
      ],
    });
  };

  const updateEditVacancy = (index, field, value) => {
    const updated = [...editForm.vacancy];
    updated[index][field] = field === "total" ? Number(value) : value;
    setEditForm({ ...editForm, vacancy: updated });
  };

  const removeEditVacancy = (index) => {
    const updated = editForm.vacancy.filter((_, i) => i !== index);
    setEditForm({ ...editForm, vacancy: updated });
  };

  const addEditCategoryWise = (vacancyIndex) => {
    const updated = [...editForm.vacancy];
    updated[vacancyIndex].categoryWise.push({ category: "", seats: "" });
    setEditForm({ ...editForm, vacancy: updated });
  };

  const updateEditCategoryWise = (vacancyIndex, catIndex, field, value) => {
    const updated = [...editForm.vacancy];
    updated[vacancyIndex].categoryWise[catIndex][field] = 
      field === "seats" ? Number(value) : value;
    setEditForm({ ...editForm, vacancy: updated });
  };

  const removeEditCategoryWise = (vacancyIndex, catIndex) => {
    const updated = [...editForm.vacancy];
    updated[vacancyIndex].categoryWise = updated[vacancyIndex].categoryWise.filter(
      (_, i) => i !== catIndex
    );
    setEditForm({ ...editForm, vacancy: updated });
  };

  // Links Management for Edit
  const addEditLink = () => {
    setEditForm({
      ...editForm,
      links: [...editForm.links, { title: "", url: "" }],
    });
  };

  const updateEditLink = (index, key, value) => {
    const updated = [...editForm.links];
    updated[index][key] = value;
    setEditForm({ ...editForm, links: updated });
  };

  const removeEditLink = (index) => {
    const updated = editForm.links.filter((_, i) => i !== index);
    setEditForm({ ...editForm, links: updated });
  };

  // Documents Management for Edit
  const addEditDocument = () => {
    setEditForm({
      ...editForm,
      documents: [...editForm.documents, { name: "", description: "" }],
    });
  };

  const updateEditDocument = (index, key, value) => {
    const updated = [...editForm.documents];
    updated[index][key] = value;
    setEditForm({ ...editForm, documents: updated });
  };

  const removeEditDocument = (index) => {
    const updated = editForm.documents.filter((_, i) => i !== index);
    setEditForm({ ...editForm, documents: updated });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      
      const processedForm = {
        ...editForm,
        dates: Object.fromEntries(
          Object.entries(editForm.dates).map(([key, value]) => [key, value || null])
        ),
        ageLimit: {
          min: editForm.ageLimit.min ? Number(editForm.ageLimit.min) : undefined,
          max: editForm.ageLimit.max ? Number(editForm.ageLimit.max) : undefined,
          relaxation: editForm.ageLimit.relaxation || undefined,
        },
        fees: editForm.fees.filter(f => f.category && f.amount),
        vacancy: editForm.vacancy.map(v => ({
          ...v,
          total: v.total ? Number(v.total) : 0,
          categoryWise: v.categoryWise.filter(c => c.category && c.seats)
        })),
        links: editForm.links.filter(l => l.title && l.url),
        documents: editForm.documents.filter(d => d.name),
      };

      const res = await axios.put(`/posts/${editingPost._id}`, processedForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("✅ Post updated successfully!");
        setEditingPost(null);
        fetchPosts();
      } else {
        setError(res.data.message || "Error updating post");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating post");
      if (err.response?.status === 401) {
        navigate("/admin");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>📊 Admin Dashboard</h1>
        <div className="header-actions">
          <Link to="/admin/create" className="btn-create">
            + Create New Post
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-number">{posts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <p className="stat-number">
            {posts.filter(p => p.status === "published").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Drafts</h3>
          <p className="stat-number">
            {posts.filter(p => p.status === "draft").length}
          </p>
        </div>
      </div>

      <div className="posts-table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Last Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No posts found. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="post-title">{post.title}</td>
                  <td>
                    <span className={`category-badge ${post.category.toLowerCase()}`}>
                      {post.category}
                    </span>
                  </td>
                  <td>{post.organization}</td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status === "published" ? "📢 Published" : "📄 Draft"}
                    </span>
                  </td>
                  <td>{formatDate(post.dates?.lastDate)}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(post)}
                      className="action-btn edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <Link to={`/job/${post._id}`} className="action-btn view-btn">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="modal-overlay" onClick={() => setEditingPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Post</h2>
              <button className="modal-close" onClick={() => setEditingPost(null)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdatePost} className="edit-form">
              <div className="edit-form-scroll">
                {/* Basic Info */}
                <div className="edit-section">
                  <h3>📌 Basic Information</h3>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={editForm.category} onChange={handleEditChange}>
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
                      value={editForm.organization}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                      <option value="draft">📄 Draft</option>
                      <option value="published">🚀 Published</option>
                    </select>
                  </div>
                </div>

                {/* Important Dates */}
                <div className="edit-section">
                  <h3>📅 Important Dates</h3>
                  <div className="form-group">
                    <label>Form Start Date</label>
                    <input
                      type="date"
                      value={editForm.dates.formStart}
                      onChange={(e) => handleEditNestedChange("dates", "formStart", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Date to Apply</label>
                    <input
                      type="date"
                      value={editForm.dates.lastDate}
                      onChange={(e) => handleEditNestedChange("dates", "lastDate", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fee Last Date</label>
                    <input
                      type="date"
                      value={editForm.dates.feeLastDate}
                      onChange={(e) => handleEditNestedChange("dates", "feeLastDate", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Exam Date</label>
                    <input
                      type="date"
                      value={editForm.dates.examDate}
                      onChange={(e) => handleEditNestedChange("dates", "examDate", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Admit Card Date</label>
                    <input
                      type="date"
                      value={editForm.dates.admitCardDate}
                      onChange={(e) => handleEditNestedChange("dates", "admitCardDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Age Limit */}
                <div className="edit-section">
                  <h3>👤 Age Limit</h3>
                  <div className="form-group">
                    <label>Minimum Age</label>
                    <input
                      type="number"
                      value={editForm.ageLimit.min}
                      onChange={(e) => handleEditNestedChange("ageLimit", "min", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Maximum Age</label>
                    <input
                      type="number"
                      value={editForm.ageLimit.max}
                      onChange={(e) => handleEditNestedChange("ageLimit", "max", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Relaxation</label>
                    <input
                      type="text"
                      value={editForm.ageLimit.relaxation}
                      onChange={(e) => handleEditNestedChange("ageLimit", "relaxation", e.target.value)}
                      placeholder="e.g., SC/ST +5 years"
                    />
                  </div>
                </div>

                {/* Application Fees */}
                <div className="edit-section">
                  <h3>💰 Application Fees</h3>
                  <button type="button" className="btn-add-small" onClick={addEditFee}>
                    + Add Fee Category
                  </button>
                  {editForm.fees.map((fee, idx) => (
                    <div key={idx} className="array-item">
                      <input
                        type="text"
                        placeholder="Category"
                        value={fee.category}
                        onChange={(e) => updateEditFee(idx, "category", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={fee.amount}
                        onChange={(e) => updateEditFee(idx, "amount", e.target.value)}
                      />
                      <button type="button" onClick={() => removeEditFee(idx)}>Remove</button>
                    </div>
                  ))}
                </div>

                {/* Vacancy Details */}
                <div className="edit-section">
                  <h3>🎯 Vacancy Details</h3>
                  <button type="button" className="btn-add-small" onClick={addEditVacancy}>
                    + Add Vacancy
                  </button>
                  {editForm.vacancy.map((vac, vacIdx) => (
                    <div key={vacIdx} className="vacancy-card">
                      <h4>Post #{vacIdx + 1}</h4>
                      <input
                        type="text"
                        placeholder="Post Name"
                        value={vac.postName}
                        onChange={(e) => updateEditVacancy(vacIdx, "postName", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Total Vacancies"
                        value={vac.total}
                        onChange={(e) => updateEditVacancy(vacIdx, "total", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Eligibility"
                        value={vac.eligibility}
                        onChange={(e) => updateEditVacancy(vacIdx, "eligibility", e.target.value)}
                      />
                      <button type="button" onClick={() => removeEditVacancy(vacIdx)}>Remove Post</button>
                      
                      <div className="sub-section">
                        <label>Category-wise Seats</label>
                        <button type="button" onClick={() => addEditCategoryWise(vacIdx)}>
                          + Add Category
                        </button>
                        {vac.categoryWise.map((cat, catIdx) => (
                          <div key={catIdx} className="array-item compact">
                            <input
                              type="text"
                              placeholder="Category"
                              value={cat.category}
                              onChange={(e) => updateEditCategoryWise(vacIdx, catIdx, "category", e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="Seats"
                              value={cat.seats}
                              onChange={(e) => updateEditCategoryWise(vacIdx, catIdx, "seats", e.target.value)}
                            />
                            <button onClick={() => removeEditCategoryWise(vacIdx, catIdx)}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Links */}
                <div className="edit-section">
                  <h3>🔗 Important Links</h3>
                  <button type="button" className="btn-add-small" onClick={addEditLink}>
                    + Add Link
                  </button>
                  {editForm.links.map((link, idx) => (
                    <div key={idx} className="array-item">
                      <input
                        type="text"
                        placeholder="Title"
                        value={link.title}
                        onChange={(e) => updateEditLink(idx, "title", e.target.value)}
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateEditLink(idx, "url", e.target.value)}
                      />
                      <button onClick={() => removeEditLink(idx)}>Remove</button>
                    </div>
                  ))}
                </div>

                {/* Required Documents */}
                <div className="edit-section">
                  <h3>📄 Required Documents</h3>
                  <button type="button" className="btn-add-small" onClick={addEditDocument}>
                    + Add Document
                  </button>
                  {editForm.documents.map((doc, idx) => (
                    <div key={idx} className="array-item">
                      <input
                        type="text"
                        placeholder="Document Name"
                        value={doc.name}
                        onChange={(e) => updateEditDocument(idx, "name", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={doc.description}
                        onChange={(e) => updateEditDocument(idx, "description", e.target.value)}
                      />
                      <button onClick={() => removeEditDocument(idx)}>Remove</button>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="edit-section">
                  <h3>🏷️ Tags</h3>
                  <div className="tags-input-container">
                    <div className="tags-list">
                      {editForm.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                          {tag}
                          <button type="button" onClick={() => removeEditTag(tag)}>×</button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleEditTagKeyPress}
                        placeholder="Type tag and press Enter"
                        className="tag-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="edit-section">
                  <h3>📝 Description</h3>
                  <textarea
                    name="description"
                    rows="6"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Full description..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditingPost(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-update" disabled={updating}>
                  {updating ? "Updating..." : "Update Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;