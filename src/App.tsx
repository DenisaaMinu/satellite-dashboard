import { ValueRow } from "./components/ValueRow/ValueRow";

function App() {
  return (
    <main>
      <h1>Satellite Dashboard</h1>
      <div style={{ width: 335 }}>
        <ValueRow label="Battery 2 voltage" value={14.5} unit="V" />
        <ValueRow label="Payload temperature" value={38} unit="°C" status="caution" />
        <ValueRow label="S-band radio" pill="standby" />
        <ValueRow label="Battery 2 voltage" value={14.5} unit="V" staleAge="3 h" />
        <ValueRow label="Payload temperature" value={38} unit="°C" status="critical" staleAge="3 h" />
      </div>
    </main >
  );
}

export default App;