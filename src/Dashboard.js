import React from 'react'
import Servicenave from './Servicenave';
import Sidebar from "./Sidebar";
import './App.css';

function Dashboard() {
    return (
        <>

            <Servicenave />
            <Sidebar />
            <div class="container-fluid panel-header panel-header-sm">
            </div>
            <div className='hhkk'>
                <div className="col-md-12">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "" }}>
                            <h5 className="text-cnter">Welcome to WasAccountant Dashboard</h5>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Dashboard
