import { useState,useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ContactModal from "../components/ContactModal";
import "../styles/dashboard.css";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard(){
  const[contacts,setContacts]=useState([]);
  const[showModal,setShowModal]=useState(false);
  const[editData,setEditData]=useState(null);
  const[search,setSearch]=useState("");
  const[page,setPage]=useState(1);
  const[total,setTotal]=useState(0);
  const navigate=useNavigate();
  const [limit, setLimit] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
const [activities, setActivities] = useState([]);
const [loading, setLoading] = useState(false);
const { logout } = useContext(AuthContext);
  const fetchContacts = useCallback(async () => {
  try {
    const res = await axios.get(`/contacts?page=${page}&limit=${limit}&search=${search}`);
    setContacts(res.data.contacts);
    setTotal(res.data.total);
  } catch (err) {
    console.error(err);
  }
}, [page, limit, search]);

  const fetchActivities = async () => {
  try {
    setLoading(true);
  const res = await axios.get("/activities");
    setActivities(res.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
 useEffect(() => {
  fetchContacts();
}, [fetchContacts]);
  useEffect(() => {
  if (isOpen) {
    fetchActivities();
  }
}, [isOpen]);
 const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  logout();
  navigate("/");
};

  const deleteContact=async(id)=>{
    if(!window.confirm("Delete?")) return;
    await axios.delete(`/contacts/${id}`);
    fetchContacts();
  };

  return(
    <div className="dashboard">
      <div className="top">
        <h2>Contacts</h2>
        <div>
          <button className="primary-btn"
            onClick={()=>{setEditData(null);setShowModal(true);}}>
            + Add
          </button>
          <button onClick={() => setIsOpen(true)} className="activity-btn">
  View Activity
</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <input className="search"
        placeholder="Search..."
        onChange={(e)=>{setSearch(e.target.value);setPage(1);}}/>

      {contacts.length===0?
        <div className="empty">No contacts found</div>
        :
        <div className="grid">
          {contacts.map(c=>(
            <div key={c._id} className="card">
              <h4>{c.name}  <span className="status"> {c.status}</span></h4>
              <p>Mobile: {c.phone}</p>
              <p>Mail : {c.email}</p>
              <p>Company: {c.company}</p>
             
              <p>Notes: {c.notes}</p>
              <div className="actions">
                <button onClick={()=>{setEditData(c);setShowModal(true);}}>
                  Edit
                </button>
                <button onClick={()=>deleteContact(c._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      }

    <div className="bottom-bar">
  <div className="limit-selector">
    <span>Rows per page:</span>
    <select
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
    </select>
  </div>

  <div className="pagination">
    {Array.from(
      { length: Math.ceil(total / limit) },
      (_, i) => (
        <button
          key={i}
          className={page === i + 1 ? "active" : ""}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      )
    )}
  </div>
 
</div>
      {showModal &&
        <ContactModal
          editData={editData}
          onClose={()=>setShowModal(false)}
          refresh={fetchContacts}
        />}
        {isOpen && (
  <>
    <div className="overlay" onClick={() => setIsOpen(false)}></div>

    <div className="activity-panel">
      <div className="panel-header">
        <h3>Activity Logs</h3>
        <button onClick={() => setIsOpen(false)}>X</button>
      </div>

      <div className="panel-body">
        {loading ? (
          <p>Loading...</p>
        ) : activities.length === 0 ? (
          <p className="no-data">No Activity Found</p>
        ) : (
          activities.map((item) => (
            <div key={item._id} className="activity-card">
              <p>{item?.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  </>
)}
    </div>
    
  );
}