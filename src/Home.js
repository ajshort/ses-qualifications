import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

function Home({ data }) {
  const [name, setName] = useState('');

  const present = data
      .filter(member => {
        if (name?.length > 0) {
          if (!member.fullName.toLowerCase().includes(name.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => a.surname.localeCompare(b.surname));

  return (
    <>
      <Container fluid className='py-3 border-bottom'>
        <Form.Control type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
      </Container>
      <Container fluid className='py-3'>
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {present.map(({ id, fullName, status: { operator } }) => (
              <tr key={id}>
                <th><Link to={`/member/${id}`}>{fullName}</Link></th>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Home;
