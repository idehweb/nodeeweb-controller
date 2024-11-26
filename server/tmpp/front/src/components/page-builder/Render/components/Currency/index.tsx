import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import { getEntity } from '@/functions';
import Loading from '@/components/common/Loading';
import { fDateTime } from '@/helpers/date';

import { Row, Table, TableContainer } from './components';

export default function Currency() {
  const [DATA, setData] = useState({
    head: [],
    body: [],
    lastUpdate: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEntity('settings', 'get-exchange-rate')
      .then(({ items, lastUpdate }) => {
        const arr = items || [];
        // get first row as header row
        const head = [arr[0]] || [];
        arr.shift();
        const body = arr || [];

        setData({
          head,
          body,
          lastUpdate,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Row>
        <Typography variant="body2">آخرین بروزرسانی:</Typography>
        <Typography variant="caption" dir="ltr">
          {fDateTime(DATA.lastUpdate)}
        </Typography>
      </Row>
      <TableContainer>
        <Table>
          <thead>
            {DATA.head.map((i, idx) => (
              <tr key={idx}>
                <th>{i.currency}</th>
                <th> {i.price}</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {DATA.body.map((i, idx) => (
              <tr key={idx}>
                <td>{i.currency}</td>
                <td dir="ltr"> {i.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
