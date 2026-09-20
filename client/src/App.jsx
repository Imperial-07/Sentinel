import {useState} from 'react';
import './App.css';

function App() {
  const [rainfall, setRainfall] = useState(50);
  const [drainageCapacity, setDrainageCapacity] = useState(30);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rainfall: Number(rainfall), 
          drainageCapacity: Number(drainageCapacity) 
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        alert("Simulation failed on server");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>FLOWSHIELD Simulation Engine</h1>
      
      <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px' }}>
        <div>
          <label>Rainfall: </label>
          <input 
            type="number" 
            value={rainfall} 
            onChange={(e) => setRainfall(e.target.value)} 
          />
        </div>
        
        <div>
          <label>Drainage Capacity: </label>
          <input 
            type="number" 
            value={drainageCapacity} 
            onChange={(e) => setDrainageCapacity(e.target.value)} 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Running Simulation...' : 'Run Simulation'}
        </button>
      </form>

      {results && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '5px' }}>
          <h3>Results:</h3>
          <p><strong>River Level:</strong> {results.riverLevel != null ? `${results.riverLevel} m` : 'N/A'}</p>
          <p><strong>Water Storage:</strong> {results.waterStorage != null ? `${results.waterStorage} m³` : 'N/A'}</p>
          <p><strong>Overflow:</strong> {results.overflow != null ? `${results.overflow} m³` : 'N/A'}</p>
          <p><strong>Risk Index:</strong> {results.riskIndex} / 100</p>
          <p><strong>Risk Level:</strong> <span style={{ fontWeight: 'bold', color: results.riskLevel === 'CRITICAL' ? 'red' : results.riskLevel === 'WARNING' ? 'orange' : results.riskLevel === 'WATCH' ? '#b58900' : 'green' }}>{results.riskLevel}</span></p>
          {results.stats && (
            <p><strong>Active Alert Zones:</strong> {results.stats.activeZones} (Critical: {results.stats.criticalZones})</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
