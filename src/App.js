import { analyse } from './qualifications';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { BookFill, CheckLg, ClockFill, PersonFill, Question, XLg } from 'react-bootstrap-icons';
import { BrowserRouter as Router, Link, Route, Routes, useParams } from 'react-router-dom';
import * as xlsx from 'xlsx';
import clsx from 'clsx';

function Home({ data }) {
  const statusClass = (status) => clsx({
    'bg-success': status === 'YES',
    'bg-warning': status === 'EXPIRED',
    'bg-danger': status === 'NO',
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>First Aid</th>
        </tr>
      </thead>
      <tbody>
        {data.sort((a, b) => a.surname.localeCompare(b.surname)).map(({ id, fullName, status }) => (
          <tr key={id}>
            <th><Link to={`/member/${id}`}>{fullName}</Link></th>
            <td className={statusClass(status.firstAid)}></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function StatusBadge({ status }) {
  switch (status) {
    case 'YES':
      return <Badge bg='success'><BookFill /></Badge>
    case 'EXPIRED':
      return <Badge bg='warning'><BookFill /></Badge>
    case 'NO':
      return <Badge bg='danger'><BookFill /> </Badge>
    default:
      return <Badge bg='secondary'><BookFill /></Badge>
  }
}

function Member({ data }) {
  const id = parseInt(useParams().id, 10);
  const member = data.find(member => member.id === id);

  if (!member) {
    return <p>The requested member was not found.</p>;
  }

  const { status } = member;

  return (
    <>
      <h1>{member.fullName}</h1>

      <h2>Field Operator Pathway</h2>

      <div className="pathway mb-1">
        <div className="pathway-title">Leadership</div>
        <table className="table">
          <tbody>
          <tr>
              <td className="leadership status">Field Team Leader</td>
            </tr>
            <tr>
              <td className="leadership">Field Team Leader Course</td>
            </tr>
            <tr>
              <td className="foundation d-flex justify-content-between">
                <div>Required for all pathways above:</div>
                <div>Be a Field Operator</div>
                <div>Leadership Fundamentals Course</div>
                <div>Diversity and Inclusion Course</div>
                <div>Emergency Management Program</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="technical-pathway" className="pathway mb-1">
        <div className="pathway-title">Technical</div>
        <table className="table">
          <tbody>
          <tr>
              <td className="storm status">Storm Heights Operator</td>
              <td className="storm status">Chainsaw Operator Level 2</td>
              <td className="flood status">Flood Rescue In-Water Operator</td>
              <td className="flood status">Flood Rescue On-Water Operator</td>
              <td rowSpan={2}></td>
              <td colSpan={2} className="rescue status">General Land Rescue Operator</td>
              <td rowSpan={2}></td>
              <td className="search status">Alpine Search abd Rescue Operator</td>
              <td className="search status">Bush Search and Rescue Operator</td>
              <td colSpan={3} rowSpan={4}></td>
            </tr>
            <tr>
              <td className="storm">Storm Heights Course</td>
              <td className="storm">Chainsaw Intermediate Felling Course</td>
              <td className="flood">Flood Rescue In-Water Course</td>
              <td className="flood">Flood Boat Operations Course</td>
              <td className="rescue">Industrial and Domestic Rescue Course</td>
              <td rowSpan={3} className="rescue status">Urban Search and Rescue Operator</td>
              <td className="search">Alpine Search Course</td>
              <td className="search">Bush Search and Rescue Course</td>
            </tr>
            <tr>
              <td rowSpan={2} className="storm status">Storm Ground Operator</td>
              <td rowSpan={2} className="storm status">Chainsaw Operator Level 1</td>
              <td rowSpan={2} colSpan={2} className="flood">Flood Rescue Land-Based Operator</td>
              <td rowSpan={2} className="rescue status">Large Animal Rescue Operator</td>
              <td rowSpan={2} className="rescue status">Road Crash Rescue Operator</td>
              <td rowSpan={2} className="rescue status">Vertical Rescue Operator</td>
              <td colSpan={2} className="search status">Advanced Land Search (Rugged Terrain) Operator</td>
            </tr>
            <tr>
              <td className="search">Land Search Advanced Course</td>
              <td className="search">Map and Nav Course</td>
            </tr>
            <tr>
              <td rowSpan={3} className="storm">Storm Ground Course</td>
              <td rowSpan={2} className="storm">Chainsaw Cross Cut Course</td>
              <td rowSpan={2} colSpan={2} className="flood">Flood Rescue Land-Based Course</td>
              <td rowSpan={2} className="rescue">Large Animal Rescue Course</td>
              <td rowSpan={2} className="rescue">Road Crash Rescue Course</td>
              <td rowSpan={2} className="rescue">Urban Search and Rescue Course</td>
              <td rowSpan={2} className="rescue">Vertical Rescue Course</td>
              <td colSpan={2} className="search status">Land Search (Open Terrain) Operator</td>
              <td rowSpan={2} className="support status">Community First Responder</td>
              <td rowSpan={2} className="support status">Boat Operator</td>
              <td rowSpan={2} className="support status">Community Engagement Officer</td>
            </tr>
            <tr>
              <td className="search">Land Search Course</td>
              <td className="search">Map and Nav Course (recommended)</td>
            </tr>
            <tr>
              <td className="storm">Storm Ground Course <u>or</u> PIARO Course <u>or</u> Land Search Course</td>
              <td colSpan={6} className="rescue piaro">Participate in a Rescue Operation (PIARO) Course</td>
              <td colspan={2} className="search status">Land Search Suburban (All Job Ready members)</td>
              <td className="support">Certificate II in Medical Service First Response</td>
              <td className="support">Flood Boat Operations Course</td>
              <td className="support">Community Engagement Officer Course</td>
            </tr>
            <tr>
              <td colSpan={2} className="storm">Storm</td>
              <td colSpan={2} className="flood">Flood Rescue</td>
              <td colSpan={4} className="rescue">Land Rescue</td>
              <td colSpan={2} className="search">Land Search</td>
              <td colSpan={3} className="support">Support</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="pathway mb-3">
        <div className="pathway-title">Foundation</div>
        <table className="table">
          <tbody>
            <tr>
              <td className="foundation d-flex justify-content-between">
                <div>Required for all pathways above:</div>
                <div>First Aid</div>
                <div>Operate Communications Equipment</div>
                <div>Beacon Field</div>
                <div>Intro to AIIMS</div>
                <div>Field Core Skills (except Community Engagement)</div>
                <div>Tsunami Awareness (recommended)</div>
              </td>
            </tr>
            <tr>
              <td className="foundation status">Job Ready</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Qualifications</h2>
      <table className="table">
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
        // Same detail with external courses which are imported as CTSCOPE - great.
        let code = entry['Qualification Code'];
        let name = entry['Qualification Name'];

        if (code === 'Imported' || code === 'CTSCOPE') {
          code = entry['Unit of Competency Code'];
          name = entry['Unit of Competency Name'];
        }

        // For some reason half the dates are Excel style dates (which are parsed into Dates OK),
        // and half are dd/mm/yyy dates which is great. Fix this up.
        let date = entry['Activity End Date'];

        if (typeof date === 'string') {
          date = moment(date, 'DD/MM/YYYY');
        }

        const member = map.get(id).qualifications.push({ code, name, date });
      }

      const members = Array.from(map.values());

      // Go through and perform the analysis for each member.
      for (let member of members) {
        member.status = analyse(member.qualifications);
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
