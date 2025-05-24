import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SimpleLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!username.trim() || !password.trim()) {
            setMessage("Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/api/login", {
                username,
                password,
            });

            const { token, role, id } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("id", id);

            setToken(token);
            setMessage("Connexion réussie !");

            if (role === "etudiant") navigate("/etudiant");
            else if (role === "enseignant") navigate("/enseignant");
            else if (role === "admin") navigate("/admin");
            else setMessage("Rôle inconnu.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Erreur serveur, réessayez plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Connexion</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Connexion..." : "Connexion"}
                </button>
            </form>
            {message && (
                <p style={{ ...styles.message, color: token ? "#28a745" : "#dc3545" }}>
                    {message}
                </p>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
        padding: "20px",
        backgroundColor: "#f4f7f6", // gris très clair
        minHeight: "100vh",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#2e5d34", // vert foncé
        marginBottom: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "100%",
        maxWidth: "320px",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(46, 93, 52, 0.15)", // ombre vert clair
    },
    input: {
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #a3b18a", // vert gris clair
        transition: "border 0.3s ease",
        outline: "none",
        color: "#2e5d34",
    },
    button: {
        padding: "12px",
        fontSize: "16px",
        backgroundColor: "#3a7d44", // vert moyen
        color: "#f0f6f1", // presque blanc
        fontWeight: "600",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    buttonHover: {
        backgroundColor: "#2e5d34", // vert foncé au survol
        transform: "scale(1.05)",
    },
    message: {
        fontSize: "15px",
        fontWeight: "500",
        marginTop: "20px",
    },
};

export default SimpleLogin;
