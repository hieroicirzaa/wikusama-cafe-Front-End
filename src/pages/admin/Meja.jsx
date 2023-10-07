import Modal from "react-modal";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { config, baseURL } from "../../config";

export default function Meja() {
  //create state member to collect data member from API
  let [mejas, setMejas] = useState([]);
  let [ModalIsOpen, setModalIsOpen] = useState(false);

  let [newMeja, setnewMeja] = useState(
    {
      id: "",
      nomor_meja: "",
      status: ""
    },
  );

  let [search, setSearch] = useState(""); // collect search data

  let [action, setAction] = useState(""); // mannage action to save
  
  const navigate = useNavigate();

  //manages the side-effects in functional component
  useEffect(() => {
    if (localStorage.getItem("users") !== `"admin"`) {
      navigate("/"); 
    } 
    fetchMeja();
  }, []);

  const fetchMeja = async () => {
    // get data from API using AXIOS
    try {
      const response = await axios.get(baseURL + "/meja/getAllMeja", config);
      setMejas(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL + "/meja/find",
        { keyword: search },
        config
      );
      setMejas(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setAction("add"); // save new member
    // modal.show(); // display modal

    //empty form
    setnewMeja({
      id: "",
      nomor_meja: "",
      status: "",
    });
  };

  const handleEdit = (item) => {
    setAction("edit");
    setModalIsOpen(true);
    setnewMeja({
      id: item.id,
      nomor_meja: item.nomor_meja,
      status: item.status
    });
  };

  const handleDelete = async (id) => {
    alert("Are you sure delete this data?");

    // delete data from API using AXIOS
    try {
      const response = await axios.delete(baseURL + "/meja/" + id, config);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
    // refresh member data
    fetchMeja();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      nomor_meja: newMeja.nomor_meja,
      status: newMeja.status
    };

    if (action === "add") {
      try {
        await axios.post(`${baseURL}/meja/addMeja/`, data, {
          headers: { ...config.headers, "Content-Type": "application/json" }
        });
        setnewMeja({ id: "", nomor_meja: "", status: "" });
        setModalIsOpen(false);
        fetchMeja();
      } catch (error) {
        console.error(error);
      }
    } else if (action === "edit") {
      try {
        await axios.put(`${baseURL}/meja/${newMeja.id}`, data, {
          headers: { ...config.headers, "Content-Type": "application/json" }
        });
        setnewMeja({ id: "", nomor_meja: "", status: "" });
        setModalIsOpen(false);
        fetchMeja();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className=" mx-32  sm:p-4 ">
      <div className="overflow-x-auto">
        {/* title */}
        <h1 className="flex justify-center font-medium text-5xl">Meja List</h1>

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
        <table className="w-full mt-4 border-collapse">
          <thead className="bg-[#F97B22] w-full text-lg text-white">
            <tr>
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Nomor Meja</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-[#FEE8B0] divide-y divide-gray-700 text-base">
            {mejas.map((item, index) => (
              <tr key={item.id} className="hover:bg-amber-100">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{item.nomor_meja}</td>
                <td className="py-3 px-4">{item.status}</td>

                <td className="py-3 px-4">
                  <div className="flex justify-center items-center gap-2">
                    {/* button edit */}
                    <button onClick={() => setModalIsOpen(true)}>
                      <a
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </a>
                    </button>
                    {/* button delete */}
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
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
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
        overlayClassName="modal-overlay"
      >
        <div className="modal-content ">
          <h2 className="text-2xl font-semibold leading-tight tracking-wide">
            Meja
          </h2>
          <div>
            <button onClick={() => setModalIsOpen(false)}>
              <a className="absolute top-2 right-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="flex-shrink-0 w-6 h-6">
                  <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
                </svg>
              </a>
            </button>
          </div>
          <div>
            <form onSubmit={(e) => handleSave(e)} className="flex flex-col ">
              <div>
                <label className="text-sm text-gray-800">Nomor Meja</label>
                <input
                  type="text"
                  className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={(e) =>
                    setnewMeja({ ...newMeja, nomor_meja: e.target.value })
                  }
                  value={newMeja.nomor_meja}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-800">Status</label>
                <select
                  className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={newMeja.status}
                  onChange={(e) =>
                    setnewMeja({ ...newMeja, status: e.target.value })
                  }
                  required
                >
                  <option value="">
                    {newMeja.status !== "" ? newMeja.status : "Choose"}
                  </option>
                  <option value="kosong">Kosong</option>
                  <option value="terisi">Terisi</option>
                </select>
              </div>

              <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md no-underline inline-block cursor-pointer mt-4" type="submit">
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
        </div>
      </Modal>
    </div>
  );
}