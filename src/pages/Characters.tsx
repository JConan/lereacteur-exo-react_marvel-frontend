import TablePagination from "@material-ui/core/TablePagination";
import { useDebounce } from "@react-hook/debounce";
import { useEffect } from "react";
import { useState } from "react";
import { getCharacters } from "../api/marvel";
import { GetCharactersResponse } from "../api/marvel.d";
import qs from "qs";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

import Tooltip from "@material-ui/core/Tooltip";
import { useHistory, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { getThumbnailURL } from "../helpers/tools";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      padding: "5px",
    },
    imageList: {
      width: "95%",
      height: "95%",
    },
  })
);

interface Pagination {
  limit?: string;
  skip?: string;
  page?: string;
}

export const Characters = () => {
  const history = useHistory();
  const queryParams = qs.parse(useLocation().search.slice(1)) as Pagination;
  const limit = (queryParams.limit && Number(queryParams.limit)) || 100;
  const page = (queryParams.page && Number(queryParams.page)) || 0;

  const [pagination, setPagination] = useState({
    limit,
    page,
    skip: page * limit,
  });

  console.log({ queryParams, pagination });

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

  const classes = useStyles();

  const updateQueryParams = (pagination: Pagination) => {
    const newPagination = { ...queryParams, ...pagination };
    if (Number(newPagination.limit) >= 100) delete newPagination.limit;
    if (newPagination.page === "0") delete newPagination.page;
    delete newPagination.skip;
    history.push({
      pathname: "/characters",
      search: "?" + qs.stringify(newPagination),
    });
  };

  return (
    <>
      {!characterList && <Loader />}
      {characterList && (
        <>
          <div className={classes.root}>
            <ImageList cols={5} rowHeight={180}>
              {characterList.results.map((character, idx) => (
                <Tooltip
                  title={character.description || "no description"}
                  key={idx}
                >
                  <ImageListItem
                    onClick={() => {
                      history.push(`/comics/${character._id}`);
                    }}
                  >
                    <img
                      src={getThumbnailURL(character.thumbnail)}
                      alt={character.name}
                      style={{ cursor: "pointer" }}
                      loading="lazy"
                    />
                    <ImageListItemBar title={character.name} />
                  </ImageListItem>
                </Tooltip>
              ))}
            </ImageList>
          </div>
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
              updateQueryParams({
                page: String(pageNumber),
                skip: String(pageNumber * pagination.limit),
              });
            }}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={(event) => {
              setPagination({
                page: pagination.page,
                skip: pagination.page * Number(event.target.value),
                limit: Number(event.target.value),
              });
              updateQueryParams({ limit: event.target.value });
            }}
          />
        </>
      )}
    </>
  );
};

export default Characters;
