import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/register-requests");
        setRequests(response.data);
        setMessage("");
        setError(false);
      } catch (error) {
        setMessage("Erreur de récupération des demandes.");
        setError(true);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post("http://localhost:3000/api/approve-request", { id });
      setMessage("Demande approuvée !");
      setError(false);
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Erreur lors de l'approbation :", error);

      if (error.response) {
        setMessage(`Erreur: ${error.response.data.message || "L'approbation a échoué."}`);
      } else if (error.request) {
        setMessage("Erreur: Pas de réponse du serveur.");
      } else {
        setMessage("Erreur lors de l'approbation. Vérifiez votre connexion.");
      }
      setError(true);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post("http://localhost:3000/api/reject-request", { id });
      setMessage("Demande rejetée.");
      setError(false);
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Erreur lors du rejet :", error);
      setMessage("Erreur lors du rejet.");
      setError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2>Gestion des demandes d'inscription</h2>
      {message && (
        <p style={{ ...styles.message, color: error ? "red" : "green" }}>{message}</p>
      )}
      <ul style={styles.list}>
        {requests.length === 0 && <p>Aucune demande en attente.</p>}
        {requests.map((request) => (
          <li key={request.id} style={styles.listItem}>
            <span>
              {request.username} ({request.role}) - {request.id}
            </span>
            <div style={styles.buttons}>
              <button style={styles.approveBtn} onClick={() => handleApprove(request.id)}>
                Approuver
              </button>
              <button style={styles.rejectBtn} onClick={() => handleReject(request.id)}>
                Rejeter
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Se déconnecter
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
    padding: "20px",
  },
  message: {
    fontWeight: "bold",
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
    color: "black",
    marginBottom: "15px",
    padding: "10px 20px",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
  },
  buttons: {
    display: "flex",
    gap: "10px",
  },
  approveBtn: {
    padding: "8px 12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "8px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutBtn: {
    marginTop: "30px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminPage;
