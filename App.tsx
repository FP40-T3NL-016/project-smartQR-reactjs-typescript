import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RecordsTable from '../../components/RecordsTable/page';
import {
  ScanRecord,
  addRecord,
  categoryCounts,
  deleteRecord,
  getCurrentUser,
  loadHistory,
  mediumHighRiskCount,
  updateRecord
} from '../../utils/smartQR';

function Dashboard() {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [recordValue, setRecordValue] = useState('');
  const [message, setMessage] = useState('Record messages will appear here.');
  const user = getCurrentUser();

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const counts = useMemo(() => categoryCounts(records), [records]);
  const categories = Object.keys(counts);
  const highest = Math.max(1, ...categories.map((category) => counts[category]));

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedIndex(value);
    setRecordValue(value === '' ? '' : records[Number(value)]?.value || '');
  };

  const insertNewRecord = () => {
    if (!recordValue.trim()) {
      setMessage('Please enter QR data before inserting a new record.');
      return;
    }
    const updated = addRecord(recordValue);
    setRecords(updated);
    setSelectedIndex('');
    setRecordValue('');
    setMessage('New QR record has been inserted successfully.');
  };

  const updateSelectedRecord = () => {
    if (selectedIndex === '') {
      setMessage('Please select a record before updating.');
      return;
    }
    if (!recordValue.trim()) {
      setMessage('Please enter updated QR data.');
      return;
    }
    const updated = updateRecord(Number(selectedIndex), recordValue);
    setRecords(updated);
    setMessage('Selected QR record has been updated successfully.');
  };

  const deleteSelectedRecord = () => {
    if (selectedIndex === '') {
      setMessage('Please select a record before deleting.');
      return;
    }
    const updated = deleteRecord(Number(selectedIndex));
    setRecords(updated);
    setSelectedIndex('');
    setRecordValue('');
    setMessage('Selected QR record has been deleted successfully.');
  };

  return (
    <main className="page">
      <section className="dashboard-header">
        <div>
          <span className="badge">Project Control Panel</span>
          <h2>Dashboard</h2>
          <p className="notice">This dashboard manages SmartQR records. It includes view, insert, update, delete and graphical summary features required in the assignment brief.</p>
        </div>
        <div className="user-panel">
          <h3>{user?.name || 'Guest User'}</h3>
          <p>{user?.email || 'Login is optional for demo testing.'}</p>
          <Link className="link-button sm-button" to="/login">Sign In</Link>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-box">
          <strong>{records.length}</strong>
          <span>Total QR Records</span>
        </div>
        <div className="stat-box">
          <strong>{categories.length}</strong>
          <span>Data Categories</span>
        </div>
        <div className="stat-box">
          <strong>{mediumHighRiskCount(records)}</strong>
          <span>Medium/High Risk</span>
        </div>
        <div className="stat-box">
          <strong>{records.length ? records[0].category : 'None'}</strong>
          <span>Latest Record Type</span>
        </div>
      </section>

      <section className="card-container dashboard-actions">
        <article className="card action-card">
          <div className="card-icon">📋</div>
          <h3>View All Records</h3>
          <p>Open the full local scan history table and review saved QR records.</p>
          <Link to="/history">View Records</Link>
        </article>
        <article className="card action-card">
          <div className="card-icon">➕</div>
          <h3>Insert New Record</h3>
          <p>Add a QR value manually from the dashboard and store it in history.</p>
          <a href="#recordManager">Insert Record</a>
        </article>
        <article className="card action-card">
          <div className="card-icon">✏️</div>
          <h3>Update Record</h3>
          <p>Select an existing record, edit its value and refresh the analysis.</p>
          <a href="#recordManager">Update Record</a>
        </article>
        <article className="card action-card">
          <div className="card-icon">🗑️</div>
          <h3>Delete Record</h3>
          <p>Remove an unwanted record from the saved local data list.</p>
          <a href="#recordManager">Delete Record</a>
        </article>
        <article className="card action-card">
          <div className="card-icon">📊</div>
          <h3>Graphical View</h3>
          <p>See a simple bar graph summary of QR records by data category.</p>
          <a href="#graphicalView">View Graph</a>
        </article>
        <article className="card action-card">
          <div className="card-icon">🔍</div>
          <h3>Scan New QR</h3>
          <p>Use camera, upload image or manual input to analyze new QR data.</p>
          <Link to="/scanner">Open Scanner</Link>
        </article>
      </section>

      <section id="recordManager" className="dashboard-panel">
        <h3>Quick Record Management</h3>
        <p>These options work like view, insert, update and delete features for the SmartQR local database records.</p>

        <div className="form-row">
          <div>
            <label htmlFor="dashboardRecordSelect">Select Existing Record</label>
            <select id="dashboardRecordSelect" value={selectedIndex} onChange={handleSelect}>
              <option value="">No record selected</option>
              {records.map((item, index) => (
                <option key={`${item.date}-${index}`} value={index}>{index + 1}. {item.category} - {item.value.slice(0, 38)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dashboardRecordValue">QR Data Value</label>
            <input id="dashboardRecordValue" type="text" placeholder="Enter QR data, URL, phone number, WiFi string or text" value={recordValue} onChange={(event) => setRecordValue(event.target.value)} />
          </div>
        </div>

        <div className="actions">
          <button type="button" onClick={insertNewRecord}>Insert New Record</button>
          <button className="border-button" type="button" onClick={updateSelectedRecord}>Update Selected</button>
          <button className="border-button danger-button" type="button" onClick={deleteSelectedRecord}>Delete Selected</button>
          <Link className="link-button border-button" to="/history">View All Records</Link>
        </div>

        <p className="small-note">{message}</p>
      </section>

      <section id="graphicalView" className="dashboard-panel">
        <h3>Graphical View for QR Database Records</h3>
        <p>The graph below is generated from records stored in browser localStorage.</p>
        <div className="bar-chart">
          {categories.length === 0 ? (
            <p className="table-empty">No data available for graph. Add or scan QR records first.</p>
          ) : (
            categories.map((category) => (
              <div className="bar-item" key={category}>
                <div className="bar-label">
                  <span>{category}</span>
                  <span>{counts[category]} record(s)</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.max(12, Math.round((counts[category] / highest) * 100))}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="table-container">
        <h3>Recent Records Preview</h3>
        <RecordsTable records={records} limit={5} />
      </section>

      <section className="table-container">
        <h3>Dashboard Features Matched with Assignment Requirements</h3>
        <table className="table-bordered" style={{ minWidth: '760px', maxWidth: '1050px' }}>
          <thead>
            <tr>
              <th>Teacher Requirement</th>
              <th>Added Feature in This Project</th>
              <th>Page/Section</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>View all stock</td><td>View all QR/database records</td><td>History page and dashboard preview</td></tr>
            <tr><td>Delete stock</td><td>Delete selected QR record</td><td>Quick Record Management</td></tr>
            <tr><td>Update stock</td><td>Update selected QR record</td><td>Quick Record Management</td></tr>
            <tr><td>Insert new stock</td><td>Insert new QR record</td><td>Quick Record Management</td></tr>
            <tr><td>Graphical view</td><td>Bar graph by QR data category</td><td>Graphical View section</td></tr>
            <tr><td>Many links and graphic styles</td><td>Navigation cards, stats cards, buttons and table preview</td><td>Dashboard page</td></tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Dashboard;
