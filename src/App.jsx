import React, { useState } from 'react';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';

export default function App() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results.data);
      },
    });
  };

  const analyzeData = () => {
    const good = data.filter((row) => {
      const ctr = parseFloat(row['クリック率'] || row['CTR'] || 0);
      const cvr = parseFloat(row['コンバージョン率'] || row['CVR'] || 0);
      const acos = parseFloat(row['ACOS'] || row['広告費売上高比率（ACOS）合計'] || 0);
      return ctr >= 0.005 && cvr >= 0.05 && acos <= 0.18;
    });
    setFiltered(good);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Amazon広告分析アプリ</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <button onClick={analyzeData} style={{ margin: '1rem' }}>分析実行</button>

      {filtered.length > 0 && (
        <div>
          <h2>優良キーワード候補</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                {Object.keys(filtered[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <CSVLink data={filtered} filename="good_keywords.csv">
            <button style={{ marginTop: '1rem' }}>CSVダウンロード</button>
          </CSVLink>
        </div>
      )}
    </div>
  );
}
