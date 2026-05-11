import { useEffect, useMemo, useState } from 'react';
import { ScanRecord, categoryCounts, loadHistory, mediumHighRiskCount } from '../../utils/smartQR';

function Analytics() {
  const [records, setRecords] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const counts = useMemo(() => categoryCounts(records), [records]);
  const categories = Object.keys(counts);

  return (
    <main className="page">
      <h2>Analytics</h2>
      <p>The analytics page summarizes scanned QR records by category. It uses React TypeScript and localStorage records created from the scanner page.</p>

      <section className="stats-row">
        <div className="stat-box">
          <strong>{records.length}</strong>
          <span>Total Scans</span>
        </div>
        <div className="stat-box">
          <strong>{categories.length}</strong>
          <span>Categories Found</span>
        </div>
        <div className="stat-box">
          <strong>{mediumHighRiskCount(records)}</strong>
          <span>Medium/High Risk</span>
        </div>
      </section>

      <p className="notice">
        <strong>Total Scans:</strong> {records.length}
        &nbsp; | &nbsp;
        <strong>Categories Found:</strong> {categories.length}
        &nbsp; | &nbsp;
        <strong>Medium/High Risk:</strong> {mediumHighRiskCount(records)}
      </p>

      <section className="table-container">
        <table className="table-bordered" style={{ minWidth: '480px', maxWidth: '780px' }}>
          <thead>
            <tr>
              <th>QR Data Category</th>
              <th>Total Records</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-empty">No analytics data available.</td>
              </tr>
            ) : (
              categories.map((category) => {
                const total = counts[category];
                const percent = records.length ? Math.round((total / records.length) * 100) : 0;
                return (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{total}</td>
                    <td>{percent}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <section className="card-container">
        <article className="card">
          <h3>URL Detection</h3>
          <p>Identifies website links and highlights suspicious words such as login, verify, free, gift, offer and claim.</p>
        </article>
        <article className="card">
          <h3>Contact Detection</h3>
          <p>Recognizes phone numbers, email addresses and contact-card formats.</p>
        </article>
        <article className="card">
          <h3>Risk Suggestion</h3>
          <p>Provides basic low, medium or high risk classification according to the detected data pattern.</p>
        </article>
      </section>
    </main>
  );
}

export default Analytics;
