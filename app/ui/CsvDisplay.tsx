import React from 'react';

interface CsvDisplayProps {
  data: any[];
}

const CsvDisplay: React.FC<CsvDisplayProps> = ({ data }) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-auto max-h-full max-w-full border border-gray-300 rounded-lg">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">
                {header}
              </th>
            ))} 
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} className="py-2 px-4 border-b border-gray-300">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvDisplay;