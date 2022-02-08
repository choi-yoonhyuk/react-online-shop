import { Collapse } from "antd";

import { Radio } from "antd";
import React, { useState } from "react";

const { Panel } = Collapse;

function RadioBox(props) {
  const [Value, setValue] = useState(0);
  const renderRadioBox = () =>
    props.list &&
    props.list.map((value, index) => (
      <Radio key={index} value={value._id}>
        {value.name}
      </Radio>
    ));

  const handleChange = (event) => {
    setValue(event.target.value);
    props.handleFilters(event.target.value);
  };
  return (
    <div>
      <div>
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Price" key="1">
            <Radio.Group onChange={handleChange} value={Value}>
              {renderRadioBox()}
            </Radio.Group>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default RadioBox;
