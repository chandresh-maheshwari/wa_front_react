import { Container, Button } from '@mui/material';
import Authapi from '../Authapi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete, MdOutlineCancel } from 'react-icons/md';
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
import { useLocation } from 'react-router-dom';
import ls from 'local-storage';
import "../Custom.css";
// import jQuery from 'jquery';s
import './common.css'
import $ from 'jquery';


const PostDynamicList = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStates, setActiveStates] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const location = useLocation();
    const post_title = location.state?.post_title;
    const [columns, setColumns] = useState([]);
    const [expandedEmails, setExpandedEmails] = useState({});
    const [abc, setAbc] = useState();

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 100);
    }, [post_title]);
    // console.log(post_title)s

    const fetchData = async () => {
        try {
            const response = await Authapi.postdynamicListData(post_title);
            // console.log(post_title)
            console.log("sddf", response)

            if (response.status === true) {
                const formattedRows = response.results.map((item, index) => ({
                    id: item.id,
                    status: item.status,
                    sr_No: index + 1,
                    ...item.data,
                }));
                const sortedData = formattedRows.sort((a, b) => b.id - a.id);
                const dataWithSrNo = sortedData.map((item, index) => ({
                    ...item,
                    sr_No: index + 1,
                }));


                setRows(dataWithSrNo);

                if (formattedRows.length > 0) {
                    const dynamicColumns = Object.keys(formattedRows[0]).map(key => {
                        if (key === 'id' || key === 'status') return null;
                        return {
                            field: key,
                            headerName: key.charAt(0).toUpperCase() + key.slice(1),
                            width: 100,
                            cellClassName: 'wrap-text',
                            // renderCell: (params) => {
                            //     const value = params.row[key];
                            //     const isExpanded = expandedEmails[params.row.id];
                            //     const displayValue = typeof value === 'string' ? value : String(value);
                            //     const safeValue = displayValue.replace(/[^a-zA-Z0-9-_]/g, '_');

                            //     const isImage = typeof value === 'string' && (value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.png') || value.endsWith('.gif'));
                            //     return (
                            //         <div style={{}}>
                            //             {isImage ? (
                            //                 <img src={value} alt={displayValue} style={{ width: '50px', height: '50px' }} />
                            //             ) : (
                            //                 <span className={`email-display-${safeValue}`}>
                            //                     {isExpanded ? displayValue : `${displayValue.substring(0, 10)}`}
                            //                 </span>
                            //             )}
                            //             {!isImage && displayValue.length > 10 && (
                            //                 // <Link
                            //                 //     onClick={() => {
                            //                 //         toggleEmailExpand(safeValue);
                            //                 //         if (ls("readmore") === "karmur") {
                            //                 //             ls(`readmore`, "hardik");
                            //                 //             ls(`data`, safeValue);
                            //                 //             $(`.email-display-${safeValue}`).text(`${displayValue.substring(0, 10)}`);
                            //                 //         } else {
                            //                 //             ls(`readmore`, "karmur");
                            //                 //             ls(`data`, "");
                            //                 //             $(`.email-display-${safeValue}`).text(displayValue);
                            //                 //         }
                            //                 //     }}
                            //                 //     style={{ marginLeft: '5px' }}
                            //                 // >
                            //                 //     {ls("readmore") === "hardik" && ls("data") === safeValue ? 'Read More' : 'Read Less'}
                            //                 // </Link>
                            //                 <Link
                            //                     onClick={(e) => {
                            //                         e.preventDefault();  // Prevent the page reload
                            //                         toggleEmailExpand(safeValue);
                            //                         if (ls("readmore") === "karmur") {
                            //                             ls(`readmore`, "hardik");
                            //                             ls(`data`, safeValue);
                            //                             $(`.email-display-${safeValue}`).text(`${displayValue.substring(0, 10)}`);
                            //                         } else {
                            //                             ls(`readmore`, "karmur");
                            //                             ls(`data`, "");
                            //                             $(`.email-display-${safeValue}`).text(displayValue);
                            //                         }
                            //                     }}
                            //                     style={{ marginLeft: '5px' }}
                            //                 >
                            //                     {ls("readmore") === "hardik" && ls("data") === safeValue ? 'Read More' : 'Read Less'}
                            //                 </Link>

                            //             )}
                            //             {/* {isValidColor(value) && (
                            //                 <div style={{
                            //                     display: 'inline-block',
                            //                     width: '20px',
                            //                     height: '20px',
                            //                     backgroundColor: value,
                            //                     border: '1px solid #000',
                            //                     marginLeft: '5px'
                            //                 }} />
                            //             )} */}
                            //         </div>
                            //     );
                            // }
                            renderCell: (params) => {
                                const value = params.row[key];
                                const isExpanded = expandedEmails[params.row.id];
                                const displayValue = typeof value === 'string' ? value : (value !== undefined && value !== null ? String(value) : "-");
                                const safeValue = displayValue.replace(/[^a-zA-Z0-9-_]/g, '_');

                                const isImage = typeof value === 'string' && (value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.png') || value.endsWith('.gif'));
                                return (
                                    <div style={{ whiteSpace: 'normal', }}>
                                        {isImage ? (
                                            <img src={value} alt={displayValue} style={{ width: '50px', height: '50px' }} />
                                        ) : (
                                            <span className={`email-display-${safeValue}`}>
                                                {isExpanded ? displayValue : `${displayValue.substring(0, 10)}`}
                                            </span>
                                        )}
                                        {!isImage && displayValue.length > 10 && (
                                            <Link
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleEmailExpand(safeValue);
                                                    if (ls("readmore") === "karmur") {
                                                        ls(`readmore`, "hardik");
                                                        ls(`data`, safeValue);
                                                        $(`.email-display-${safeValue}`).text(`${displayValue.substring(0, 10)}`);
                                                    } else {
                                                        ls(`readmore`, "karmur");
                                                        ls(`data`, "");
                                                        $(`.email-display-${safeValue}`).text(displayValue);
                                                    }
                                                }}
                                                style={{ marginLeft: '5px' }}
                                            >
                                                {ls("readmore") === "hardik" && ls("data") === safeValue ? 'Read More' : 'Read Less'}
                                            </Link>
                                        )}
                                    </div>
                                );
                            }

                        };



                    }).filter(Boolean);

                    dynamicColumns.push({
                        field: 'actions',
                        headerName: 'Actions',
                        width: 190,
                        cellClassName: 'wrap-text',
                        flex: 1,
                        renderCell: (params) => (
                            <strong onClick={(e) => e.stopPropagation()}>
                                <Link
                                    className="btn btn-primary m-2"
                                    style={{ backgroundColor: '#113b4f' }}
                                    id="edit"
                                    title="Edit"
                                    to={{
                                        pathname: `/post-edit/${params.row.id}`,
                                    }}
                                    state={{ post_title: post_title }}
                                >
                                    <BiEditAlt />
                                </Link>
                                <button
                                    className="btnkkk btn-oblong btn-danger btn-sm"
                                    title="Soft Delete"
                                    onClick={() => handleDelete(params.row.id)}
                                >
                                    <MdDelete />
                                </button>
                                <Switch
                                    key={params.row.id}
                                    checked={params.row.status}
                                    size="xs"
                                    onChange={() => getActive(params.row.id, activeStates[params.row.id] ? 0 : 1)}
                                />
                            </strong>
                        ),
                    });

                    setColumns(dynamicColumns);
                }
            } else {
                console.error('Invalid response structure:', response);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };



    const toggleEmailExpand = (id) => {
        setAbc(id)
        setExpandedEmails((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

    };
    const getActive = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await Authapi.postdynamicstatus(id, newStatus);
            if (response) {

                setActiveStates((prevStates) => ({
                    ...prevStates,
                    [id]: newStatus === 1,
                }));
                fetchData()
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will mark the item as deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.postdynamicDeleteData(id);
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

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query) {
            const filtered = rows.filter((row) => {

                return Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                );
            });
            setFilteredRows(filtered);
        } else {
            setFilteredRows(rows);
        }
    };

    const handlesearchCancel = () => {
        setSearchQuery('');
        setFilteredRows([]);
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };


    const isValidColor = (color) => {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    };

    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: '22%', width: '75%', marginBottom: '20px', marginTop: '10%' }}>
                    <div className="card-header">
                        <h5 className="title">Post</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <div style={{ marginTop: '30px', }}>
                                <h4>{post_title}</h4>
                                <input
                                    type="text"
                                    className="form-control form control navbar-search"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <Button
                                    className="text-dark"
                                    style={{ marginTop: '-96px', marginLeft: '92%' }}
                                    onClick={handlesearchCancel}
                                >
                                    <MdOutlineCancel style={{ marginLeft: '30px' }} />
                                </Button>
                                <div style={{ width: '100%', height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={searchQuery ? filteredRows : rows}
                                        columns={columns}
                                        initialState={{ pagination: { paginationModel: { page, pageSize } } }}
                                        pageSizeOptions={[5, 10, 20]}
                                        checkboxSelection
                                        loading={loading}
                                        autoHeight={true}
                                        sx={{
                                            height: '100%',
                                            overflow: 'hidden',
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#2c9dd4',
                                                color: 'white',
                                                // wordWrap: 'break-word'
                                            },
                                        }}
                                        selectionModel={selectedRows}
                                        onSelectionModelChange={handleSelectionChange}
                                        onCellClick={(params, event) => {
                                            if (event.target.closest('.MuiCheckbox-root')) {
                                                return;
                                            }
                                            event.stopPropagation();
                                        }}
                                    />
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDynamicList;

