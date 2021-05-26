import React, { useState, useEffect } from 'react';
import {NavLink, Redirect, withRouter} from 'react-router-dom';

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

const createData = (type, delivery, date, message, status) => ({
    // id: name.replace(" ", "_"),
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



function VoucherForm({ token, user ,logout,history}) {



    const [rows, setRows] = React.useState(() => {

        var type = ""
        var delivery = ""
        var date= ""
        var message= ""
        var status=""
        if(user.voucher){
        for(var voucher of user.voucher){
            type=voucher.type;
            delivery=voucher.delivery;
            date=voucher.date;
            message=voucher.message;
            status=voucher.status;
            console.log(voucher.type)
            
        }}


        return [createData(type, delivery, date,message,status)]


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
    useEffect(() => {


        var type = ""
        var delivery = ""
        var date= ""
        var comment= ""
        var status=""
        if(user.voucher){
        for(var voucher of user.voucher){
            type=voucher.type;
            delivery=voucher.delivery;
            date=voucher.date;
            comment=voucher.comment;
            status=voucher.status;
            console.log(voucher.type)
            setRows([createData(type, delivery, date,comment,status)])
        }

    }

    }, [user.firstName]);


    const onSubmit = () => {
        var billerFirstName = rows[0].name;
        var billerLastName = rows[0].lastName;
        var billerEmail = rows[0].email;
        const id = user._id;
        const payload = { id, billerFirstName, billerLastName, billerEmail };
        console.log("payload:", payload);
        setRows([createData(billerFirstName, billerLastName, billerEmail)])
        window.location.reload();
    }


    // Below is from William

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

    const onChange = (e, row) => {
        if (!previous[row.id]) {
            setPrevious(state => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [name]: value };
            }
            return row;
        });
        setRows(newRows);
    };

    const onRevert = id => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                return previous[id] ? previous[id] : row;
            }
            return row;
        });
        setRows(newRows);
        console.log("???")
        Axios.post('api/user/updatevoucher', {id:user._id})
            .then((res) => {
                setStatusBase({ msg: "Update biller info successfully!", key: Math.random() });
                setTimeout(()=>{history.push('/')}, 1500);
            })
            .catch((err) => {
               
                console.error(err);
            })
        setPrevious(state => {
            delete state[id];
            return state;
        });
        onToggleEditMode(id);
    };
    // Above is from William

    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-05-20T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    console.log(selectedDate);



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
        Axios.post('api/user/addvoucher', {id:user._id, type: type, delivery: delivery, date: selectedDate, comment: comment })
            .then((response) => {
                setStatusBase({ msg: "Adding voucher successfully", key: Math.random() });
                setTimeout(()=>{history.push('/')}, 1000);
                console.log(response);
            })
            .catch((error) =>{
              setStatusBase({ msg: "Adding voucher failed!", key: Math.random() });
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

                    <Table className={classes.table} aria-label="caption table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" />
                                <TableCell align="left">Type</TableCell>
                                <TableCell align="left">Delivery</TableCell>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">comment</TableCell>
                                <TableCell align="left">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell className={classes.selectTableCell}>
                                        {row.isEditMode ? (
                                            <>
                                                <IconButton
                                                    aria-label="done"
                                                    onClick={() => onToggleEditMode(row.id)}
                                                >
                                                    <DoneIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="revert"
                                                    onClick={() => onRevert(row.id)}
                                                >
                                                    <RevertIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => onToggleEditMode(row.id)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <CustomTableCell {...{ row, name: "type", onChange }} />
                                    <CustomTableCell {...{ row, name: "delivery", onChange }} />
                                    <CustomTableCell {...{ row, name: "date", onChange }} />
                                    <CustomTableCell {...{ row, name: "comment", onChange }} />
                                    <CustomTableCell {...{ row, name: "status", onChange }} />
                                    <div>
                                        {row.isEditMode ?
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={onSubmit}>
                                                Update
                        </Button>
                                            :
                                            <></>}
                                    </div>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>




                                                
                </CardContent>
                {astatus ? <Alert key={astatus.key} message={astatus.msg} /> : null}
            </Card>
        </div>
    )





}

export default withRouter(VoucherForm);
