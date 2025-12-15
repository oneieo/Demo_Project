import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // localStorage에 검색어 저장
      localStorage.setItem("searchKeyword", searchQuery.trim());
      // 검색 페이지로 이동
      navigate("/search");
      // 검색창 닫기 및 초기화
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  // 검색 입력 처리
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={handleHomeClick}>
            POPFLIX
          </Link>

          <div className="navbar-links desktop-links">
            <Link
              to="/"
              className={`navbar-link ${isActive("/") ? "active" : ""}`}
              onClick={handleHomeClick}
            >
              홈
            </Link>
            <Link
              to="/popular"
              className={`navbar-link ${isActive("/popular") ? "active" : ""}`}
            >
              시리즈
            </Link>
            <Link
              to="/search"
              className={`navbar-link ${isActive("/search") ? "active" : ""}`}
            >
              영화
            </Link>
            <Link
              to="/wishlist"
              className={`navbar-link ${isActive("/wishlist") ? "active" : ""}`}
            >
              NEW! 요즘 대세 콘텐츠
            </Link>
            <Link
              to="/wishlist"
              className={`navbar-link ${isActive("/wishlist") ? "active" : ""}`}
            >
              내가 찜한 리스트
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <div className="search-container">
            <button
              className="icon-button"
              onClick={() => setShowSearch(!showSearch)}
            >
              <i className="fas fa-search"></i>
            </button>
            {showSearch && (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder="제목, 사람, 장르"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                {searchQuery && (
                  <button type="submit" className="search-submit-btn">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                )}
              </form>
            )}
          </div>
          <div className="profile-menu">
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Profile"
              className="profile-avatar"
            />
            <i className="fas fa-caret-down"></i>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {/* 모바일 검색 */}
        <div className="mobile-search">
          <form onSubmit={handleSearch} className="mobile-search-form">
            <input
              type="text"
              className="mobile-search-input"
              placeholder="제목, 사람, 장르 검색"
              value={searchQuery}
              onChange={handleSearchInput}
            />
            <button type="submit" className="mobile-search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        <Link
          to="/"
          className={`navbar-link ${isActive("/") ? "active" : ""}`}
          onClick={handleHomeClick}
        >
          홈
        </Link>
        <Link
          to="/popular"
          className={`navbar-link ${isActive("/popular") ? "active" : ""}`}
        >
          시리즈
        </Link>
        <Link
          to="/search"
          className={`navbar-link ${isActive("/search") ? "active" : ""}`}
        >
          영화
        </Link>
        <Link
          to="/wishlist"
          className={`navbar-link ${isActive("/wishlist") ? "active" : ""}`}
        >
          NEW! 요즘 대세 콘텐츠
        </Link>
        <Link
          to="/wishlist"
          className={`navbar-link ${isActive("/wishlist") ? "active" : ""}`}
        >
          내가 찜한 리스트
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
