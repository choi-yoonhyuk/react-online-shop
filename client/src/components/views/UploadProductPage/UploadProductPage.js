import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";

const { TextArea } = Input;

const Continents = [
  { key: 1, value: "디지털기기" },
  { key: 2, value: "생활가전" },
  { key: 3, value: "가구/인테리어" },
  { key: 4, value: "생활/가공식품" },
  { key: 5, value: "도서/티켓/음반" },
  { key: 6, value: "스포츠/레저" },
  { key: 7, value: "의류/잡화" },
  { key: 8, value: "게임/취미" },
  { key: 9, value: "기타" },
];

function UploadProductPage(props) {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);
  const [Images, setImages] = useState([]);

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value);
  };

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value);
  };

  const priceChangeHandler = (event) => {
    console.log(event.currentTarget.value);
    setPrice(event.currentTarget.value);
  };

  const continentChangeHandler = (event) => {
    console.log(event.currentTarget.value);
    setContinent(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!Title || !Description || !Price || !Continent || Images.length === 0) {
      return alert(" 모든 값을 넣어주셔야 합니다.");
    }

    // 서버에 채운 값들을 request로 보낸다

    const body = {
      // 현재 로그인된 사람의 ID
      writer: props.user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      continents: Continent,
    };

    console.log(body);

    Axios.post("/api/product", body).then((response) => {
      if (response.data.success) {
        alert("상품 업로드에 성공 했습니다.");
        props.history.push("/");
      } else {
        alert("상품 업로드에 실패 했습니다.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>상품업로드</h2>
      </div>
      <Form onSubmit={submitHandler}>
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description} />
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" onChange={priceChangeHandler} value={Price} />
        <br />
        <br />
        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map((item) => (
            <option key={item.key} value={item.key}>
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
