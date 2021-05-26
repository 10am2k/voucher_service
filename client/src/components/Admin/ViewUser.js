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

function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs};
}

const rows = [
];

export default function ViewUser({admin,token,logout}) {
  const classes = useStyles();
  const [row, setrows] = useState('');
    Axios.post('api/user/getall', {})
        .then((res) => {
            console.log(res.data)
            for(var user of res.data)
            {
              rows.push(createData(user.email, user.firstName, user.lastName,user.phoneNumber))
              setrows(rows);
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
            <TableCell>Email</TableCell>
            <TableCell align="right">Lastname</TableCell>
            <TableCell align="right">Firstname</TableCell>
            <TableCell align="right">Photo Number</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
