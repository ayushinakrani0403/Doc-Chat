export default function Loading() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#F1F5F9",
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={{ textAlign: "center" }}>
        {/* Spinner ring */}
        <div style={{
          width: 48,
          height: 48,
          border: "3px solid #E2E8F0",
          borderTop: "3px solid #7c3aed",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />

        {/* Text */}
        <div style={{
          fontSize: 14,
          color: "#94A3B8",
          fontFamily: "'Sora', sans-serif",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          Loading...
        </div>
      </div>
    </div>
  )
}