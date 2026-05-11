import type { ScanRecord } from '../../utils/smartQR';

type Props = {
  records: ScanRecord[];
  limit?: number;
};

function RecordsTable({ records, limit }: Props) {
  const shownRecords = typeof limit === 'number' ? records.slice(0, limit) : records;

  return (
    <div className="table-container">
      <table className="table-bordered" style={{ minWidth: '820px', maxWidth: '1100px' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Risk</th>
            <th>Detected Data</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {shownRecords.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-empty">No records available.</td>
            </tr>
          ) : (
            shownRecords.map((item, index) => (
              <tr key={`${item.date}-${index}`}>
                <td>{index + 1}</td>
                <td>{item.category}</td>
                <td>{item.risk}</td>
                <td>{item.value.slice(0, 90)}</td>
                <td>{item.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecordsTable;
