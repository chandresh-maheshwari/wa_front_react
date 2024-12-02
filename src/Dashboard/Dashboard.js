import React from 'react'
import localStorage from 'local-storage'
// import '../App.css';

function Dashboard() {
    const hardik =localStorage("token")
    console.log(hardik)
    return (
        <>
            <div class="container-fluid panel-header panel-header-sm">
            </div>
            <div className='maincard'>
                <div className="col-md-12">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "" }}>
                            <h5 className="text-cnter">Welcome to WasteAccountant Dashboard</h5>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Dashboard
