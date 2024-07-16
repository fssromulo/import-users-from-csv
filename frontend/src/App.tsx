import { debounce } from "lodash";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import UserCard from "./component/UserCard";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [csvFile, setCsvFile] = useState([] as File[]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchInput = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e?.target?.value);
    }, 1000),
    []
  );

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);

      let q = search.toString();
      let requestUrl = process.env.BACKEND_API_URL + "/users";
      if (q.length > 0) {
        requestUrl =
          process.env.BACKEND_API_URL + `/users?q=${encodeURIComponent(q)}`;
      }

      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      setError("");
      setUserList(json.data);
    } catch (error) {
      console.error(error);
      setUserList([]);
      if ("message" in (error as any)) {
        setError("No data available");
      }
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  const handleChangeContent = useCallback(
    async (content: File[]) => {
      setIsLoading(true);

      try {
        const file = content[0];
        const formData = new FormData();

        formData.append("name", file?.name ?? "file.csv");
        formData.append("file", file ?? "");

        const requestOptions = {
          method: "POST",
          body: formData,
        };

        const response = await fetch(
          process.env.BACKEND_API_URL + "/files",
          requestOptions
        );
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);

        if (response.status === 200) {
          alert(json);
        }
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [csvFile]
  );

  useMemo(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="App">
      <header className="searchBar">
        <div className="searchBarInput">
          <input
            type="text"
            data-testid="search-input"
            placeholder="Search"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearchInput(e)
            }
          />
        </div>
        <div className="searchBarUploadContainer">
          <input
            type="file"
            placeholder="search"
            accept="text/csv"
            ref={inputRef}
            style={{ visibility: "hidden" }}
            onChange={(e) => {
              const files = (e?.target?.files || []) as File[];

              if (!files || !files.length) return;
              if (!["text/csv"].includes(files[0].type)) {
                handleChangeContent([]);
                e.target.value = "";
                alert("Unsupported file type");
                return;
              }
              handleChangeContent(files);
            }}
          />

          <button
            className="uploadButton"
            data-testid="upload-button"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </button>
        </div>
      </header>

      <div className="dataContainer">
        {isLoading && <h1>Loading...</h1>}
        {!isLoading && error.length > 0 && <h1>{error}</h1>}

        {!isLoading &&
          error.length === 0 &&
          userList.map((item) => <UserCard item={item} />)}
      </div>
    </div>
  );
}

export default App;
