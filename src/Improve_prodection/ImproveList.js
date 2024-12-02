import { Container, TextField, Button, Grid, Box } from '@mui/material';
import Authapi from '../Authapi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete, MdOutlineCancel } from 'react-icons/md';
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';

const ImpoveDataList = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);


    const [activeStates, setActiveStates] = useState(
        Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Authapi.improveListData();
            if (response && response.results) {
                const data = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    protections_description: item.protections_description,
                    button_name: item.button_name,
                    button_link: item.button_link,
                }));
                setRows(data);
                setFilteredRows(data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Swal.fire('Error', 'Failed to load data.', 'error');
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query) {
            const filtered = rows.filter((row) =>
                row.protections_description.toLowerCase().includes(query.toLowerCase()) ||
                row.button_name.toLowerCase().includes(query.toLowerCase()) ||
                row.button_link.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredRows(filtered);
        } else {
            setFilteredRows(rows);
        }
    };



    const getActive = async (id) => {
        try {
            const response = await Authapi.improvestatus(id);
            console.log(response)
            setActiveStates(prevStates => ({
                ...prevStates,
                [id]: !prevStates[id]
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "This will mark the item as deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.improveDeleteData(id);
                if (response) {
                    Swal.fire('Success!', 'Item marked as deleted.', 'success');
                    fetchData();
                } else {
                    throw new Error(response?.message || 'Failed to delete item');
                }
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete item', 'error');
            }
        }
    };

    const paginationModel = { page: 0, pageSize: 5 };
    const columns = [
        // { field: 'id', headerName: 'ID', width: 90, flex: 1 },
        { field: 'sr_no', headerName: 'S.No', width: 90, flex: 1 },
        { field: 'protections_description', headerName: 'Protections Description', width: 150, flex: 1 },
        { field: 'button_name', headerName: 'Button Name', width: 200, flex: 1 },
        { field: 'button_link', headerName: 'Button Link', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 1,
            renderCell: (params) => (
                <strong>
                    <Link
                        to={`/ImproveEdit/${params.row.id}`}
                        className="btn btn-primary m-2"
                        style={{ backgroundColor: '#113b4f' }}
                        id="edit"
                        title="Edit"
                    >
                        <BiEditAlt />
                    </Link>
                    <button
                        className='btnkkk btn-oblong btn-danger btn-sm'
                        title="Soft Delete"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <MdDelete />
                    </button>
                    <Switch
                        key={params.row.id}
                        checked={activeStates[params.row.id]}
                        size="xs"
                        onChange={() => getActive(params.row.id)}
                    />
                </strong>
            ),
        },
    ];








    const handlesearchCancel = () => {
        setSearchQuery('');
        setFilteredRows([]);
        fetchData();
    };



    return (
        <>
            <Expired />

            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: '22%', width: '75%', marginBottom: '20px', marginTop: '10%' }}>

                    <div className="card-header">
                        <h5 className="title">Improve envirmental Protection </h5>
                    </div>
                    <div className="card-body">
                        <Container>

                            <div style={{ marginTop: '30px' }}>
                                <h4>Improve envirmental Protection Data</h4>
                                <input
                                    type='text'
                                    className='form-control form control navbar-search'
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <Button className='text-dark' style={{ marginTop: "-96px", marginLeft: "92%" }}
                                    onClick={handlesearchCancel}
                                >
                                    <MdOutlineCancel style={{ marginLeft: "30px" }} />
                                </Button>
                                <div style={{ width: '100%', height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={searchQuery ? filteredRows : rows}
                                        columns={columns}
                                        initialState={{ pagination: { paginationModel } }}
                                        pageSizeOptions={[5, 10, 20]}
                                        checkboxSelection
                                        loading={loading}
                                        autoHeight={false}
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        sx={{
                                            height: '100%',
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#2c9dd4',
                                                color: 'white',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </Container>
                    </div>

                </div>

            </div>



        </>
    )
}

export default ImpoveDataList 