import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { Book, Person } from 'react-bootstrap-icons';
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

      <h2>Qualifications</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {member.qualifications.sort((a, b) => b.date - a.date).map(({ name, code, date }, index) => (
            <tr key={index}>
              <th>{code}</th>
              <td>{name}</td>
              <td>{moment(date).format('DD/MM/YYYY')}</td>
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
            qualifications: [],
          });
        }

        // Try and use the qualification if we can. A lot of the imported programs from SAP are
        // called "Imported Program" - if this is the case treat the competency as a qualification.
        let code = entry['Qualification Code'];
        let name = entry['Qualification Name'];

        if (code === 'Imported') {
          code = entry['Unit of Competency Code'];
          name = entry['Unit of Competency Name'];
        }

        // For some reason half the dates are Excel style dates (which are parsed into Dates OK),
        // and half are dd/mm/yyy dates which is great. Fix this up.
        let date = entry['Activity End Date'];

        if (typeof date === 'string') {
          date = moment(date, 'DD/MM/YYYY');
        }

        // If we already have a qualification, update to use the latest date rather than
        // duplicating.
        const member = map.get(id);
        const existing = member.qualifications.findIndex(qualification => qualification.code === code);

        if (existing !== -1) {
          if (date > member.qualifications[existing].date) {
            member.qualifications[existing].date = date;
          }
        } else {
          member.qualifications.push({ code, name, date });
        }
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
    <Container fluid>
      <Router>
        <Routes>
          <Route path='/' exact element={<Home data={data} />} />
          <Route path='/member/:id' element={<Member data={data} />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
