import React, { Fragment, useState } from "react";

import Select from "react-select";
import { userIdOptions, UserIdOption } from "./data";

export default function SingleSelect() {
  const [selectedOption, setSelectedOption] = useState<UserIdOption>(
    userIdOptions[0]
  );
  // const [selectedValue, setSelectedValue] = useState<UserIdOption>();

  const handleChange = (option: UserIdOption) => {
    setSelectedOption(option);
    // setSelectedValue(option.value);
  };

  return (
    <Fragment>
      <Select
        className="basic-single input w-full"
        isDisabled={false}
        isLoading={false}
        isClearable={false}
        isRtl={false}
        isSearchable={true}
        inputId="userId"
        options={userIdOptions}
        autoFocus={true}
        placeholder="Search..."
        value={selectedOption}
        onChange={(option: any) => handleChange(option)}
      />
    </Fragment>
  );
}
