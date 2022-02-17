import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy,
} from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Empty, Result } from "antd";
import Paypal from "../../utils/Paypal";

function CartPage(props) {
  const dispatch = useDispatch();

  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);

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

  // 상픔 계산

  let calculateTotal = (cartDetatil) => {
    let total = 0;

    cartDetatil.map((item) => {
      console.log(item.price, "*", item.quantity);
      total = total + parseInt(item.price, 10) * item.quantity;
      console.log(total);
    });

    setTotal(total);
    setShowTotal(true);
  };

  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      console.log(response.payload.productInfo.length);
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  const transactionSuccess = (data) => {
    console.log(data);

    dispatch(
      onSuccessBuy({
        paymentData: data,
        cartDetail: props.user.cartDetail,
      })
    ).then((response) => {
      if (response.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
    });
  };
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>나의 장바구니</h1>
      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          removeItem={removeFromCart}
        />
      </div>

      {ShowTotal ? (
        <div style={{ marginTop: "3rem" }}>
          <h2>총합 : ${Total}</h2>
        </div>
      ) : ShowSuccess ? (
        <Result status="success" title="결제 성공" />
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}
      {ShowTotal && <Paypal total={Total} onSuccess={transactionSuccess} />}
    </div>
  );
}

export default CartPage;
