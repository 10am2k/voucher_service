import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

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

const createData = (name, lastName, email, password, phone) => ({
    // id: name.replace(" ", "_"),
    name,
    lastName,
    email,
    password,
    phone,
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



function VoucherfoForm({ token, user ,logout,history}) {



    const [rows, setRows] = React.useState(() => {

        var email = ""
        var firstName = ""
        var lastName = ""
        if (user.billerEmail !== "") {
            email = user.billerEmail;
        }
        if (user.firstName !== "") {
            firstName = user.billerFirstName
        }
        if (user.lastName !== "") {
            lastName = user.billerLastName
        }



        return [createData(firstName, lastName, email)]


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


        var email = ""
        var firstName = ""
        var lastName = ""
        if (user.billerEmail !== "") {
            email = user.billerEmail;
        }
        if (user.firstName !== "") {
            firstName = user.billerFirstName
        }
        if (user.lastName !== "") {
            lastName = user.billerLastName
        }
        setRows([createData(firstName, lastName, email)])

    }, [user.firstName]);


    const onSubmit = () => {
        var billerFirstName = rows[0].name;
        var billerLastName = rows[0].lastName;
        var billerEmail = rows[0].email;
        const id = user._id;
        const payload = { id, billerFirstName, billerLastName, billerEmail };
        console.log("payload:", payload);
        Axios.post('api/user/updateBillerInfo', payload)
            .then((res)=> {
                setStatusBase({ msg: "Update biller info successfully!", key: Math.random() });
                setTimeout(()=>{history.push('/')}, 1500);
                console.error(res);
            })
            .catch((err) => {
                setStatusBase({ msg: "Update biller info failed", key: Math.random() });
                console.error(err);
            })
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
        setPrevious(state => {
            delete state[id];
            return state;
        });
        onToggleEditMode(id);
    };
    // Above is from William

    return (
        <div>
            <NavBar token={token} logout={logout}/>
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Update Biller Information
                    </Typography>

                    <Table className={classes.table} aria-label="caption table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" />
                                <TableCell align="left">First Name</TableCell>
                                <TableCell align="left">Last Name</TableCell>
                                <TableCell align="left">Email</TableCell>
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
                                    <CustomTableCell {...{ row, name: "name", onChange }} />
                                    <CustomTableCell {...{ row, name: "lastName", onChange }} />
                                    <CustomTableCell {...{ row, name: "email", onChange }} />
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

export default withRouter(BillerInfoForm);
