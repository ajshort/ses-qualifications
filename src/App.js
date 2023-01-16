import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { BookFill, CheckLg, ClockFill, PersonFill, XLg } from 'react-bootstrap-icons';
import { BrowserRouter as Router, Link, Route, Routes, useParams } from 'react-router-dom';
import * as xlsx from 'xlsx';

/**
 * This analyses a member's qualification to give operator status.
 */
function analyse(qualifications) {
  const or = (...args) => {
    if (args.some(x => x === 'YES')) {
      return 'YES';
    }
    if (args.some(x => x === 'EXPIRED')) {
      return 'EXPIRED';
    }
    return 'NO';
  };

  const and = (...args) => {
    if (args.every(x => x === 'YES')) {
      return 'YES';
    }
    if (args.every(x => x === 'YES' || x === 'EXPIRED')) {
      return 'EXPIRED';
    }
    return 'NO';
  };

  const current = (code, years) => {
    const qual = qualifications.find(q => q.code === code);
    if (qual === undefined) {
      return 'NO';
    }
    if (moment(qual.date).add(years, 'years').isBefore()) {
      return 'EXPIRED';
    }
    return 'YES';
  };

  const exists = (code) => qualifications.find(q => q.code === code) !== undefined ? 'YES' : 'NO';

  const firstAid = or(current('HLTAID011', 3), current('HLTAID003', 3));
  const operateCommsEquipment = or(exists('PUAOPE013A'), exists('CEC001'), exists('CEC002'), exists('CEC003'), exists('CEC004'));
  const introToAiims = or(exists('AIP001'), exists('AIP002'), exists('AIP003'));
  const beaconField = or(exists('BEF001'), exists('BEF002'), exists('BEA001'), exists('BEA002'));
  const fieldCoreSkills = 'YES'; // TODO need to figure out what is equivalent to this.

  const fieldFoundationCommEng = and(firstAid, operateCommsEquipment, beaconField, introToAiims);
  const fieldFoundation = and(fieldFoundationCommEng, fieldFoundationCommEng);

  return {
    firstAid,
    introToAiims,
    operateCommsEquipment,
    beaconField,
    fieldCoreSkills,
    fieldFoundation,

    // These don't interact with anything further - we can just look them up directly.
    tsunamiAwareness: exists('TSU002'),
  };
}

function Home({ data }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Field Foundation</th>
        </tr>
      </thead>
      <tbody>
        {data.sort((a, b) => a.surname.localeCompare(b.surname)).map(({ id, fullName, status }) => (
          <tr key={id}>
            <th><Link to={`/member/${id}`}>{fullName}</Link></th>
            <td className={clsx({
              'bg-success': status.fieldFoundation === 'YES',
              'bg-warning': status.fieldFoundation === 'EXPIRED',
              'bg-danger': status.fieldFoundation === 'NO',
            })}></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function StatusBadge({ status }) {
  switch (status) {
    case 'YES':
      return <Badge bg='success'><CheckLg /></Badge>
    case 'EXPIRED':
      return <Badge bg='warning'><ClockFill /></Badge>
    default:
      return <Badge bg='danger'><XLg /> </Badge>
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
      <div className="pathway">
        <div className="pathway-title">Foundation</div>
        <table className="table">
          <tbody>
            <tr>
              <td className="foundation d-flex justify-content-between">
                <div>Required for all pathways above:</div>
                <div><BookFill /> First Aid <StatusBadge status={status.firstAid} /></div>
                <div><BookFill /> Operate Communications Equipment <StatusBadge status={status.operateCommsEquipment} /></div>
                <div><BookFill /> Beacon Field <StatusBadge status={status.beaconField} /></div>
                <div><BookFill /> Intro to AIIMS <StatusBadge status={status.introToAiims} /></div>
                <div><BookFill /> Field Core Skills (except Community Engagement)</div>
                <div><BookFill /> Tsunami Awareness (recommended) <StatusBadge status={status.tsunamiAwareness} /></div>
              </td>
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
