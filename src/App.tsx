import { ValueRow } from "./components/ValueRow/ValueRow";

function App() {
  return (
    <main>
      <h1>Satellite Dashboard</h1>
      <div style={{ width: 335 }}>
        {/* Example data, not real satellite values */}
        <ValueRow
          label="Battery 2 voltage"
          value={14.6}
          unit="V"
          range={{ min: 11.5, max: 17, safe: { min: 12, max: 16 }, caution: { min: 12.4, max: 15.6 } }}
        />
        <ValueRow
          label="Payload temperature"
          value={38}
          unit="°C"
          status="caution"
          range={{ min: -20, max: 60, safe: { min: 0, max: 40 }, caution: { min: 5, max: 35 } }}
        />
        <ValueRow label="S-band radio" pill="standby" />
        <ValueRow
          label="Battery 2 voltage"
          value={14.6}
          unit="V"
          staleAge="3 h"
          range={{ min: 11.5, max: 17, safe: { min: 12, max: 16 }, caution: { min: 12.4, max: 15.6 } }}
        />
        <ValueRow
          label="Payload temperature"
          value={45}
          unit="°C"
          status="critical"
          staleAge="3 h"
          range={{ min: -20, max: 60, safe: { min: 0, max: 40 }, caution: { min: 5, max: 35 } }}
        />
      </div>
    </main >
  );
}

export default App;