import Home from './Home';
import Member from './Member';
import { analyse } from './qualifications';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';
import { HeadProvider } from 'react-head';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import * as xlsx from 'xlsx';

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
            codes: new Map(),
          });
        }

        // For some reason half the dates are Excel style dates (which are parsed into Dates OK),
        // and half are dd/mm/yyy dates. Fix this up.
        let date = entry['Activity End Date'];

        if (typeof date === 'string') {
          date = moment(date, 'DD/MM/YYYY');
        }

        // Create or insert the competency into the appropriate qualification.
        const { qualifications, codes } = map.get(id);
        const index = qualifications.findIndex(q => q.code === entry['Qualification Code']);
        const competency = { code: entry['Unit of Competency Code'], name: entry['Unit of Competency Name'], date };

        if (index === -1) {
          qualifications.push({
            code: entry['Qualification Code'],
            name: entry['Qualification Name'],
            competencies: [competency],
          });
        } else {
          qualifications[index].competencies.push(competency);
        }

        // Add both qualification and competency code to the map, keeping the latest date if it's
        // already there.
        const add = (code) => {
          const existing = codes.get(code);

          if (existing !== undefined) {
            codes.set(code, Math.max(existing, date));
          } else {
            codes.set(code, date);
          }
        };

        add(entry['Qualification Code']);
        add(entry['Unit of Competency Code']);
      }

      const members = Array.from(map.values());

      // Go through and perform the analysis for each member.
      for (let member of members) {
        member.status = analyse(member.codes);
      }

      setData(members);
    })();
  }, []);

  if (loading) {
    return (
      <Spinner animation='border' />
    );
  }

  return (
    <Router>
    <HeadProvider>
      <Navbar bg='dark' variant='dark'>
        <Container fluid>
          <LinkContainer to='/'>
            <Navbar.Brand>SES Qualifications</Navbar.Brand>
          </LinkContainer>
        </Container>
      </Navbar>
      <Container fluid>
        <Routes>
          <Route path='/' exact element={<Home data={data} />} />
          <Route path='/member/:id' element={<Member data={data} />} />
        </Routes>
      </Container>
    </HeadProvider>
    </Router>
  );
}

export default App;
