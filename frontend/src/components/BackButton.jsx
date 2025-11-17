import { useNavigate } from "react-router-dom";

function BackButton({ label = "Voltar" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="back-button"
      onClick={() => navigate(-1)}
    >
      ← {label}
    </button>
  );
}

export default BackButton;
