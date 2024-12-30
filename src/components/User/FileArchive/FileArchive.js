import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../UserContext";
import { fetchUserData, downloadFile } from "../../../api";

const FileArchive = ({
  isDropdownVisible,
  toggleDropdown,
  handleSortSelection,
}) => {
  const { user, status } = useContext(UserContext);
  const id = status === "se" ? user.sid : user.aid;
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [files, setFiles] = useState([]);
  const [filteredFile, setFilteredFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFileTypes, setFilteredFileTypes] = useState([]);

  const fileTypes = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "mp4",
    "mp3",
    "wav",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "py",
    "txt",
    "c",
    "cpp",
    "h",
    "js",
    "java",
    "html",
    "jsx",
    "css",
    "rs",
    "go",
    "rb",
    "php",
    "sql",
    "xml",
    "json",
    "yaml",
    "md",
    "zip",
    "rar",
    "tar",
    "7z",
  ];

  useEffect(() => {
    if (!id) {
      console.log("Invalid ID, skipping fetch.");
      return;
    }

    const fetchFiles = async () => {
      try {
        const response = await fetchUserData(id);
        setFiles(response.files || []);
        setFilteredFile(response.files || []);
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [id]);

  useEffect(() => {
    // Filter file types based on the search term
    if (searchTerm) {
      setFilteredFileTypes(
        fileTypes.filter((type) =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredFileTypes(fileTypes);
    }
  }, [searchTerm, fileTypes]);

  const handleFileTypeClick = (type) => {
    setSelectedFileType(type);
    setFilteredFile(files.filter((file) => file.extension === type));
    toggleDropdown();
  };

  const resetSelection = () => {
    setSelectedFileType(null);
    setFilteredFile(files);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mt-6 ml-1 md:ml-4 pr-5 md:pr-0 pb-44">
        <div className="flex flex-col md:flex-row items-center mt-12 ml-4 md:ml-10 gap-4 md:gap-6">
          <div className="text-black text-2xl md:text-4xl font-bold whitespace-nowrap">
            File Archive
          </div>
          <div className="bg-gray-400 h-[3px] w-full md:w-[940px] flex-shrink-0" />
        </div>

        <div
          className="w-full md:w-[1140px] rounded-lg bg-white mx-auto mt-10 ml-4 md:ml-10 md:pr-7 h-auto md:h-[130vh] mb-10 pb-10"
          style={{
            boxShadow:
              "inset 0 1px 8px rgba(0, 0, 0, 0.2), inset 0 -4px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="ml-2 md:ml-[50px] flex gap-2 relative mt-8">
            {selectedFileType ? (
              <>
                <div className="ml-6 md:-ml-3 mt-8 md:mt-6 flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-tl-lg rounded-bl-lg hover:bg-[#B3D7EE]">
                  <span className="text-base md:text-lg font-semibold">
                    {selectedFileType}
                  </span>
                  <button
                    onClick={toggleDropdown}
                    className="text-black font-semibold px-1 rounded transition-colors"
                  >
                    <img
                      src="/asset/triangle.svg"
                      alt="Dropdown"
                      className="w-[12px] md:w-[15px] h-[12px] md:h-[15px] ml-[5px] md:ml-[10px]"
                    />
                  </button>
                </div>
                <button
                  onClick={resetSelection}
                  className="-ml-1 md:-ml-1 mt-8 md:mt-6 text-black font-bold px-4 py-2 bg-blue-100 rounded transition-colors rounded-bl-none rounded-tl-none rounded-br-lg rounded-tr-lg hover:bg-[#B3D7EE]"
                >
                  X
                </button>
              </>
            ) : (
              <div
                onClick={toggleDropdown}
                className="ml-6 md:-ml-3 mt-8 md:mt-6 flex items-center bg-white px-4 py-2 rounded-lg cursor-pointer w-24 md:w-[120px] border-[1px] border-[#434746] hover:bg-[#F0F0F0] transition-colors"
              >
                <span className="text-black font-semibold ml-2 text-sm md:text-base">
                  Type
                </span>
                <img
                  src="/asset/triangle.svg"
                  alt="Dropdown"
                  className="w-[12px] md:w-[15px] h-[12px] md:h-[15px] ml-auto"
                />
              </div>
            )}
            <div
              className={`ml-6 md:-ml-3 top-[25px] absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-[50px] z-10 transition-all duration-100 ${
                isDropdownVisible
                  ? "max-h-80 opacity-100 overflow-auto"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <input
                type="text"
                placeholder="Search file type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border-b border-gray-300 w-full"
              />
              <ul className="p-4 text-left w-[140px] md:w-[180px]">
                {filteredFileTypes.map((type) => (
                  <li
                    key={type}
                    onClick={() => handleFileTypeClick(type)}
                    className="flex items-center whitespace-nowrap py-2 px-2 cursor-pointer hover:bg-gray-200 transition-colors w-full"
                  >
                    <img
                      src={`/asset/${type}.png`}
                      alt={`${type} icon`}
                      className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4"
                    />
                    <span className="text-sm md:text-base">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6 ml-6 md:pr-0 pr-6">
            {filteredFile.length > 0 ? (
              filteredFile.map((file) => (
                <div
                  key={file.file_id}
                  className="flex items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => downloadFile(file.file_id)}
                  style={{ maxWidth: "100%" }}
                >
                  <img
                    src={`/asset/${file.extension || "default"}.png`}
                    alt={`${file.extension || "File"} Icon`}
                    className="w-6 h-6 md:w-8 md:h-8 mr-3"
                  />
                  <div className="flex-grow">
                    <p
                      className="text-sm md:text-lg font-semibold break-words"
                      style={{
                        overflowWrap: "break-word",
                        wordBreak: "break-all", 
                      }}
                    >
                      {file.filename}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="ml-5 top-[0px]">No files available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileArchive;
