import { Checkbox, Collapse } from "antd";
import React, { useState } from "react";

const { Panel } = Collapse;

function CheckBox(props) {
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    // 누른 것의 index를 구하고
    const currentIndex = checked.indexOf(value);

    // 전체 checked 된 state에서 현재 누른 checkbox 가 이미있다면
    const newChecked = [...checked];

    // state 넣어준다.
    if (currentIndex === -1) {
      newChecked.push(value);
      // 빼준다
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };
  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => {
            handleToggle(value._id);
          }}
          checked={checked.indexOf(value._id) === -1 ? false : true}
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));
  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Continents" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
