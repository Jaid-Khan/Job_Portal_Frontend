import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { useParams, Link } from "react-router-dom";
import "../styling/JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define fetchPost with useCallback
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch post details");
    } finally {
      setLoading(false);
    }
  }, [id]); // Add id as dependency

  useEffect(() => {
    fetchPost();
  }, [fetchPost]); // Now includes fetchPost as dependency

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Job": return "#28a745";
      case "Admit Card": return "#ffc107";
      case "Result": return "#17a2b8";
      case "Answer Key": return "#dc3545";
      default: return "#6c757d";
    }
  };

  if (loading) return <div className="loading">Loading post details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Post not found</div>;

  return (
    <div className="job-details-container">
      <div className="details-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <div className="post-category" style={{ backgroundColor: getCategoryColor(post.category) }}>
          {post.category}
        </div>
      </div>

      <div className="details-card">
        <h1>{post.title}</h1>
        
        <div className="organization">
          <span className="icon">🏢</span>
          <strong>{post.organization}</strong>
        </div>

        {post.status && (
          <div className={`status-badge ${post.status}`}>
            {post.status === "published" ? "📢 Published" : "📄 Draft"}
          </div>
        )}

        {/* Important Dates Section */}
        {(post.dates?.formStart || post.dates?.lastDate || post.dates?.examDate) && (
          <div className="info-section">
            <h2>📅 Important Dates</h2>
            <div className="dates-grid">
              {post.dates.formStart && (
                <div className="date-item">
                  <span className="label">Application Start:</span>
                  <span className="value">{formatDate(post.dates.formStart)}</span>
                </div>
              )}
              {post.dates.lastDate && (
                <div className="date-item">
                  <span className="label">Last Date to Apply:</span>
                  <span className="value">{formatDate(post.dates.lastDate)}</span>
                </div>
              )}
              {post.dates.feeLastDate && (
                <div className="date-item">
                  <span className="label">Fee Payment Last Date:</span>
                  <span className="value">{formatDate(post.dates.feeLastDate)}</span>
                </div>
              )}
              {post.dates.examDate && (
                <div className="date-item">
                  <span className="label">Exam Date:</span>
                  <span className="value">{formatDate(post.dates.examDate)}</span>
                </div>
              )}
              {post.dates.admitCardDate && (
                <div className="date-item">
                  <span className="label">Admit Card Release:</span>
                  <span className="value">{formatDate(post.dates.admitCardDate)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application Fee Section */}
        {post.fees && post.fees.length > 0 && (
          <div className="info-section">
            <h2>💰 Application Fee</h2>
            <div className="fees-grid">
              {post.fees.map((fee, idx) => (
                <div key={idx} className="fee-item">
                  <span className="category">{fee.category}</span>
                  <span className="amount">₹{fee.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Age Limit Section */}
        {(post.ageLimit?.min || post.ageLimit?.max) && (
          <div className="info-section">
            <h2>👤 Age Limit</h2>
            <div className="age-limit">
              <p>
                {post.ageLimit.min && post.ageLimit.max 
                  ? `${post.ageLimit.min} - ${post.ageLimit.max} years`
                  : post.ageLimit.min 
                    ? `Minimum ${post.ageLimit.min} years`
                    : post.ageLimit.max 
                      ? `Maximum ${post.ageLimit.max} years`
                      : "Not specified"}
              </p>
              {post.ageLimit.relaxation && (
                <p className="relaxation">Relaxation: {post.ageLimit.relaxation}</p>
              )}
            </div>
          </div>
        )}

        {/* Vacancy Details Section */}
        {post.vacancy && post.vacancy.length > 0 && (
          <div className="info-section">
            <h2>🎯 Vacancy Details</h2>
            {post.vacancy.map((vac, idx) => (
              <div key={idx} className="vacancy-card">
                <h3>{vac.postName}</h3>
                <p><strong>Total Vacancies:</strong> {vac.total}</p>
                {vac.eligibility && <p><strong>Eligibility:</strong> {vac.eligibility}</p>}
                
                {vac.categoryWise && vac.categoryWise.length > 0 && (
                  <div className="category-wise">
                    <h4>Category-wise Distribution:</h4>
                    <div className="category-grid">
                      {vac.categoryWise.map((cat, catIdx) => (
                        <div key={catIdx} className="category-item">
                          <span>{cat.category}</span>
                          <span>{cat.seats} seats</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Description Section */}
        {post.description && (
          <div className="info-section">
            <h2>📝 Description</h2>
            <div className="description">
              {post.description.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Important Links Section */}
        {post.links && post.links.length > 0 && (
          <div className="info-section">
            <h2>🔗 Important Links</h2>
            <div className="links-list">
              {post.links.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-item"
                >
                  {link.title} →
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Required Documents Section */}
        {post.documents && post.documents.length > 0 && (
          <div className="info-section">
            <h2>📄 Required Documents</h2>
            <div className="documents-list">
              {post.documents.map((doc, idx) => (
                <div key={idx} className="document-item">
                  <span className="doc-name">📄 {doc.name}</span>
                  {doc.description && (
                    <span className="doc-description">({doc.description})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="info-section">
            <h2>🏷️ Tags</h2>
            <div className="tags-container">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="post-footer">
          <p>Posted on: {formatDate(post.createdAt)}</p>
          {post.updatedAt !== post.createdAt && (
            <p>Last updated: {formatDate(post.updatedAt)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;