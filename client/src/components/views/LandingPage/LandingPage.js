import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Card, Row, Carousel } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSilder";
import CheckBox from "./Sections/CheckBox";
import { continents, price } from "./Sections/Datas";
import RadioBox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품을 가져오는데 실패하였습니다");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;

    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(skip);
  };

  const renderCards = products.map((product, index) => {
    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <Card
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };

    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
        console.log(array);
      }
    }
    return array;
  };

  const handleFilters = (filters, category) => {
    console.log(filters, category);
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    if (category === "price") {
      let priceValues = handlePrice(filters);

      newFilters[category] = priceValues;
    }

    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>Let's Shopping Anywhere!</h2>
      </div>
      {/* Filter */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <CheckBox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>

      {/* Cards */}

      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />
      {postSize >= Limit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
