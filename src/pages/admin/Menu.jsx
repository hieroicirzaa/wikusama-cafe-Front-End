import Modal from "react-modal";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { config, baseURL, imageURL } from "../../config";
// import { AiOutlineSearch } from "react-icons/ai";

//functional component (Hooks)
export default function Menu() {
  //create state member to collect data member from API
  let [menus, setMenus] = useState([]);
  let [ModalIsOpen, setModalIsOpen] = useState(false);
  // const url = "http://localhost:8000/menu/"

  //create state newMenu to collect new data member
  let [newMenu, setnewMenu] = useState([
    {
      id: "",
      nama_menu: "",
      jenis: "",
      deskripsi: "",
      gambar: null,
      harga: "",
    },
  ]);

  let [search, setSearch] = useState(""); // collect search data
  //   let [modal, setModal] = useState(null); // mannage modal to show
  let [change, setChange] = useState(false); // mannage gambar to show
  let [action, setAction] = useState(""); // mannage action to save
  
  const navigate = useNavigate();

  //manages the side-effects in functional component
  useEffect(() => { 
    if (localStorage.getItem("users") !== `"admin"`) {
      navigate("/"); 
    } 

    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    // get data from API using AXIOS
    try {
      const response = await axios.get(baseURL + "/menu/getAllMenu", config);
      setMenus(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL + "/menu/find",
        { keyword: search },
        config
      );
      setMenus(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setAction("add"); // save new member
    // modal.show(); // display modal

    //empty form
    setnewMenu({
      id: "",
      nama_menu: "",
      jenis: "",
      deskripsi: "",
      gambar: null,
      harga: "",
    });
  };

  const handleEdit = (item) => {
    setAction("edit"); // update old member
    // modal.show(); // display modal

    console.log("item >>> ", item);

    //fill form with previous data based on clicked item
    setnewMenu({
      id: item.id,
      nama_menu: item.nama_menu,
      jenis: item.jenis,
      harga: item.harga,
      deskripsi: item.deskripsi,
      gambar: item.gambar,
    });
  };

  const handleDelete = async (id) => {
    alert("Are you sure delete this data?");

    // delete data from API using AXIOS
    try {
      const response = await axios.delete(baseURL + "/menu/" + id, config);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
    // refresh member data
    fetchMenu();
  };

  const handleSave = async (e) => {
    e.preventDefault(); // prevent refresh page after sending form data
    // modal.hide() // close modal

    setChange(false); // clear previous update photo status

    //prepare data to save
    let data = new FormData();
    data.append("nama_menu", newMenu.nama_menu);
    data.append("jenis", newMenu.jenis);
    data.append("harga", newMenu.harga);
    data.append("deskripsi", newMenu.deskripsi);
    if (newMenu.gambar !== null) {
      data.append("gambar", newMenu.gambar);
    }       

    if (action === "add") {
      // save new data to API using AXIOS
      try {
        const response = await axios.post(baseURL + "/menu/addMenu", data, config);
        alert(response.data.message);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    if (action === "edit") {
      // update data to API using AXIOS
      try {
        const response = await axios.put(
          baseURL + "/menu/" + newMenu.id, data, config);
        alert(response.data.message);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    // refresh member data
    fetchMenu();
  };

  // const handleClose = () => {
  //   setChange(false); // clear previous update gambar status
  //   // modal.hide(); // close modal
  // };

  return (
    <div className=" mx-32  sm:p-4 ">
      <div className="overflow-x-auto">
        {/* title */}
        <h1 className="flex justify-center font-medium text-5xl">Menu List</h1>

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
              <th className="py-3 px-4">Nama Menu</th>
              <th className="py-3 px-4">Jenis</th>
              <th className="py-3 px-4">Harga</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4">Gambar</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-[#FEE8B0] divide-y divide-gray-700 text-base">
            {menus.map((item, index) => (
              <tr key={item.id} className="hover:bg-amber-100">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{item.nama_menu}</td>
                <td className="py-3 px-4">{item.jenis}</td>
                <td className="py-3 px-4">{item.harga}</td>
                <td className="py-3 px-4">{item.deskripsi}</td>
                <td className="py-3 px-4">
                  <img
                    className="object-contain w-32 h-32"
                    src={imageURL + item.gambar}
                    alt={item.gambar}
                  />
                </td>
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
        ariaHideApp={false}
        onRequestClose={() => setModalIsOpen(false)}
        // className="min-w-max min-h-max"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content ">
          <h2 className="text-2xl font-semibold leading-tight tracking-wide">
            Menu
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
                <label className="text-sm text-gray-800">Nama</label>
                <input
                  type="text"
                  className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={(e) =>
                    setnewMenu({ ...newMenu, nama_menu: e.target.value })
                  }
                  value={newMenu.nama_menu}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-800">Jenis</label>
                <select
                  className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={newMenu.jenis}
                  onChange={(e) =>
                    setnewMenu({ ...newMenu, jenis: e.target.value })
                  }
                  required
                >
                  <option value="">
                    {newMenu.jenis !== "" ? newMenu.jenis : "~Choose~"}
                  </option>
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-800">Harga</label>
                <input
                  type="number"
                  className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  onChange={(e) =>
                    setnewMenu({ ...newMenu, harga: e.target.value })
                  }
                  value={newMenu.harga}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-800">Deskripsi</label>
                <textarea
                  className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-400 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 h-24"
                  onChange={(e) =>
                    setnewMenu({ ...newMenu, deskripsi: e.target.value })
                  }
                  value={newMenu.deskripsi}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-800">Gambar</label> <br />
                <img
                  src={
                    newMenu.gambar !== null
                      ? change
                        ? URL.createObjectURL(newMenu.gambar)
                        : imageURL + newMenu.gambar
                      : null
                  }
                  alt={newMenu.gambar}
                  className="max-w-xs"
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) => {
                    setnewMenu({ ...newMenu, gambar: e.target.files[0] });
                    setChange(true);
                  }}
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
        </div>
      </Modal>
    </div>
  );
}