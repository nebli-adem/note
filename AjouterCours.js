import React, { useEffect, useState } from "react";
import axios from "axios";

const AjouterCours = ({ enseignantId }) => {
    const [classes, setClasses] = useState([]);
    const [classe, setClasse] = useState("");
    const [titre, setTitre] = useState("");
    const [contenu, setContenu] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/enseignant-classes/${enseignantId}`)
            .then(res => {
                console.log("CLASSES:", res.data);
                setClasses(res.data);
            })
            .catch(err => console.error(err));
    }, [enseignantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/cours", {
                enseignant_id: enseignantId,
                classe,
                titre,
                contenu,
            });
            setMessage("Cours ajouté !");
            setTitre("");
            setContenu("");
        } catch (error) {
            setMessage("Erreur lors de l'ajout.");
        }
    };

    return (
        <div style={{ margin: "20px auto", width: "400px" }}>
            <h2>Ajouter un nouveau cours</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <select value={classe} onChange={(e) => setClasse(e.target.value)} required>
                    <option value="">-- Choisir une classe --</option>
                    {classes.map((cl, i) => (
                        <option key={i} value={cl.classe}>{cl.classe}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Titre du cours"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Contenu du cours"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    required
                    rows={5}
                />
                <button type="submit">Ajouter</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default AjouterCours;
