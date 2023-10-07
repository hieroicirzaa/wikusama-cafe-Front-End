import Modal from "react-modal";
import axios from "axios"; //to mannage API
import { useState, useEffect } from "react";
import { config, baseURL} from "../../config";
import { useNavigate } from "react-router-dom";

//functional component (Hooks)
export default function User() {
  //create state member to collect data member from API
  let [users, setUser] = useState([]);
  let [ModalIsOpen, setModalIsOpen] = useState(false);
  // const url = "http://localhost:8000/menu/"

  //create state newMenu to collect new data member
  let [newUser, setnewUser] = useState([
    {
      id: "",
      nama_user: "",
      role: "",
      username: "",
      password: "",
    },
  ]);

  let [search, setSearch] = useState(""); // collect search data
  let [change, setChange] = useState(false); // mannage gambar to show
  let [action, setAction] = useState(""); // mannage action to save
  const navigate = useNavigate();

  //manages the side-effects in functional component
  useEffect(() => {
    if (localStorage.getItem("users") !== `"admin"`) {
      navigate("/"); 
    } 
    fetchUser();
  }, []);

  const fetchUser = async () => {
    // get data from API using AXIOS
    try {
      const response = await axios.get(baseURL + "/user/getAllUser", config);
      setUser(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL + "/user/find",
        { keyword: search },
        config
      );
      setUser(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setAction("add"); // save new member
    //empty form
    setnewUser({
      id: "",
      nama_user: "",
      role: "",
      username: "",
      password: "",
    });
  };

  const handleEdit = (item) => {
    setAction("edit"); // update old member

    //fill form with previous data based on clicked item
    setnewUser({
      id: item.id,
      nama_user: item.nama_user,
      role: item.role,
      username: item.username,
      password: item.password,
    });
  };

  const handleDelete = async (id) => {
    alert("Are you sure delete this data?");

    // delete data from API using AXIOS
    try {
      const response = await axios.delete(baseURL + "/user/" + id, config);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
    // refresh member data
    fetchUser();
  };

  const handleSave = async (e) => {
    e.preventDefault(); // prevent refresh page after sending form data
    setChange(false); // clear previous update photo status
    
    //prepare data to save
    let paramBody = {
      nama_user: newUser.nama_user,
      role: newUser.role,
      username: newUser.username,
      password: newUser.password
    }

    if (action === "add") {
      // save new data to API using AXIOS
      try {
        const response = await axios.post(baseURL + "/user/addUser", paramBody, config);
        alert(response.data.message);
        // window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    if (action === "edit") {
      // update data to API using AXIOS
      try {
        const response = await axios.put(
          baseURL + "/user/" + newUser.id,
          paramBody,
          config
        );
        alert(response.data.message);
        // window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    // refresh member data
    fetchUser();
    setModalIsOpen(false);
  };

  return (
    <div className=" mx-32  sm:p-4 text-[Poppins] ">
      <div className="overflow-x-auto">
        {/* title */}
        <h1 className="flex justify-center font-medium text-5xl">User List</h1>

        <div className="flex justify-content-between align-items-center">
          {/* search form*/}
          <form
            className="w-full flex justify-end text-gray-100"
            onSubmit={(e) => handleSearch(e)}
          >
            <input
              type="search"
              name="Search"
              placeholder="Search..."
              className="w-56 py-2 pl-4 text-sm outline-none bg-white text-gray-700   rounded-2xl border-2 border-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* table */}
        <table className="min-w-full mt-4">
          <thead className="bg-[#CD104D]  w-full text-lg text-white">
            <tr>
              <th className=" p-3">No</th>
              <th className="py-3">Nama</th>
              <th className="py-3">Jabatan</th>
              <th className="py-3">Username</th>
              <th className="py-3 pl-14">Action</th>
            </tr>
          </thead>
          <tbody className="border-b border-opacity-20 divide-black divide-y-2 py-4 min-h-[90px] max-h-[100px] border-gray-700 bg-rose-200 text-base text-[Poppins]">
            {users.map((item, index) => (
              <tr key={item.id} className="hover:bg-rose-100 text-center">
                <th className="p-3">{index + 1}</th>
                <td>{item.nama_user}</td>
                <td>{item.role}</td>
                <td>{item.username}</td>
                <td className=" h-full justify-center">
                  <div className="flex max-w-[80px] gap-2   ">
                    {/* button edit */}
                    <button onClick={() => setModalIsOpen(true)}>
                      <a
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md no-underline inline-block cursor-pointer"
                        onClick={() => handleEdit(item)}
                      >
                        edit
                      </a>
                    </button>
                    {/* button delete */}
                    <a
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4  rounded-md  no-underline inline-block cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    >
                      delete
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* button add */}
        <button onClick={() => setModalIsOpen(true)}>
          <a
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-md mt-3 no-underline inline-block"
            onClick={() => handleAdd()}>
            Tambah
          </a>
        </button>
      </div>

      {/* create modal form to add or edit member data */}
      <Modal
        isOpen={ModalIsOpen}
        ariaHideApp={false}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h2 className="text-2xl font-semibold leading-tight tracking-wide">
          Edit Menu
        </h2>
        <div>
          <button onClick={() => setModalIsOpen(false)}>
            <a className="absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
              </svg>
            </a>
          </button>
        </div>
        <div>
          <form onSubmit={(e) => handleSave(e)} className="flex flex-col ">
            <div>
            <label className="text-sm text-gray-800">Nama</label>
            <input
              type="text"
              className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setnewUser({ ...newUser, nama_user: e.target.value })
              }
              value={newUser.nama_user}
              required
            />
            </div>

            <div>
            <label className="text-sm text-gray-800">Jabatan</label>
            <select
              className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              value={newUser.role}
              onChange={(e) =>
                setnewUser({ ...newUser, role: e.target.value })
              }
              required
            >
              <option value="">
                {newUser.role !== "" ? newUser.role : "~Choose~"}
              </option>
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
              <option value="manajer">manajer</option>
            </select>
            </div> 

            <div>
            <label className="text-sm text-gray-800">username</label>
            <input
              type="text"
              className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setnewUser({ ...newUser, username: e.target.value })
              }
              value={newUser.username}
              required
            />
            </div>

           <div>
           <label className="text-sm text-gray-800">password</label>
           <input
              type="password"
              className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setnewUser({ ...newUser, password: e.target.value })
              }
              value={newUser.password}
              required
            />
           </div>

            <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md no-underline inline-block cursor-pointer" type="submit">
              Save
            </button>
          </form>
        </div>
        {/* <button
          type="button"
          classN1w-full"px-8 py-2 font-semibold rounded-full bg-violet-400 text-gray-900"
        >
          Start recycling
        </button> */}
      </Modal>
    </div>
  );
}

