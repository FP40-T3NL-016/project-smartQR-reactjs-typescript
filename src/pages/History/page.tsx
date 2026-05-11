import { useEffect, useState } from 'react';
import RecordsTable from '../../components/RecordsTable/page';
import { ScanRecord, clearAllRecords, loadHistory } from '../../utils/smartQR';

function History() {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [message, setMessage] = useState('Saved QR records will appear below.');

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const handleClear = () => {
    clearAllRecords();
    setRecords([]);
    setMessage('Scan history has been cleared.');
  };

  return (
    <main className="page">
      <h2>Saved QR History</h2>
      <p>This page shows QR data records saved in browser localStorage. It works like the view-all-records section of the SmartQR database.</p>

      <div className="actions">
        <button type="button" onClick={() => setRecords(loadHistory())}>Refresh History</button>
        <button className="border-button danger-button" type="button" onClick={handleClear}>Clear History</button>
      </div>

      <p className="notice">{message}</p>
      <RecordsTable records={records} />
    </main>
  );
}

export default History;
