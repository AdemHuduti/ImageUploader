import React, { Component } from "react";
import axios from "axios";
import "./App.css";
const BASE_URL = "http://localhost:8000/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageUrls: [],
      message: ""
    };
  }
  selectImages = event => {
    let images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/));
    let message = `${images.length} valid image(s) selected`;
    this.setState({ images, message });
  };

  uploadImages = () => {
    const uploaders = this.state.images.map(image => {
      const data = new FormData();
      data.append("image", image, image.name);

      // ispod ovoga probaj uraditi progressBar
      return axios.post(BASE_URL + "upload", data).then(response => {
        this.setState({
          imageUrls: [response.data.imageUrl, ...this.state.imageUrls]
        });
      });
    });

    // Once all the files are uploaded
    axios
      .all(uploaders)
      .then(() => {
        console.log("done");
      })
      .catch(err => alert(err.message));
  };

  showImages = () => {
    const { imageUrls } = this.state;
    return imageUrls.map((url, i) => {
      return (
        <div className="col-md-3" key={i}>
          <img
            src={BASE_URL + url}
            className="w-100"
            alt="not available"
          />
        </div>
      )
    });
  };

  render() {
    return (
      <div className="container ">
        <h1 className="text-center">Image Uploader</h1>
        <div className="row">
          <div className="col-sm-4 ">
            <input type="file" onChange={this.selectImages} multiple />
          </div>
          <p className="text-info">{this.state.message}</p>
          <div className="col-sm-4">
            <button
              className="btn btn-primary"
              value="Submit"
              onClick={this.uploadImages}
            >
              Submit
            </button>
          </div>
          {this.showImages()}
        </div>
      </div>
    );
  }
}
export default App;
