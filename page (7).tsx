import type { ScanRecord } from '../../utils/smartQR';

type Props = {
  record: ScanRecord | null;
  emptyText: string;
};

function AnalysisResult({ record, emptyText }: Props) {
  if (!record) {
    return <div className="result-box">{emptyText}</div>;
  }

  const riskText = record.risk === 'High' ? 'High ⚠️' : record.risk === 'Medium' ? 'Medium ⚠️' : 'Low ✅';

  return (
    <div className="result-box">
      <h3>Analysis Result</h3>
      <p><strong>Category:</strong> {record.category}</p>
      <p><strong>Risk Level:</strong> {riskText}</p>
      <p><strong>Data Length:</strong> {record.length} characters</p>
      <p><strong>Suggestion:</strong> {record.suggestion}</p>
      <p><strong>Detected Data:</strong><br />{record.value}</p>
    </div>
  );
}

export default AnalysisResult;
