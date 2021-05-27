import React, { useState, useEffect,columns } from 'react';
import {NavLink, Redirect, withRouter} from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import Axios from 'axios';
import PropTypes from 'prop-types'
import NavBar from '../Home/Navbar'

import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import Alert from "../Alert/Alert";

import {
    Card,
    CardContent,
    Button,
    Typography,
    Divider,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Input,
    IconButton
} from '@material-ui/core'
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

//Below is from William
//To do: William only finished UI part
// Current can't read data from backend.
const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3),
        overflowX: "auto"
    },
    table: {
        minWidth: 650
    },
    selectTableCell: {
        width: 60
    },
    tableCell: {
        width: 130,
        height: 40
    },
    input: {
        width: 130,
        height: 40
    }
}));

const createData = (id,type, delivery, date, message, status) => ({
    // id: name.replace(" ", "_"),
    id,
    type,
    delivery,
    date,
    message,
    status,
    isEditMode: false
});

const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;
    return (
        <TableCell align="left" className={classes.tableCell}>
            {isEditMode ? (
                <Input
                    value={row[name]}
                    name={name}
                    onChange={e => onChange(e, row)}
                    className={classes.input}
                />
            ) : (
                row[name]
            )}
        </TableCell>
    );
};



function VoucherForm({ storeToken,token, user ,logout,history}) {
    const row=[];
    var count=0;
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'type', headerName: 'Service Type', width: 130 },
        { field: 'delivery', headerName: 'Delivery way', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'message', headerName: 'Message', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        
      ];
    const [rows, setRows] = React.useState(() => {

        var id=0
        var type = ""
        var delivery = ""
        var date= ""
        var message= ""
        var status=""

        if(user.voucher){
        for(var voucher of user.voucher){
            id+=1
            type=voucher.type;
            delivery=voucher.delivery;
            date=voucher.date;
            message=voucher.message;
            status=voucher.status;
            console.log(voucher.type)
            row.push(createData(id,type, delivery, date,message,status))
        }}
        count=id;
        
        return row


    });
    const [previous, setPrevious] = React.useState({});

    // const onfirstNameChange = (e) => {
    //     setBillerFirstName(e.target.value);
    // }
    // const onLastNameChange = (e) => {
    //     setBillerLastName(e.target.value);
    // }

    // const onEmailChange = (e) => {
    //     setBillerEmail(e.target.value);
    // }


    // //get the user's biller information
    
    const classes = useStyles();
    const [astatus, setStatusBase] = useState("");
    const onToggleEditMode = id => {
        setRows(state => {
            return rows.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: !row.isEditMode };
                }
                return row;
            });
        });
    };

    
    // Above is from William

    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-05-20T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    console.log(selectedDate);
    const [selectionModel, setSelectionModel] = React.useState([]);
    console.log(selectionModel[0])


    const [type, setType] = useState('');
    const [delivery, setDelivery] = useState('');
    const [comment, setComment] = useState('');

    const ontypeChange = (e) => {
        setType(e.target.value);
    }

    const onDeliveryChange = (e) => {
        setDelivery(e.target.value);
    }


    const onCommentChange = (e) => {
        setComment(e.target.value);
    }

    const handleClick = () => {
        Axios.post('api/user/addvoucher', {id:user._id, type: type, delivery: delivery, date: selectedDate, message: comment })
            .then((response) => {
                logout();
                storeToken.call(this, token);
                setStatusBase({ msg: "Adding voucher successfully", key: Math.random() });
                setTimeout(()=>{history.push('/')}, 1000);
                console.log(response);
            })
            .catch((error) =>{
              setStatusBase({ msg: "Adding voucher failed!", key: Math.random() });
                console.log(error);
            })
            setRows( row.push(createData(count+1,type, delivery, selectedDate,comment,"open")))
            window.location.reload();
    }

    const handleClick2 = () => {
        Axios.post('api/user/updatevoucher', {id:user._id,index:selectionModel[0] })
            .then((response) => {
                setStatusBase({ msg: "cancel voucher successfully", key: Math.random() });
                setTimeout(()=>{history.push('/')}, 1000);
                console.log(response);
            })
            .catch((error) =>{
              setStatusBase({ msg: "cancel voucher failed!", key: Math.random() });
                console.log(error);
            })
            
            
    }


    return (
        <div>
            <NavBar token={token} logout={logout}/>
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Create Voucher Booking
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <h3>Voucher Service Type:</h3>
                            <Grid item xs={12} >
                                <TextField
                                    // autoComplete="fname"
                                    name="type"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="type"
                                    label="type"
                                    // autoFocus
                                    onChange={ontypeChange}
                                />
                            </Grid>
                            <h3>Pick UP Way:</h3>
                            <Grid item xs={12} >
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="delivery"
                                    label="delivery"
                                    name="delivery"
                                    // autoComplete="lname"
                                    onChange={onDeliveryChange}
                                />
                            </Grid>
                            <h3>Date and Time:</h3>

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date picker dialog"
                                    format="MM/dd/yyyy"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Time picker"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </Grid>
                            </MuiPickersUtilsProvider>
                            <Grid item xs={12}>
                            <h3>optional message:</h3>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    // required
                                    fullWidth
                                    name="message"
                                    label="message"
                                    id="message"
                                    onChange={onCommentChange}
                                />
                            </Grid>

                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"

                            onClick={handleClick}
                        >
                            ADD
                        </Button>
                    </form>

                    
                    



                                                
                </CardContent>
               
                {astatus ? <Alert key={astatus.key} message={astatus.msg} /> : null}
            </Card>
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection onSelectionModelChange={(newSelection) => {
                                                                                        setSelectionModel(newSelection.selectionModel);
                                                                            }}
                                                                                selectionModel={selectionModel}
                                                                                {...rows}/>
            <Button
                            fullWidth
                            variant="contained"
                            color="primary"

                            onClick={handleClick2}
                        >
                            Cancel
                        </Button>
            </div>
        </div>
    )





}

export default withRouter(VoucherForm);
