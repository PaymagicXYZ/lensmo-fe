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
      {/* Workaround because I couldn't get the value in the <Select> below to work. */}
      {/* Mike, feel free to fix and remove if you can.  */}
      <input
        type="text"
        id="userId2"
        value={selectedOption ? selectedOption.value : ""}
        placeholder="Search…"
        class="hidden input input-bordered w-full"
      />
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
        aria-label={selectedOption.value}
        onChange={(option: any) => handleChange(option)}
      />
    </Fragment>
  );
}
