import TablePagination from "@material-ui/core/TablePagination";
import { useDebounce } from "@react-hook/debounce";
import { useEffect } from "react";
import { useState } from "react";
import { getCharacters } from "../api/marvel";
import { GetCharactersResponse } from "../api/marvel.d";
import loading from "../assets/images/loading.gif";

export const Characters = () => {
  const [pagination, setPagination] = useState({
    limit: 100,
    skip: 0,
    page: 0,
  });
  const [characterName, setCharacterName] = useDebounce("", 300);
  const [characterList, setCharacterList] = useState<
    GetCharactersResponse | undefined
  >(undefined);

  useEffect(() => {
    const params: {
      limit?: number;
      skip?: number;
      name?: string;
    } = { ...pagination };
    characterName.length > 0 && (params.name = characterName);

    getCharacters(params).then((data) => setCharacterList(data));
  }, [pagination, characterName]);

  return (
    <div className="Characters">
      {!characterList && (
        <div className="loader">
          <img src={loading} alt="loading animation" />
        </div>
      )}
      {characterList && (
        <TablePagination
          component="div"
          count={characterList.count}
          page={pagination.page}
          onPageChange={(event, pageNumber) => {
            setPagination({
              page: pageNumber,
              skip: pageNumber * pagination.limit,
              limit: pagination.limit,
            });
          }}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={(event) =>
            setPagination({
              page: pagination.page,
              skip: pagination.page * Number(event.target.value),
              limit: Number(event.target.value),
            })
          }
        />
      )}
    </div>
  );
};

export default Characters;
