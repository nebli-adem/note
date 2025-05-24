import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignup = () => {
        navigate("/create-account");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h1>Bienvenue à votre site </h1>
            <div style={styles.buttonContainer}>
                <button onClick={handleLogin} style={styles.button}>
                    Se connecter
                </button>
                <button onClick={handleSignup} style={styles.button}>
                    Créer un compte
                </button>
            </div>

            {/* Annonces */}
            
        </div>
    );
};

const styles = {
    buttonContainer: {
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },
    button: {
        padding: "12px 24px",
        fontSize: "17px",
        backgroundColor: "#27ae60", // Vert doux
        color: "#fff",
        borderRadius: "8px",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 12px rgba(39, 174, 96, 0.4)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        fontWeight: "600",
    },
    annonceContainer: {
        marginTop: "50px",
        padding: "20px",
        borderRadius: "10px",
    },
    cardContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
    },
    card: {
        width: "250px",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    img: {
        width: "100%",
        height: "150px",
        objectFit: "contain",
        borderRadius: "10px",
    },
    date: {
        backgroundColor: "#f1c40f",
        color: "white",
        fontWeight: "bold",
        padding: "5px 10px",
        borderRadius: "5px",
        display: "inline-block",
        marginBottom: "10px",
    },
};

export default Home;
