import React, { useState, useEffect } from "react";
import { fetchTopics } from "../../api";

const AccessSection = ({
  handleAccess = () => {},
  allowed,
  setAllowed,
  board,
  forum_name,
}) => {
  const [accessListVisible, setAccessListVisible] = useState(false);
  const [accessDropdownVisible, setAccessDropdownVisible] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState({
    text: "Select Access",
    icon: null,
    type: "",
  });
  const [startsWithValue, setStartsWithValue] = useState("");
  const [startsWithError, setStartsWithError] = useState("");
  const [onlyValue, setOnlyValue] = useState("");
  const [onlyError, setOnlyError] = useState("");
  const [startsWithValues, setStartsWithValues] = useState([]);
  const [onlyValues, setOnlyValues] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetchTopics(board, forum_name);

        // Assuming response.access is an array of objects with a user_id property
        setAllowed(response.access.map((item) => item.user_id));

        setStartsWithValues(
          response.access
            .map((item) => item.user_id)
            .filter((userId) => String(userId).length === 2)
        );

        setOnlyValues(
          response.access
            .map((item) => item.user_id)
            .filter((userId) => String(userId).length === 8)
        );

        console.log(allowed, startsWithValues, onlyValues);
      } catch (error) {
        console.error("Failed to load topics", error);
      }
    };

    loadTopics();
  }, [board, forum_name]);

  const handleAccessSelection = (type, text, icon) => {
    handleAccess(type);
    setSelectedAccess({ text, icon, type });
    setAccessDropdownVisible(false);
    setAccessListVisible(type === 0); // Automatically show access list if Private
  };

  useEffect(() => {
    console.log(
      "StartsWithValues:",
      startsWithValues,
      "OnlyValues:",
      onlyValues
    );
    if (startsWithValues.length === 0 && onlyValues.length === 0) {
      handleAccessSelection(1, "Public", "/asset/public_button.svg");
    } else {
      handleAccessSelection(0, "Private", "/asset/private_button.svg");
    }
  }, [startsWithValues, onlyValues]);

  const handleStartsWithChange = (e) => {
    setStartsWithValue(e.target.value);
  };

  const handleOnlyChange = (e) => {
    setOnlyValue(e.target.value);
  };

  const handleStartsWithSubmit = () => {
    const intValue = parseInt(startsWithValue, 10);
    if (isNaN(intValue) || intValue < 52 || intValue > 67) {
      setStartsWithError("Please enter a number between 52 and 67");
    } else {
      setStartsWithError("");
      setAllowed([...allowed, startsWithValue]);
      setStartsWithValues([...startsWithValues, startsWithValue]);
      setStartsWithValue("");
    }
  };

  const handleOnlySubmit = () => {
    const isValid =
      onlyValue.length === 8 &&
      parseInt(onlyValue.slice(0, 2), 10) >= 52 &&
      parseInt(onlyValue.slice(0, 2), 10) <= 67 &&
      onlyValue.slice(2, 4) === "01" &&
      /^[0-9]+$/.test(onlyValue.slice(4));

    if (!isValid) {
      setOnlyError('Must follow pattern: "52-67" + "01" + four digits');
    } else {
      setOnlyError("");
      setAllowed([...allowed, onlyValue]);
      setOnlyValues([...onlyValues, onlyValue]);
      setOnlyValue("");
    }
  };

  const removeStartsWithValue = (index) => {
    const valueToRemove = startsWithValues[index];
    setStartsWithValues(startsWithValues.filter((_, i) => i !== index));
    setAllowed(allowed.filter((value) => value !== valueToRemove));
  };

  const removeOnlyValue = (index) => {
    const valueToRemove = onlyValues[index];
    setOnlyValues(onlyValues.filter((_, i) => i !== index));
    setAllowed(allowed.filter((value) => value !== valueToRemove));
  };

  return (
    <div className="p-2">
      <h1 className="text-white font-bold  text-2xl pl-5 -mb-3">Access</h1>
      <div className="w-490 md:w-500 h-fit bg-lightorange mt-4 rounded-2xl py-4 px-10 flex flex-col items-center">
        <div className="justify-between flex w-full">
          <h2 className="text-xl self-start m-1 mt-4 font-bold text-blackorange">
            Access
          </h2>
          <div className="relative">
            <div
              className="bg-white w-56 h-14 rounded-3xl flex items-center justify-between p-2 cursor-pointer"
              onClick={() => setAccessDropdownVisible(!accessDropdownVisible)}
            >
              <div className="flex items-center">
                {selectedAccess.icon && (
                  <img
                    src={selectedAccess.icon}
                    className="w-10 h-10 mr-2 ml-2"
                    alt={selectedAccess.text}
                  />
                )}
                <p className="text-black font-bold text-[18px] ml-2">
                {selectedAccess.text}</p>
              </div>
              <button className="flex items-center justify-center">
                <img
                  src="/asset/down.svg"
                  alt="Down arrow"
                  className={`w-10 h-10 mr-1 transition-transform duration-200 ${
                    accessDropdownVisible
                      ? "transform scale-y-[-1]"
                      : "transform scale-y-[1]"
                  }`}
                />
              </button>
            </div>
            {accessDropdownVisible && (
              <div className="absolute right-0 mt-2 border border-gray-300 rounded-md bg-white shadow-lg w-56 z-10">
                <ul className="p-2">
                  <li
                    onClick={() =>
                      handleAccessSelection(
                        1,
                        "Public",
                        "/asset/public_button.svg"
                      )
                    }
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <img
                      src="/asset/public_button.svg"
                      className="w-10 h-10 mr-2"
                      alt="Public"
                    />
                    <span className="font-semibold">Public</span>
                  </li>
                  <li
                    onClick={() =>
                      handleAccessSelection(
                        0,
                        "Private",
                        "/asset/private_button.svg"
                      )
                    }
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <img
                      src="/asset/private_button.svg"
                      className="w-10 h-10 mr-2"
                      alt="Private"
                    />
                    <span className="font-semibold">Private</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex justify-end mt-2">
          {selectedAccess.type === 1 && (
            <p
              id="create-public"
              className="text-gray-700 font-bold text-sm text-center mr-6"
            >
              Anyone on the internet can
              <br />
              access and create posts
            </p>
          )}
          {selectedAccess.type === 0 && (
            <div>
              <p
                id="create-private"
                className="text-gray-700 font-bold text-sm mr-2"
              >
                Only people with access can open with the link
              </p>
              {accessListVisible && (
                <div className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg w-[230px] z-10 h-auto ml-auto">
                  <div className="w-fit h-fit rounded-2xl py-4 px-2 flex flex-col items-center">
                    <div className="mb-4 flex flex-row flex-wrap">
                      {startsWithValues.map((value, index) => (
                        <div
                          key={index}
                          className="w-fit pr-2 m-1 px-2 py-1 pl-4 rounded-md text-white bg-[#C26D49] flex items-center"
                        >
                          {value}-
                          <button
                            onClick={() => removeStartsWithValue(index)}
                            className="ml-2 text-white font-bold"
                          >
                            <img
                              src="/asset/cancelo.svg"
                              className="w-8 h-8"
                              alt="delete"
                              onMouseOver={(e) =>
                                (e.currentTarget.src =
                                  "/asset/cancelo(hover).svg")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.src = "/asset/cancelo.svg")
                              }
                            />
                          </button>
                        </div>
                      ))}
                      {onlyValues.map((value, index) => (
                        <div
                          key={index}
                          className="w-fit pr-2 m-1 px-2 py-1 pl-4 rounded-md text-white bg-[#C26D49] flex items-center"
                        >
                          {value}
                          <button
                            onClick={() => removeOnlyValue(index)}
                            className="ml-2 text-white font-bold"
                          >
                            <img
                              src="/asset/cancelo.svg"
                              className="w-8 h-8"
                              alt="delete"
                              onMouseOver={(e) =>
                                (e.currentTarget.src =
                                  "/asset/cancelo(hover).svg")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.src = "/asset/cancelo.svg")
                              }
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col w-full m-2">
                      <div className="flex flex-row items-center justify-between w-full">
                        <p className="font-semibold text-gray1 ml-1">
                          Starts with
                        </p>
                        <div className="w-24 h-8 border-black border-2 rounded-md flex items-center mr-2">
                          <input
                            type="number"
                            value={startsWithValue}
                            onChange={handleStartsWithChange}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleStartsWithSubmit()
                            }
                            className="w-full h-full text-center outline-none"
                            placeholder="52-67"
                          />
                        </div>
                      </div>
                      {startsWithError && (
                        <p className="text-redselect text-[11px]">
                          {startsWithError}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col w-full m-2">
                      <div className="flex flex-row items-center justify-between w-full">
                        <p className="font-semibold text-gray1 ml-12">Only</p>
                        <div className="w-24 h-8 border-black border-2 rounded-md flex items-center mr-2">
                          <input
                            type="text"
                            value={onlyValue}
                            onChange={handleOnlyChange}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleOnlySubmit()
                            }
                            className="w-full h-full text-center outline-none"
                            placeholder="6601xxxx"
                          />
                        </div>
                      </div>
                      {onlyError && (
                        <p className="text-redselect text-[11px] text-right mr-3">
                          {onlyError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessSection;
