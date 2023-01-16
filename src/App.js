import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { BrowserRouter as Router, Link, Route, Routes, useParams } from 'react-router-dom';
import * as xlsx from 'xlsx';

function Home({ data }) {
  return (
    <table>
      <tbody>
        {data.sort((a, b) => a.surname.localeCompare(b.surname)).map(member => (
          <tr key={member.id}>
            <th><Link to={`/member/${member.id}`}>{member.fullName}</Link></th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Member({ data }) {
  const id = parseInt(useParams().id, 10);
  const member = data.find(member => member.id === id);

  if (!member) {
    return <p>The requested member was not found.</p>;
  }

  return (
    <>
      <h1>{member.fullName}</h1>
      <table>
        <tbody>
          {member.competencies.map(({ name, code, date }, index) => (
            <tr key={index}>
              <th>{code}</th>
              <td>{name}</td>
              <td>{date.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('/data.csv');
      const buffer = await response.arrayBuffer();
      const workbook = xlsx.read(buffer, { cellDates: true });

      setLoading(false);

      const entries = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      const map = new Map();

      // Go through each UoC and create / append to the member data. Also rename keys.
      for (const entry of entries) {
        const id = parseInt(entry['Optional ID'], 10);

        if (!map.has(id)) {
          map.set(id, {
            id: entry['Optional ID'],
            surname: entry['Surname'],
            fullName: entry['Full Name'],
            competencies: [],
          });
        }

        map.get(id).competencies.push({
          code: entry['Unit of Competency Code'],
          name: entry['Unit of Competency Name'],
          date: entry['Activity End Date'],
        });
      }

      setData(Array.from(map.values()));
    })();
  }, []);

  if (loading) {
    return (
      <Spinner animation='border' />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Home data={data} />} />
        <Route path='/member/:id' element={<Member data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;
