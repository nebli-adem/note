import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./téléchargement.png";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.left}>
                <img src={logo} alt="Logo" style={styles.logo} />
                <h1 style={styles.title}>ISET Kebili</h1>
            </div>
            <div style={styles.right}>
                <button style={styles.link} onClick={() => navigate("/")}>Accueil</button>
                <button style={styles.link} onClick={() => navigate("/")}>Actualités</button>
                {/* Bouton Contact supprimé */}
                <button style={styles.logout} onClick={handleLogout}>Déconnexion</button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: "#f9f9f9",
        color: "#333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    logo: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#222",
        userSelect: "none",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },
    link: {
        backgroundColor: "transparent",
        border: "none",
        color: "#555",
        fontSize: "16px",
        cursor: "pointer",
        padding: "8px 14px",
        borderRadius: "6px",
        transition: "background-color 0.3s ease, color 0.3s ease",
    },
    linkHover: {
        backgroundColor: "#e0e0e0",
        color: "#000",
    },
    logout: {
        backgroundColor: "#ff9f43",
        border: "none",
        color: "#fff",
        fontSize: "15px",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        boxShadow: "0 3px 6px rgba(255, 159, 67, 0.5)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    logoutHover: {
        backgroundColor: "#e88e17",
        transform: "scale(1.05)",
    },
};

export default Navbar;
