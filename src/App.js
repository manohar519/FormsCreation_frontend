import React, { useEffect, useState } from "react";
import DynamicForm from "./DynamicForm";
import axios from "axios";

function App() {
  const [forms, setForms] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [editingFormView, setEditingFormView] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const getData = async () => {
    try {
      const data = await axios.get("http://localhost:5000/api/forms/get");
      console.log(data);
      // setData(data?.data);
      setForms(data?.data);
    } catch (er) {
      console.log(er);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowForm(true); // Open the form editor
  };
  const handleViewForm = (form) => {
    setEditingFormView(form);
    setEditingForm(form);
    setShowForm(true); // Open the form Viewer
  };
  const handleDeleteForm = (formId) => {
    console.log(formId);
    setForms(forms.filter((form) => form.id !== formId));
    axios
      .delete(`http://localhost:5000/api/forms/${formId}`)
      .then((res) => {
        console.log(res);
        getData();
        alert("Data Deleted Successfully");
      })
      .catch((er) => {
        console.log(er);
        alert("Something went wrong! Try again");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showForm ? (
        <DynamicForm
          setShowForm={setShowForm}
          // onSubmit={handleFormSubmit}
          initialData={editingForm}
          getData={getData}
          editingForm={editingForm}
          editingFormView={editingFormView}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              marginTop: 10,
              backgroundColor: "#0fa50f",
              color: "white",
              padding: 10,
              border: "none",
              borderRadius: 10,
            }}
            onClick={() => setShowForm(true)}
          >
            Create New Form
          </button>
          {forms.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>Forms:</h3>
              {forms.map((form) => (
                <div key={form.id} style={{ marginBottom: "10px" }}>
                  <span>{form.title}</span>
                  <button
                    onClick={() => handleEditForm(form)}
                    style={{ marginLeft: "10px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewForm(form)}
                    style={{ marginLeft: "10px" }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
