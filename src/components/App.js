import React, { Component } from "react";
import Progress from "./Progress";
import axios from "axios";
import "../App.css";
const BASE_URL = "http://localhost:8000/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageUrls: [],
      message: "",
      loaded: 0
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
    return this.state.images.map(image => {
      const data = new FormData();
      data.append("image", image, image.name);

      let config = {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      };

      return axios.post(BASE_URL + "upload", data, config).then(response => {
        this.setState({
          imageUrls: [response.data.imageUrl, ...this.state.imageUrls]
        });
      });
    });
  };

  showImages = () => {
    const { imageUrls } = this.state;
    return imageUrls.map((url, i) => {
      return (
        <div className="col-md-3 mt-2 mb-2 parent" key={i}>
          <div className="card">
            <img src={BASE_URL + url} className="w-100 card-img=top" alt="img_names" />
          </div>

          <button className="btn btn-danger btn-sm" onClick={() => this.removeItem(i)}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      );
    });
  };

  removeItem(item) {
    this.setState({
      imageUrls: this.state.imageUrls.filter((x, i) => i !== item)
    });
  }

  render() {
    return (
      <div className="container ">
        <h1 className="text-center">Image Uploader</h1>
        <Progress percentage={this.state.loaded} />
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
