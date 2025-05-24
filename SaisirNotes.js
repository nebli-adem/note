import React, { useEffect, useState } from "react";
import axios from "axios";

const SaisirNotes = ({ enseignantId }) => {
  const [classes, setClasses] = useState([]);
  const [classe, setClasse] = useState("");
  const [matieres, setMatieres] = useState([]);
  const [matiereId, setMatiereId] = useState("");
  const [etudiants, setEtudiants] = useState([]);
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger les classes et matières dès le départ
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesRes, matieresRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/enseignant-classes/${enseignantId}`),
          axios.get("http://localhost:3000/api/matieres"),
        ]);
        setClasses(classesRes.data);
        setMatieres(matieresRes.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setMessage("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enseignantId]);

  const handleClasseChange = async (e) => {
    const selectedClasse = e.target.value;
    setClasse(selectedClasse);
    setMessage("");
    if (!selectedClasse) {
      setEtudiants([]);
      setNotes([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/etudiants/${selectedClasse}`);
      setEtudiants(res.data);
      setNotes(res.data.map((etud) => ({ etudiant_id: etud.id, note: "" })));
    } catch (err) {
      console.error("Erreur chargement étudiants:", err);
      setMessage("Erreur lors du chargement des étudiants.");
      setEtudiants([]);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (index, value) => {
    if (value < 0 || value > 20) return; // validation simple
    const updatedNotes = [...notes];
    updatedNotes[index].note = value;
    setNotes(updatedNotes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!classe || !matiereId || notes.some(n => n.note === "")) {
      setMessage("Veuillez remplir tous les champs correctement.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/notes", {
        classe,
        enseignant_id: enseignantId,
        matiere_id: matiereId,
        notes,
      });
      setMessage("Notes enregistrées !");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      setMessage("Erreur lors de l'enregistrement des notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Saisir les notes</h2>

      {loading && <p style={styles.loading}>Chargement...</p>}

      <div style={styles.selectGroup}>
        <select value={classe} onChange={handleClasseChange} style={styles.select} required>
          <option value="">-- Choisir une classe --</option>
          {classes.map((cl) => (
            <option key={cl.classe} value={cl.classe}>
              {cl.classe}
            </option>
          ))}
        </select>

        <select
          value={matiereId}
          onChange={(e) => setMatiereId(e.target.value)}
          style={styles.select}
          required
        >
          <option value="">-- Choisir une matière --</option>
          {matieres.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nom}
            </option>
          ))}
        </select>
      </div>

      {etudiants.length > 0 && (
        <form onSubmit={handleSubmit} style={styles.form}>
          {etudiants.map((etudiant, index) => (
            <div key={etudiant.id} style={styles.inputGroup}>
              <label htmlFor={`note-${etudiant.id}`} style={styles.label}>
                {etudiant.username} :
              </label>
              <input
                id={`note-${etudiant.id}`}
                type="number"
                min="0"
                max="20"
                value={notes[index]?.note || ""}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                style={styles.input}
                required
              />
            </div>
          ))}

          <button type="submit" style={styles.button} disabled={loading}>
            Enregistrer les notes
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: 20,
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  loading: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 10,
  },
  selectGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  select: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontWeight: "bold",
  },
  input: {
    width: 80,
    padding: 8,
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
    textAlign: "center",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    fontSize: 18,
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10,
  },
  message: {
    marginTop: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default SaisirNotes;
