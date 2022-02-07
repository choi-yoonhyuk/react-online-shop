import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";
import axios from "axios";

const { TextArea } = Input;

const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadProductPage(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [continent, setContinent] = useState(1);
  const [images, setImages] = useState([]);

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value);
  };

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value);
  };

  const continentChangeHandler = (event) => {
    setContinent(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = () => {
    if (!title || !description || !price || !continent || images.length === 0) {
      return alert("값을 모두 넣어주세요");
    }

    // 서버에 채운 값들을 request로 보낸다

    const body = {
      // 현재 로그인된 사람의 ID
      writer: props.user.userData._id,
      title: title,
      description: description,
      price: price,
      images: images,
      continents: continent,
    };

    axios.post("/api/product", body).then((response) => {
      if (response.data.success) {
        alert("상품 업로드 성공");
        props.history.push("/");
      } else {
        alert("상품 업로드 실패");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>여행상품업로드</h2>
      </div>
      <Form onSubmit={submitHandler}>
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={description} />
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" onChange={priceChangeHandler} value={price} />
        <br />
        <br />
        <select onChange={continentChangeHandler} value={continent}>
          {Continents.map((item) => (
            <option key={item.key} value={item.value}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="submit" onClick={submitHandler}>
          확인
        </Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
