import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styling/Home.css";
import { Footer } from "../components/Footer";

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/posts");
      // console.log("DATA:", res.data);
      setPosts(res.data.data || []);
      setFilteredPosts(res.data.data || []);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Define filterPosts with useCallback to avoid recreation
  const filterPosts = useCallback(() => {
    let filtered = [...posts];

    // Filter by search term (title, organization, tags)
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(post => post.status === selectedStatus);
    }

    // Sort by latest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    filterPosts();
  }, [filterPosts]); // Now includes filterPosts as dependency

  const getCategoryColor = (category) => {
    switch(category) {
      case "Job": return "#28a745";
      case "Admit Card": return "#ffc107";
      case "Result": return "#17a2b8";
      case "Answer Key": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusBadge = (status) => {
    return status === "published" 
      ? { text: "Published", color: "#28a745", bg: "#d4edda" }
      : { text: "Draft", color: "#6c757d", bg: "#e9ecef" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getDaysLeft = (lastDate) => {
    if (!lastDate) return null;
    const today = new Date();
    const last = new Date(lastDate);
    const diffTime = last - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Closed", color: "#dc3545" };
    if (diffDays === 0) return { text: "Last Day Today!", color: "#ff9800" };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: "#ff9800" };
    return { text: `${diffDays} days left`, color: "#28a745" };
  };

  const getTotalVacancies = (vacancy) => {
    if (!vacancy || vacancy.length === 0) return 0;
    return vacancy.reduce((total, v) => total + (v.total || 0), 0);
  };

  const getFeeInfo = (fees) => {
    if (!fees || fees.length === 0) return "Not specified";
    const genFee = fees.find(f => f.category === "GEN" || f.category === "General");
    if (genFee) return `₹${genFee.amount}`;
    return `Starts from ₹${Math.min(...fees.map(f => f.amount))}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading latest updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchPosts} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>📢 Latest Government Posts</h1>
        <p>Find all job notifications, admit cards, results, and answer keys in one place</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search by title, organization, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Job">💼 Jobs</option>
            <option value="Admit Card">🎫 Admit Cards</option>
            <option value="Result">📊 Results</option>
            <option value="Answer Key">🔑 Answer Keys</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="published">📢 Published</option>
            <option value="draft">📄 Draft</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">{filteredPosts.length}</span>
          <span className="stat-label">Posts Found</span>
        </div>
        <div className="stat">
          <span className="stat-number">{posts.filter(p => p.category === "Job").length}</span>
          <span className="stat-label">Active Jobs</span>
        </div>
        <div className="stat">
          <span className="stat-number">{posts.filter(p => p.status === "published").length}</span>
          <span className="stat-label">Published</span>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          <div className="no-posts-icon">📭</div>
          <p>No posts found matching your criteria</p>
          <button onClick={() => {
            setSearchTerm("");
            setSelectedCategory("All");
            setSelectedStatus("All");
          }} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/job/${post._id}`)}
              className="post-card"
            >
              <div className="post-header">
                <div className="post-category" style={{ backgroundColor: getCategoryColor(post.category) }}>
                  {post.category}
                </div>
                <div className="post-status" style={{ 
                  backgroundColor: getStatusBadge(post.status).bg,
                  color: getStatusBadge(post.status).color
                }}>
                  {getStatusBadge(post.status).text}
                </div>
              </div>

              <h2 className="post-title">{post.title}</h2>
              
              <div className="post-organization">
                <span className="icon">🏢</span>
                {post.organization}
              </div>

              {/* Quick Info Cards */}
              <div className="quick-info">
                {post.dates?.lastDate && (
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <div>
                      <div className="info-label">Last Date</div>
                      <div className="info-value">{formatDate(post.dates.lastDate)}</div>
                      <div className="days-left" style={{ color: getDaysLeft(post.dates.lastDate).color }}>
                        {getDaysLeft(post.dates.lastDate).text}
                      </div>
                    </div>
                  </div>
                )}

                {getTotalVacancies(post.vacancy) > 0 && (
                  <div className="info-item">
                    <span className="info-icon">👥</span>
                    <div>
                      <div className="info-label">Total Vacancies</div>
                      <div className="info-value">{getTotalVacancies(post.vacancy)}</div>
                    </div>
                  </div>
                )}

                {post.fees && post.fees.length > 0 && (
                  <div className="info-item">
                    <span className="info-icon">💰</span>
                    <div>
                      <div className="info-label">Application Fee</div>
                      <div className="info-value">{getFeeInfo(post.fees)}</div>
                    </div>
                  </div>
                )}

                {(post.ageLimit?.min || post.ageLimit?.max) && (
                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <div>
                      <div className="info-label">Age Limit</div>
                      <div className="info-value">
                        {post.ageLimit.min && post.ageLimit.max 
                          ? `${post.ageLimit.min}-${post.ageLimit.max} years`
                          : post.ageLimit.min 
                            ? `Min ${post.ageLimit.min} years`
                            : post.ageLimit.max 
                              ? `Max ${post.ageLimit.max} years`
                              : "Not specified"}
                      </div>
                      {post.ageLimit.relaxation && (
                        <div className="relaxation">{post.ageLimit.relaxation}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Important Dates */}
              {(post.dates?.examDate || post.dates?.admitCardDate || post.dates?.formStart) && (
                <div className="important-dates">
                  <div className="section-title">📌 Important Dates</div>
                  <div className="dates-grid">
                    {post.dates.formStart && (
                      <div className="date-item">
                        <span>Form Start:</span>
                        <strong>{formatDate(post.dates.formStart)}</strong>
                      </div>
                    )}
                    {post.dates.examDate && (
                      <div className="date-item">
                        <span>Exam Date:</span>
                        <strong>{formatDate(post.dates.examDate)}</strong>
                      </div>
                    )}
                    {post.dates.admitCardDate && (
                      <div className="date-item">
                        <span>Admit Card:</span>
                        <strong>{formatDate(post.dates.admitCardDate)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vacancy Highlights */}
              {post.vacancy && post.vacancy.length > 0 && (
                <div className="vacancy-highlights">
                  <div className="section-title">🎯 Vacancy Highlights</div>
                  <div className="vacancy-list">
                    {post.vacancy.slice(0, 2).map((vac, idx) => (
                      <div key={idx} className="vacancy-item">
                        <span className="vacancy-name">{vac.postName}</span>
                        <span className="vacancy-count">{vac.total} posts</span>
                      </div>
                    ))}
                    {post.vacancy.length > 2 && (
                      <div className="more-vacancies">
                        +{post.vacancy.length - 2} more posts
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="tags-container">
                  {post.tags.slice(0, 5).map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                  {post.tags.length > 5 && (
                    <span className="tag-more">+{post.tags.length - 5}</span>
                  )}
                </div>
              )}

              {/* Description Preview */}
              {post.description && (
                <div className="description-preview">
                  {post.description.length > 150 
                    ? `${post.description.substring(0, 150)}...` 
                    : post.description}
                </div>
              )}

              <div className="post-footer">
                <div className="posted-date">
                  Posted: {formatDate(post.createdAt)}
                </div>
                <div className="read-more">
                  Read More →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default Home;