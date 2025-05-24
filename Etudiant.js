import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EtudiantPage = () => {
    const navigate = useNavigate();
    const [cours, setCours] = useState([]);
    const [notes, setNotes] = useState([]);
    const [classe, setClasse] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = localStorage.getItem("id");

                // 1. Récupérer la classe de l'étudiant
                const resClasse = await axios.get(`http://localhost:3000/api/user-classe/${id}`);
                const userClasse = resClasse.data.classe;
                setClasse(userClasse);

                // 2. Récupérer les cours de cette classe
                const resCours = await axios.get(`http://localhost:3000/api/cours/${userClasse}`);
                setCours(resCours.data);

                // 3. Récupérer les notes de l'étudiant
                const resNotes = await axios.get(`http://localhost:3000/api/note/${id}`);
                setNotes(resNotes.data);
            } catch (err) {
                console.error("Erreur lors du chargement :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <h1>Bienvenue sur l'espace étudiant</h1>
            <p>Classe : <strong>{classe}</strong></p>

            <h2>Vos cours</h2>
            {loading ? (
                <p>Chargement des cours...</p>
            ) : cours.length > 0 ? (
                cours.map((cours, index) => (
                    <div key={index} style={styles.card}>
                        <h3>{cours.titre}</h3>
                        <p>{cours.contenu}</p>
                    </div>
                ))
            ) : (
                <p>Aucun cours disponible pour votre classe.</p>
            )}

            <h2>Vos notes</h2>
            {notes.length > 0 ? (
                notes.map((n, index) => (
                    <div key={index} style={styles.card}>
                        <h4>{n.titre}</h4>
                        <p>Note : <strong>{n.note}</strong></p>
                    </div>
                ))
            ) : (
                <p>Aucune note disponible.</p>
            )}

            <button onClick={handleLogout} style={styles.button}>
                Se déconnecter
            </button>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        marginTop: "40px",
        fontFamily: "Arial",
        padding: "20px",
    },
    card: {
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "15px",
        marginBottom: "15px",
        textAlign: "left",
        maxWidth: "600px",
        margin: "auto",
    },
    button: {
        marginTop: "20px",
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default EtudiantPage;
