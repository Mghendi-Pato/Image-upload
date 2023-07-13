import { useState } from "react";
import "./base.css";
function App() {
  //Set state of the image
  const [selectedFile, setSelectedFile] = useState("");

  //Set preview functionality
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedFile(reader.result);
    };
  };

  //Handle the image selection
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  //Hanlde the submitting
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadImage(selectedFile);
  };

  //Handle image upload on submission
  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div style={{ margin: "10px" }}>
        <h1>File upload</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="image"
            onChange={handleFileInputChange}
            className="form-input"
          />
          <button className="btn" type="submit" style={{ margin: "5px" }}>
            Upload
          </button>
        </form>
        {selectedFile && (
          <img src={selectedFile} style={{ height: "300px" }} alt="selected" />
        )}
      </div>
    </>
  );
}

export default App;
