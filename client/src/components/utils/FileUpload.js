import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Icon } from "antd";
import axios from "axios";

function FileUpload(props) {
  const [images, setImages] = useState([]);
  const dropHandler = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/fomr-data" },
      // 헤더에 어떠한 파일인지 콘텐트 타입을 정의해줘서 리퀘스트를 에러없게 받게해준다.
    };
    formData.append("file", files[0]);
    // 올리는 파일에 대한 정보가 들어감

    axios.post("/api/product/image", formData, config).then((response) => {
      if (response.data.success) {
        setImages([...images, response.data.filePath]);
        // 이미지 추가
        props.refreshFunction([...images, response.data.filePath]);
      } else {
        alert("파일을 저장하는데 실패했습니다.");
      }
    });
  };

  const deleteHandler = (image) => {
    const currentIndex = images.indexOf(image);
    // 현재 인덱스

    let newImages = [...images];
    // 기존 이미지 배열 복사
    newImages.splice(currentIndex, 1);
    // 기존 인덱스에서 현재 인덱스 제거

    setImages(newImages);
    // 인덱스를 제거한 배열
    props.refreshFunction(newImages);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>
      <div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflowX: "scroll",
        }}
      >
        {images.map((image, index) => (
          <div
            onClick={() => {
              deleteHandler(image);
            }}
            key={index}
          >
            <img
              style={{ minWidth: "300px", width: "300px", height: "240px" }}
              src={`https://protected-depths-12640.herokuapp.com/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
