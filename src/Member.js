import clsx from 'clsx';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHourglassEnd, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

function StatusIcon({ status, children }) {
  if (status === 'CURRENT') {
    return <><FontAwesomeIcon icon={faCheck} /> {children}</>;
  } else if (status === 'EXPIRED') {
    return <><FontAwesomeIcon icon={faHourglassEnd} /> <span className='text-decoration-line-through'>{children}</span></>;
  } else {
    return <><FontAwesomeIcon icon={faXmark} /> <span className='text-decoration-line-through'>{children}</span></>;
  }
}

function Member({ data }) {
  const id = parseInt(useParams().id, 10);
  const member = data.find(member => member.id === id);

  if (!member) {
    return <p>The requested member was not found.</p>;
  }

  const { fullName, qualifications, status: { courses, operator } } = member;

  const statusClass = status => {
    switch (status) {
      case 'CURRENT':
        return 'achieved';
      case 'EXPIRED':
        return 'expired';
      case 'NONE':
      default:
        return 'unachieved';
    }
  };

  // Add date information to the qualifications (max of any of the competencies).
  const datedQualifications = [...qualifications]
    .map(qualification => (
      { ...qualification, date: new Date(Math.max(...qualification.competencies.map(competency => competency.date))) }
    ))
    .sort((a, b) => b.date - a.date);

  return (
    <Container fluid>
      <h1>{fullName}</h1>

      <h2>Field Operator Pathway</h2>

      <div className='pathway mb-1'>
        <div className='pathway-title'>Leadership</div>
        <table className='table'>
          <tbody>
          <tr>
              <td className={clsx('leadership', 'status', statusClass(operator.fieldTeamLeader))}>Field Team Leader</td>
            </tr>
            <tr>
              <td className={clsx('leadership', statusClass(courses.fieldTeamLeader))}>Field Team Leader Course</td>
            </tr>
            <tr>
              <td className='foundation'>
                <div className='d-flex justify-content-between'>
                  <div>Required for all pathways above:</div>
                  <div><FontAwesomeIcon icon={faUser} /> Be a Field Operator</div>
                  <div><StatusIcon status={courses.leadershipFundamentals}>Leadership Fundamentals Course</StatusIcon></div>
                  <div><StatusIcon status={courses.diversityAndInclusion}>Diversity and Inclusion Course</StatusIcon></div>
                  <div><StatusIcon status={courses.emergencyManagement}>Emergency Management Program</StatusIcon></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id='technical-pathway' className='pathway mb-1'>
        <div className='pathway-title'>Technical</div>
        <table className='table table-responsive'>
          <tbody>
            <tr>
              <td className={clsx('storm', 'status', statusClass(operator.stormHeights))}>Storm Heights Operator</td>
              <td className={clsx('storm', 'status', statusClass(operator.chainsawL2))}>Chainsaw Operator Level 2</td>
              <td  className={clsx('flood', 'status', statusClass(operator.inWater))}>Flood Rescue In-Water Operator</td>
              <td className={clsx('flood', 'status', statusClass(operator.onWater))}>Flood Rescue On-Water Operator</td>
              <td rowSpan={2}></td>
              <td colSpan={2} className={clsx('rescue', 'status', statusClass(operator.generalLandRescue))}>General Land Rescue Operator</td>
              <td rowSpan={2}></td>
              <td className={clsx('search', 'status', statusClass(operator.alpineSearch))}>Alpine Search and Rescue Operator</td>
              <td className={clsx('search', 'status', statusClass(operator.bushSearch))}>Bush Search and Rescue Operator</td>
              <td colSpan={3} rowSpan={4}></td>
            </tr>
            <tr>
              <td className={clsx('storm', statusClass(courses.stormHeights))}>Storm Heights Course</td>
              <td className={clsx('storm', statusClass(courses.chainsawFelling))}>Chainsaw Intermediate Felling Course</td>
              <td className={clsx('flood', statusClass(courses.inWater))}>Flood Rescue In-Water Course</td>
              <td className={clsx('flood', statusClass(courses.floodBoat))}>Flood Boat Operations Course</td>
              <td className={clsx('rescue', statusClass(courses.industrialDomesticRescue))}>Industrial and Domestic Rescue Course</td>
              <td rowSpan={3} className={clsx('rescue', 'status', statusClass(operator.urbanSearchRescue))}>Urban Search and Rescue Operator</td>
              <td className={clsx('search', statusClass(courses.alpineSearch))}>Alpine Search Course</td>
              <td className={clsx('search', statusClass(courses.bushSearch))}>Bush Search and Rescue Course</td>
            </tr>
            <tr>
              <td rowSpan={2} className={clsx('storm', 'status', statusClass(operator.stormGround))}>Storm Ground Operator</td>
              <td rowSpan={2} className={clsx('storm', 'status', statusClass(operator.chainsawL1))}>Chainsaw Operator Level 1</td>
              <td rowSpan={2} colSpan={2} className={clsx('flood', 'status', statusClass(operator.landBased))}>Flood Rescue Land-Based Operator</td>
              <td rowSpan={2} className={clsx('rescue', 'status', statusClass(operator.largeAnimalRescue))}>Large Animal Rescue Operator</td>
              <td rowSpan={2} className={clsx('rescue', 'status', statusClass(operator.roadCrashRescue))}>Road Crash Rescue Operator</td>
              <td rowSpan={2} className={clsx('rescue', 'status', statusClass(operator.verticalRescue))}>Vertical Rescue Operator</td>
              <td colSpan={2} className={clsx('search', 'status', statusClass(operator.landSearchAdvanced))}>Advanced Land Search (Rugged Terrain) Operator</td>
            </tr>
            <tr>
              <td className={clsx('search', statusClass(courses.landSearchAdvanced))}>Land Search Advanced Course</td>
              <td className={clsx('search', statusClass(courses.mapAndNav))}>Map and Nav Course</td>
            </tr>
            <tr>
              <td rowSpan={3} className={clsx('storm', statusClass(courses.stormGround))}>Storm Ground Course</td>
              <td rowSpan={2} className={clsx('storm', statusClass(courses.chainsawCrossCut))}>Chainsaw Cross Cut Course</td>
              <td rowSpan={2} colSpan={2} className={clsx('flood', statusClass(courses.landBased))}>Flood Rescue Land-Based Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.largeAnimalRescue))}>Large Animal Rescue Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.roadCrashRescue))}>Road Crash Rescue Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.urbanSearchRescue))}>Urban Search and Rescue Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.verticalRescue))}>Vertical Rescue Course</td>
              <td colSpan={2} className={clsx('search', 'status', statusClass(operator.landSearchOpen))}>Land Search (Open Terrain) Operator</td>
              <td rowSpan={2} className={clsx('support', 'status', statusClass(operator.cfr))}>Community First Responder</td>
              <td rowSpan={2} className={clsx('support', 'status', statusClass(operator.boat))}>Boat Operator</td>
              <td rowSpan={2} className={clsx('support', 'status', statusClass(operator.communityEngagement))}>Community Engagement Officer</td>
            </tr>
            <tr>
              <td className={clsx('search', statusClass(courses.landSearch))}>Land Search Course</td>
              <td className={clsx('search', statusClass(courses.mapAndNav))}>Map and Nav Course (recommended)</td>
            </tr>
            <tr>
              <td className={clsx('storm', statusClass(courses.stormGroundOrPiaroOrLandSearch))}>Storm Ground Course <u>or</u> PIARO Course <u>or</u> Land Search Course</td>
              <td colSpan={6} className={clsx('rescue', 'piaro', statusClass(courses.piaro))}>Participate in a Rescue Operation (PIARO) Course</td>
              <td colSpan={2} className={clsx('search', 'status', statusClass(operator.landSearchSuburban))}>Land Search Suburban (All Job Ready members)</td>
              <td className={clsx('support', statusClass(courses.medicalResponse))}>Certificate II in Medical Service First Response</td>
              <td className={clsx('support', statusClass(courses.floodBoat))}>Flood Boat Operations Course</td>
              <td className={clsx('support', statusClass(courses.communityEngagement))}>Community Engagement Officer Course</td>
            </tr>
            <tr>
              <td colSpan={2} className='storm'>Storm</td>
              <td colSpan={2} className='flood'>Flood Rescue</td>
              <td colSpan={4} className='rescue'>Land Rescue</td>
              <td colSpan={2} className='search'>Land Search</td>
              <td colSpan={3} className='support'>Support</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='pathway mb-3'>
        <div className='pathway-title'>Foundation</div>
        <table className='table'>
          <tbody>
            <tr>
              <td className='foundation'>
                <div className='d-flex justify-content-between'>
                  <div><StatusIcon status={operator.foundation}>Required for all pathways above:</StatusIcon></div>
                  <div><StatusIcon status={courses.firstAid}>First Aid</StatusIcon></div>
                  <div><StatusIcon status={courses.operateCommsEquipment}>Operate Communications Equipment</StatusIcon></div>
                  <div><StatusIcon status={courses.beaconField}>Beacon Field</StatusIcon></div>
                  <div><StatusIcon status={courses.introAiims}>Intro to AIIMS</StatusIcon></div>
                  <div><StatusIcon status={courses.fieldCoreSkills}>Field Core Skills (except Community Engagement)</StatusIcon></div>
                  <div><StatusIcon status={courses.tsunamiAwareness}>Tsunami Awareness (recommended)</StatusIcon></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className='foundation status'>
                <div className='d-flex justify-content-between'>
                  <div><StatusIcon status={operator.jobReady}>Job Ready</StatusIcon></div>
                  <div><StatusIcon status={courses.beaconFamiliar}>Beacon Familiarisation</StatusIcon></div>
                  <div><StatusIcon status={courses.codeOfConduct}>Code of Conduct</StatusIcon></div>
                  <div><StatusIcon status={courses.jobReadyInduction}>Job Ready Induction</StatusIcon></div>
                  <div><StatusIcon status={courses.floodRescueAwareness}>Flood Rescue Awareness</StatusIcon></div>
                  <div><StatusIcon status={courses.jobReadyWorkshop}>Job Ready Workshop</StatusIcon></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Qualifications</h2>

      <Table table small>
        <thead className='table-light'>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {datedQualifications.map(({ code, name, competencies, date }) => (
            <>
              <tr>
                <th>{code}</th>
                <td>{name}</td>
                <td>{moment(date).format('DD/MM/YYYY')}</td>
              </tr>
              {competencies.length > 0 && (
                <tr>
                  <td colSpan={3}>
                    <ul className='list-unstyled mb-0 text-muted'>
                      {competencies.sort((a, b) => b.date - a.date).map(({ code, name, date }) => (
                        <li>
                          {code} - {name} {moment(date).format('DD/MM/YYYY')}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Member;
