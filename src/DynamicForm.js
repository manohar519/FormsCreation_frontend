import React, { useState, useEffect } from "react";
import axios from "axios";
function DynamicForm({
  initialData,
  editingForm,
  getData,
  setShowForm,
  editingFormView,
}) {
  const style = {
    backgroundColor: "#4e4ed9f6",
    color: "white",
    padding: 8,
    border: "1px solid #4e4ed9f6",
    borderRadius: 5,
  };
  const [formTitle, setFormTitle] = useState(
    initialData ? initialData.title : "Untitled Form"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [fields, setFields] = useState(initialData ? initialData.fields : []);
  const [showFieldOptions, setShowFieldOptions] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [formData, setFormData] = useState({});

  const addField = (type) => {
    const newField = { id: Date.now(), type, placeholder: "", label: "" };
    setFields([...fields, newField]);
    setEditingFieldId(newField.id);
    setShowFieldOptions(false);
  };

  const saveField = () => {
    console.log({ title: formTitle, fields: fields });
    setEditingFieldId(null);
  };

  const handleFieldChange = (id, updatedField) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updatedField } : field
      )
    );
  };

  const deleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const editField = (id) => {
    setEditingFieldId(id);
  };

  const renderFieldInfoCard = (field) => {
    const { id, type, placeholder, label } = field;

    return (
      <div
        key={id}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            <label>
              <strong>{label}</strong>
            </label>
            <input
              type={type}
              placeholder={placeholder}
              style={{ display: "block", marginTop: "5px", marginLeft: "10px" }}
              readOnly
            />
          </div>
          <div style={{ margin: 4 }}>
            <button
              onClick={() => editField(id)}
              style={{ marginRight: "10px" }}
            >
              Edit
            </button>
            <button onClick={() => deleteField(id)}>Delete</button>
          </div>
        </div>
      </div>
    );
  };
  const renderFieldEditCard = (field) => {
    const { id, type, placeholder, label } = field;

    return (
      <div
        key={id}
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <div style={{ marginBottom: "10px", display: "flex" }}>
          <input
            type="text"
            placeholder="Field Title"
            value={label}
            onChange={(e) => handleFieldChange(id, { label: e.target.value })}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Placeholder"
            value={placeholder}
            onChange={(e) =>
              handleFieldChange(id, { placeholder: e.target.value })
            }
          />
          <button onClick={saveField} style={{ marginLeft: "10px" }}>
            Save
          </button>
        </div>
      </div>
    );
  };
  const renderFieldInfoCardView = (field) => {
    const { id, type, placeholder, label } = field;

    return (
      <div
        key={id}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            <label>
              <strong>{label}</strong>
            </label>
            <input
              type={type}
              placeholder={placeholder}
              style={{ display: "block", marginTop: "5px", marginLeft: "10px" }}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log({ title: formTitle, fields, formData, id: initialData._id });
    if (editingForm) {
      // editform api
      axios
        .put(`http://localhost:5000/api/forms/${editingForm._id}`, {
          title: formTitle,
          fields,
        })
        .then((res) => {
          console.log(res);
          setShowForm(false);
          getData();
          alert("Forms Edited Successfully");
        })
        .catch((er) => {
          setShowForm(false);
          console.log(er);
          alert("Something went wrong! Try again");
        });
    } else {
      axios
        .post("http://localhost:5000/api/forms", { title: formTitle, fields })
        .then((res) => {
          setShowForm(false);
          console.log(res);
          getData();
          alert("Forms Submitted Successfully");
        })
        .catch((er) => {
          setShowForm(false);
          console.log(er);
          alert("Something went wrong! Try again");
        });
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormTitle(initialData.title);
      setFields(initialData.fields);
      const initialFormData = initialData.fields.reduce((acc, field) => {
        acc[field.id] = field.value || "";
        return acc;
      }, {});
      setFormData(initialFormData);
    }
  }, [initialData]);

  return (
    <>{editingFormView?( <div><h2>{formTitle}</h2>
     <div style={{ flex: 1, marginRight: "20px" }}>
          <h3>Field Information</h3>
          {fields.map((field) => renderFieldInfoCardView(field))}
        </div> </div>):(<div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {isEditingTitle ? (
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
          />
        ) : (
          <h2>{formTitle}</h2>
        )}
        <button
          onClick={() => setIsEditingTitle(!isEditingTitle)}
          style={{
            marginLeft: "10px",
            padding: 6,
            color: "white",
            backgroundColor: "#119311",
            border: "none",
          }}
        >
          {isEditingTitle ? "Save" : "Edit"}
        </button>
      </div>

      <div>
        <button
          style={{
            color: "#4e4ed9f6",
            padding: 8,
            border: "1px solid #4e4ed9f6",
            borderRadius: 5,
          }}
          onClick={() => setShowFieldOptions(!showFieldOptions)}
        >
          Add Input
        </button>
        {showFieldOptions && (
          <div style={{ display: "flex", marginTop: "10px", gap: 10 }}>
            <button style={style} onClick={() => addField("text")}>
              Text
            </button>
            <button style={style} onClick={() => addField("email")}>
              Email
            </button>
            <button style={style} onClick={() => addField("password")}>
              Password
            </button>
            <button style={style} onClick={() => addField("number")}>
              Number
            </button>
            <button style={style} onClick={() => addField("date")}>
              Date
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "20px",
          boxShadow: "0 6px 8px #bbb9b9ec",
          borderRadius: 2,
          padding: 4,
        }}
      >
        {/* Information Card */}
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h3>Field Information</h3>
          {fields.map((field) => renderFieldInfoCard(field))}
        </div>

        {/* Edit Card */}
        <div style={{ flex: 1 }}>
          <h3>Edit Field</h3>
          {fields.map((field) =>
            field.id === editingFieldId ? renderFieldEditCard(field) : null
          )}
        </div>
      </div>

      <form style={{ marginTop: "20px" }} onSubmit={handleSubmit}>
        {fields.length > 0 && <button type="submit">Submit</button>}
      </form>
    </div>)}</>
    
  );
}

export default DynamicForm;
