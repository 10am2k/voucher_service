import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import NavBar from '../Home/Navbar';
import Axios from 'axios';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs,xx) {
  return { name, calories, fat, carbs,xx};
}

const rows = [
];

export default function ViewVoucher({admin,token,logout}) {
  const classes = useStyles();
  const [row, setrows] = useState('');
    Axios.post('api/user/getall', {})
        .then((res) => {
            for(var user of res.data)
            {
              if(user.voucher){
               for(var voucher of user.voucher){
              rows.push(createData(voucher.type, voucher.delivery,voucher.date,voucher.message,voucher.status))
              setrows(rows);
              console.log(voucher);
              }
            }
          }
        })
        .catch((err) => {
            
            console.error(err);
        })
    


  return (
    <div>
    <NavBar admin={admin} token={token} logout={logout} />
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Voucher Type</TableCell>
            <TableCell align="right">Delivery Type</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Comment</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">{row.xx}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
