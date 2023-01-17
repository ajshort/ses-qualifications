import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';

function Member({ data }) {
  const id = parseInt(useParams().id, 10);
  const member = data.find(member => member.id === id);

  if (!member) {
    return <p>The requested member was not found.</p>;
  }

  const { fullName, qualifications, status: { courses, operator } } = member;

  const statusClass = status => {
    switch (status) {
      case 'YES':
        return 'achieved';
      case 'EXPIRED':
        return 'expired';
      case 'NO':
      default:
        return 'unachieved';
    }
  };

  return (
    <>
      <h1>{fullName}</h1>

      <h2>Field Operator Pathway</h2>

      <div className="pathway mb-1">
        <div className="pathway-title">Leadership</div>
        <table className="table">
          <tbody>
          <tr>
              <td className={clsx('leadership', 'status', statusClass(operator.fieldTeamLeader))}>Field Team Leader</td>
            </tr>
            <tr>
              <td className={clsx('leadership', statusClass(courses.fieldTeamLeader))}>Field Team Leader Course</td>
            </tr>
            <tr>
              <td className="foundation">
                <div className="d-flex justify-content-between">
                  <div>Required for all pathways above:</div>
                  <div>Be a Field Operator</div>
                  <div>Leadership Fundamentals Course</div>
                  <div>Diversity and Inclusion Course</div>
                  <div>Emergency Management Program</div>
                </div>
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
              <td className={clsx('storm', 'status', statusClass(operator.stormHeights))}>Storm Heights Operator</td>
              <td className={clsx('storm', 'status', statusClass(operator.chainsawL2))}>Chainsaw Operator Level 2</td>
              <td  className={clsx('flood', 'status', statusClass(operator.onWater))}>Flood Rescue In-Water Operator</td>
              <td className={clsx('flood', 'status', statusClass(operator.inWater))}>Flood Rescue On-Water Operator</td>
              <td rowSpan={2}></td>
              <td colSpan={2} className={clsx('rescue', 'status', statusClass(operator.glr))}>General Land Rescue Operator</td>
              <td rowSpan={2}></td>
              <td className={clsx('search', 'status', statusClass(operator.alpineSearch))}>Alpine Search abd Rescue Operator</td>
              <td className={clsx('search', 'status', statusClass(operator.bushSearch))}>Bush Search and Rescue Operator</td>
              <td colSpan={3} rowSpan={4}></td>
            </tr>
            <tr>
              <td className={clsx('storm', statusClass(courses.stormHeights))}>Storm Heights Course</td>
              <td className={clsx('storm', statusClass(courses.chainsawFelling))}>Chainsaw Intermediate Felling Course</td>
              <td className={clsx('flood', statusClass(courses.inWater))}>Flood Rescue In-Water Course</td>
              <td className={clsx('flood', statusClass(courses.floodBoat))}>Flood Boat Operations Course</td>
              <td className={clsx('rescue', statusClass(courses.idr))}>Industrial and Domestic Rescue Course</td>
              <td rowSpan={3} className={clsx('rescue', 'status', statusClass(operator.usar))}>Urban Search and Rescue Operator</td>
              <td className={clsx('search', statusClass(courses.alpineSearch))}>Alpine Search Course</td>
              <td className={clsx('search', statusClass(courses.bushSearch))}>Bush Search and Rescue Course</td>
            </tr>
            <tr>
              <td rowSpan={2} className={clsx('storm', 'status', statusClass(operator.stormGround))}>Storm Ground Operator</td>
              <td rowSpan={2} className={clsx('storm', 'status', statusClass(operator.chainsawL1))}>Chainsaw Operator Level 1</td>
              <td rowSpan={2} colSpan={2} className={clsx('flood', 'status', statusClass(operator.landBased))}>Flood Rescue Land-Based Operator</td>
              <td rowSpan={2} className={clsx('rescue', 'status', statusClass(operator.lar))}>Large Animal Rescue Operator</td>
              <td rowSpan={2} className={clsx('rescue', 'status', statusClass(operator.rcr))}>Road Crash Rescue Operator</td>
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
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.lar))}>Large Animal Rescue Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.rcr))}>Road Crash Rescue Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.usar))}>Urban Search and Rescue Course</td>
              <td rowSpan={2} className={clsx('rescue', statusClass(courses.verticalRescue))}>Vertical Rescue Course</td>
              <td colSpan={2} className={clsx('search', 'status', statusClass(operator.landSearchOpen))}>Land Search (Open Terrain) Operator</td>
              <td rowSpan={2} className={clsx('support', 'status', statusClass(operator.cfr))}>Community First Responder</td>
              <td rowSpan={2} className={clsx('support', 'status', statusClass(operator.boat))}>Boat Operator</td>
              <td rowSpan={2} className={clsx('support', 'status', statusClass(operator.commEng))}>Community Engagement Officer</td>
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
              <td className={clsx('support', statusClass(courses.commEng))}>Community Engagement Officer Course</td>
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
              <td className="foundation">
                <div className="d-flex justify-content-between">
                  <div>Required for all pathways above:</div>
                  <div>First Aid</div>
                  <div>Operate Communications Equipment</div>
                  <div>Beacon Field</div>
                  <div>Intro to AIIMS</div>
                  <div>Field Core Skills (except Community Engagement)</div>
                  <div>Tsunami Awareness (recommended)</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="foundation status">
                <div className="d-flex justify-content-between">
                  <div>Job Ready</div>
                  <div>Beacon Familiarisation</div>
                  <div>Code of Conduct</div>
                  <div>Job Ready Induction</div>
                  <div>Flood Rescue Awareness</div>
                  <div>Job Ready Workshop</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Qualifications</h2>

      <ul>
        {qualifications.map(({ code, name, competencies }) => (
          <li key={code}>
            <strong>{code}</strong> {name}
            {competencies.length > 0 && (
              <ul>
                {competencies.map(({ name, code, date }, index) => (
                  <li key={index}><strong>{code}</strong> {name} {moment(date).format('DD/MM/YYYY')}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Member;
