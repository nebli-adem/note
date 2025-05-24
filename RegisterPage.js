import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("etudiant");
    const [classe, setClasse] = useState("");
    const [enseignantClasses, setEnseignantClasses] = useState([]);
    const [enseignantMatieres, setEnseignantMatieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/classes")
            .then(response => setClasses(response.data))
            .catch(error => console.error("Erreur de chargement des classes", error));

        axios.get("http://localhost:3000/api/matieres")
            .then(response => setMatieres(response.data))
            .catch(error => console.error("Erreur de chargement des matières", error));
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await axios.post("http://localhost:3000/api/register-request", {
                id,
                username,
                password,
                role,
                classe: role === "etudiant" ? classe : null,
                enseignant_classes: role === "enseignant" ? enseignantClasses : null,
                enseignant_matieres: role === "enseignant" ? enseignantMatieres : null,
            });

            setMessage("Demande d'inscription envoyée, veuillez attendre l'approbation.");
            navigate("/");
        } catch (error) {
            setMessage(error.response?.data?.message || "Erreur lors de la demande.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Créer une demande de compte</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <input style={styles.input} type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
                <input style={styles.input} type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input style={styles.input} type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select style={styles.select} value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="etudiant">Étudiant</option>
                    <option value="enseignant">Enseignant</option>
                </select>

                {role === "etudiant" && (
                    <select style={styles.select} value={classe} onChange={(e) => setClasse(e.target.value)} required>
                        <option value="">-- Choisir une classe --</option>
                        {classes.map(cl => (
                            <option key={cl.id} value={cl.nom}>{cl.nom}</option>
                        ))}
                    </select>
                )}

                {role === "enseignant" && (
                    <>
                        <h4 style={styles.sectionTitle}>Choisir les classes :</h4>
                        {classes.map(cl => (
                            <label key={cl.id} style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    value={cl.nom}
                                    checked={enseignantClasses.includes(cl.nom)}
                                    onChange={(e) => {
                                        if (e.target.checked)
                                            setEnseignantClasses([...enseignantClasses, e.target.value]);
                                        else
                                            setEnseignantClasses(enseignantClasses.filter(n => n !== e.target.value));
                                    }}
                                />
                                {cl.nom}
                            </label>
                        ))}

                        <h4 style={styles.sectionTitle}>Choisir les matières :</h4>
                        {matieres.map(m => (
                            <label key={m.id} style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    value={m.id}
                                    checked={enseignantMatieres.includes(m.id)}
                                    onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        if (e.target.checked)
                                            setEnseignantMatieres([...enseignantMatieres, id]);
                                        else
                                            setEnseignantMatieres(enseignantMatieres.filter(mid => mid !== id));
                                    }}
                                />
                                {m.nom}
                            </label>
                        ))}
                    </>
                )}

                <button type="submit" style={styles.button}>Envoyer la demande</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        marginTop: "60px",
        padding: "20px",
        backgroundColor: "#F0F0F0",
        minHeight: "100vh",
    },
    title: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#2E7D32",
        marginBottom: "30px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "100%",
        maxWidth: "400px",
        margin: "auto",
        backgroundColor: "#FAFAFA",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    },
    input: {
        padding: "12px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "1px solid #BDBDBD",
        outline: "none",
        backgroundColor: "#FFFFFF",
        color: "#424242",
    },
    select: {
        padding: "12px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "1px solid #BDBDBD",
        outline: "none",
        backgroundColor: "#FFFFFF",
        color: "#424242",
    },
    button: {
        padding: "12px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#FFFFFF",
        backgroundColor: "#2E7D32",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "600",
        marginTop: "10px",
        marginBottom: "5px",
        color: "#2E7D32",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        marginBottom: "5px",
        color: "#424242",
    },
    message: {
        marginTop: "20px",
        fontSize: "15px",
        fontWeight: "500",
        color: "#43A047",
    },
};

export default RegisterPage;
