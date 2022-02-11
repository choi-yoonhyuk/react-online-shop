import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";

function CartPage(props) {
  const dispatch = useDispatch();

  const [Total, setTotal] = useState(0);

  useEffect(() => {
    let cartItems = [];
    // 리덕스 User State안에 cart안에 상품이 들어있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
          (response) => {
            calculateTotal(response.payload);
          }
        );
      }
    }
  }, [props.user.userData]);

  let calculateTotal = (cartDetatil) => {
    let total = 0;

    cartDetatil.map((item) => {
      console.log(item.price, "*", item.quantity);
      total = total + parseInt(item.price, 10) * item.quantity;
      console.log(total);
    });

    setTotal(total);
  };
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>나의 장바구니</h1>
      <div>
        <UserCardBlock products={props.user.cartDetail} />
      </div>
      <div style={{ marginTop: "3rem" }}>
        <h2>총합 : ${Total}</h2>
      </div>
    </div>
  );
}

export default CartPage;
