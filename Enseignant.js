import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AjouterCours from "./AjouterCours";
import SaisirNotes from "./SaisirNotes";

const EnseignantPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const enseignantId = localStorage.getItem("id");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1>Bienvenue sur l'espace enseignant</h1>

      <button onClick={() => setShowForm(!showForm)} style={styles.secondaryButton}>
        {showForm ? "Cacher le formulaire" : "Ajouter un cours"}
      </button>

      <button onClick={() => setShowNotes(!showNotes)} style={styles.secondaryButton}>
        {showNotes ? "Cacher les notes" : "Saisir les notes"}
      </button>

      {showForm && <AjouterCours enseignantId={enseignantId} />}
      {showNotes && <SaisirNotes enseignantId={enseignantId} />}

      <button onClick={handleLogout} style={styles.logoutButton}>
        Se déconnecter
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
    fontFamily: "Arial",
  },
  secondaryButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px",
  },
  logoutButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EnseignantPage;
