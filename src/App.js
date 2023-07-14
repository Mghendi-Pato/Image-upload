import { useEffect, useState } from "react";
import "./base.css";
import { Image } from "cloudinary-react";

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
    loadImages();
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

  //MANAGE IMAGGE VIEWING
  const [imageIds, setImageIds] = useState([]);

  const loadImages = async () => {
    try {
      const res = await fetch("/images");
      const data = await res.json();
      setImageIds(data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteImage = async (image) => {
    console.log(JSON.stringify(image));
    try {
      const res = await fetch("/images", {
        method: "DELETE",
        body: JSON.stringify({ image }),
        headers: { "content-type": "application/json" },
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);
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
          <img src={selectedFile} style={{ height: "100px" }} alt="selected" />
        )}
        <hr />

        {/* VIEW IMAGES */}
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
        >
          <h1 className="title">Uploaded images</h1>
          {imageIds &&
            imageIds.map((imageId, index) => (
              <div
                key={index}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <Image
                  style={{ margin: "5px" }}
                  cloudName="dodxjpwfu"
                  publicId={imageId}
                  width="150"
                  crop="scale"
                />
                <button
                  className="btn"
                  style={{
                    margin: "5px",
                    padding: "5px",
                    background: "red",
                    height: "30px",
                    fontSize: "9px",
                  }}
                  onClick={() => deleteImage(imageId)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
