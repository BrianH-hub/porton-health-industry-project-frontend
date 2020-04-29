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


export default function Users() {
    const classes = useStyles();
    let { url } = useRouteMatch();

    const authContext = React.useContext(AuthContext)
    const [search, setSearch] = React.useState("");
    const [apiResult, setapiResult] = React.useState(null);
    const [users, setUsers]  = React.useState(null);
    const [initialSort, setInitialSort]  = React.useState(null);

    const [error, setError] = React.useState(null);
    const [direction, setDirection] = React.useState("asc")
    const [searchToggle, setSearchToggle] = React.useState(false);
    const [pageTotal, setPageTotal] = React.useState(null);

    let [page, setPage] = React.useState(1);

    React.useEffect(() => {
      const start = async () => {
        let data = await authContext.API.getUsers()
        if (data === undefined){
          console.log("error")
          setError("Error grabbing data from the server.")
        } else if (data.data === undefined){
          console.log("error")
          setError("Error grabbing data from the server.")
        } else {
          authContext.API.readToken(authContext.authState).then(function(result){
            if (result.role !== 'SYSTEM_ADMIN'){
             return setError("404. Please try again.")
            } else {
              setapiResult(data.data)
              setUsers(data.data.users)
              setInitialSort(data.data.users)
              setPageTotal(data.data.totalPages)
            }
          })
        }
      }
      start()
    }, [])

    const columns = [
      { id: 'firstName', label: 'First Name', minWidth: 120 },
      { id: 'lastName', label: 'Last Name', minWidth: 120 },
      { id: 'role', label: 'Role', minWidth: 120 },
      { id: 'email', label: 'Email', minWidth: 140 },
      { id: 'action', label: 'Action', minWidth: 150 } ] 

      //create top header 
      const createData = (name, role, email, action, id ) => {
        return { name, role, email, action, id };
      }

      //call users API passing in the page, set results to view.
      const callAPI = async (page, query) => {
        let data = undefined
        console.log(page, query)
        query ?  data = await authContext.API.getUsers(page, query) :  data = await authContext.API.getUsers(page)
        console.log(data)
      if (data === undefined){
        console.log("error")
        setError("Error grabbing data from the server.")
      } else if (data.data === undefined){
        console.log("error")
        setError("Error grabbing data from the server.")
      } else {
        authContext.API.readToken(authContext.authState).then(function(result){
          if (result.role !== 'SYSTEM_ADMIN'){
           return setError("404. Please try again.")
          } else {
            setUsers(data.data.users)
            setPageTotal(data.data.totalPages)
          }
        })
      }
    }

    const handleChangePage = async (pageDir) => {
      if (pageDir == 'r' && page + 1 <= pageTotal){
        callAPI(page + 1)
        setPage(page += 1)
      } else if (pageDir == 'l' && page - 1 >= 1){
        callAPI(page - 1)
        setPage(page -= 1)
      }
    };

  const renderAction = (user) => {
    return(<Link to={`${url}/${user._id}`} style={{textDecoration: 'none', color: 'inherit'}}><Button size="small" variant="contained" color="primary">Client Information and Settings</Button></Link>)
  }

  //email disabled for now...
  const sortTable = (col) => {
    if (col === 'email'){
    //bugfix here....
    } else {
    if(direction === "asc"){
      let sorted = users.sort(function(a, b){
        if(a[col] > b[col]) { return 1; }
        if(a[col] < b[col]) { return -1; }  
        return 0;
    })  
    setUsers(sorted)
    setDirection("desc")
    } else {
      let sorted = users.sort(function(a, b){
        if(a[col] < b[col]) { return 1; }
        if(a[col] > b[col]) { return -1; }
        return 0;
    })  
     setUsers(sorted)
     setDirection("asc")
    }
  }
}

const handleSearchChange = (e) => {
  setSearch(e.target.value);
};

const submitSearch = (event) => {
  if (event.key === "Enter" && search !== "") {
    callAPI(undefined, search)
    setSearchToggle(true)
    event.target.value = ""
  }
}

//clear search fields, render base API  result again.
const clearSearch = () => {
  setSearch("")
  setSearchToggle(false)
  callAPI(1)
}


    return(
    <div> 
            {error !== null ? error : ""}
            {users !== null && users !== undefined ? 
    <div>
      {              console.log(users)}
      {searchToggle === true ? <Button size="small" variant="contained" color="primary" onClick={clearSearch}>Clear Search</Button> : ""}
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
                  {column.id !== 'action' && column.id !== 'email' ? <MuiTableSortLabel active onClick={() => sortTable(column.id) } direction={direction}> </MuiTableSortLabel> : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => {
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
          Page {page} of {pageTotal}
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