import React from "react";
import AuthContext from "../../../data/AuthContext"
import { Link, useRouteMatch } from "react-router-dom";

//material-ui components:
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MuiTableSortLabel  from '@material-ui/core/TableSortLabel';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 275,
      width: '100%',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    container: {
      marginTop: '2%',
      maxHeight: '100%',
    },
  }));


export default function AppointmentList() {
  const classes = useStyles();
  let { url } = useRouteMatch();

  const authContext = React.useContext(AuthContext)
  const [error, setError] = React.useState(null);
  const [appointments, setAppoitnments] = React.useState(null);
  const [apiResult, setapiResult] = React.useState(null);
  const [initialSort, setInitialSort] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [direction, setDirection] = React.useState("asc")
  let [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const start = async () => {
      // let data = await authContext.API.getUsers()
      let data = [{appointmentTime: '2020-04-11T03:36:57.292Z', doctorName: 'john doe', status: 'Pending', comments: "", reason: "Flu", _id: 1}, {appointmentTime: '2020-04-11T03:36:57.292Z', doctorName: 'john doe', status: 'comfiremd', comments: '', reason: 'injury', _id: 1}, {appointmentTime: '2020-04-11T03:36:57.292Z', doctorName: 'doctor B', status: 'cancled', comments: '', reason: 'covid-19', _id: 1}, {appointmentTime: '2020-04-11T03:36:57.292Z', doctorName: 'doctor C', status: 'pending', comments: '', reason: 'check-up', _id: 1}]
      if (data === undefined){
        console.log("error")
        setError("Error grabbing data from the server.")
      } else if (data === undefined){
        console.log("error")
        setError("Error grabbing data from the server.")
      } else {
        authContext.API.readToken(authContext.authState).then(function(result){
          if (result.role !== 'CLIENT_ADMIN'){
           return setError("404. Please try again.")
          } else {
            setapiResult(data)
            setAppoitnments(data)
            setInitialSort(data)
          }
        })
      }
    }
    start()
  }, [])
  
  const columns = [
    { id: 'patient', label: 'Patient', minWidth: 120 },
    { id: 'appointmentTime', label: 'Apt. Time', minWidth: 120 },
    { id: 'doctorName', label: 'Doctor', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'action', label: 'Action', minWidth: 150 } ] 

      //create top header 
      const createData = (patient, appointmentTime, doctorName, status, action, id ) => {
        return { patient, appointmentTime, doctorName, status, action, id };
      }

      const renderAction = (appointment) => {
        return(<Link to={`${url}/${appointment._id}`} style={{textDecoration: 'none', color: 'inherit'}}><Button size="small" variant="contained" color="primary">Client Information and Settings</Button></Link>)
      }

      
      const sortTable = (col) => {
        console.log("sort...")
      //   if (col === 'email'){
      //   //bugfix here....
      //   } else {
      //   if(direction === "asc"){
      //     let sorted = users.sort(function(a, b){
      //       if(a[col] > b[col]) { return 1; }
      //       if(a[col] < b[col]) { return -1; }  
      //       return 0;
      //   })  
      //   setUsers(sorted)
      //   setDirection("desc")
      //   } else {
      //     let sorted = users.sort(function(a, b){
      //       if(a[col] < b[col]) { return 1; }
      //       if(a[col] > b[col]) { return -1; }
      //       return 0;
      //   })  
      //    setUsers(sorted)
      //    setDirection("asc")
      //   }
      // }
    }

const handleSearchChange = (e) => {
  setSearch(e.target.value);
};

const submitSearch = (event) => {
  if (event.key === "Enter" && search !== "") {
    console.log(search)
  }
}

const handleChangePage = () => {
console.log("next")
}
    

return(
  <div> 
          {error !== null ? error : ""}
          {appointments !== null && appointments !== undefined ? 
  <div>
    <TextField id="outlined-basic" label="Search By Field" variant="outlined" style={{float: 'right', marginBottom: '2%'}} onChange={handleSearchChange} onKeyPress={submitSearch}/> 
    <Paper className={classes.root}>
    <TableContainer className={classes.container}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead className>
          <TableRow>
            {columns.map((column) => (
              <TableCell 
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth, backgroundColor: '#df0f6a', color: 'white' }} >
                {column.label}
                {column.id !== 'action' ? <MuiTableSortLabel active onClick={() => sortTable(column.id) } direction={direction}> </MuiTableSortLabel> : ""}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column, id) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} key={id} align={column.align}>
                      {column.id === 'action' ? renderAction(row) : value}
                    </TableCell>
                  );
                })}
                  
              </TableRow>
            );
          })}
        </TableBody>

        <TableBody > 
        <div  style={{display: 'flex', justifyContent: 'center'}}> 
        Page {page} of {apiResult.totalPages}
        <ArrowLeftIcon onClick={() => handleChangePage("l")}/>
        <ArrowRightIcon onClick={() => handleChangePage("r")}/>
        </div>
        </TableBody> 

      </Table>
    </TableContainer>
  </Paper>
</div>
      : "" }
</div>
  ) 
  }