import React from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHourglassEnd, faXmark } from '@fortawesome/free-solid-svg-icons';

function StatusCell({ status }) {
  let icon;

  if (status === 'YES') {
    icon = <FontAwesomeIcon icon={faCheck} />;
  } else if (status === 'EXPIRED') {
    icon = <FontAwesomeIcon icon={faHourglassEnd} />
  } else {
    icon = <span className="text-danger"><FontAwesomeIcon icon={faXmark} /></span>;
  }

  return (
    <td>
      {icon}
    </td>
  );
}

function Home({ data }) {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Job Ready</th>
          <th>Foundation</th>
          <th>Storm Ground</th>
          <th>Storm Heights</th>
          <th>Chainsaw L1</th>
          <th>Chainsaw L2</th>
          <th>Land Based</th>
          <th>On Water</th>
          <th>In Water</th>
          <th>USAR</th>
          <th>VR</th>
          <th>Land Search (Open)</th>
          <th>Land Search (Rugged)</th>
        </tr>
      </thead>
      <tbody>
        {data.sort((a, b) => a.surname.localeCompare(b.surname)).map(({ id, fullName, status: { operator } }) => (
          <tr key={id}>
            <th><Link to={`/member/${id}`}>{fullName}</Link></th>
            <StatusCell status={operator.jobReady} />
            <StatusCell status={operator.foundation} />
            <StatusCell status={operator.stormGround} />
            <StatusCell status={operator.stormHeights} />
            <StatusCell status={operator.chainsawL1} />
            <StatusCell status={operator.chainsawL2} />
            <StatusCell status={operator.landBased} />
            <StatusCell status={operator.onWater} />
            <StatusCell status={operator.inWater} />
            <StatusCell status={operator.usar} />
            <StatusCell status={operator.verticalRescue} />
            <StatusCell status={operator.landSearchOpen} />
            <StatusCell status={operator.landSearchRugged} />
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Home;
