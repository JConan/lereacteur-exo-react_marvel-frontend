import TablePagination from "@material-ui/core/TablePagination";
import { useDebounce } from "@react-hook/debounce";
import { useEffect } from "react";
import { useState } from "react";
import { getCharacters } from "../api/marvel";
import { GetCharactersResponse } from "../api/marvel.d";
import loading from "../assets/images/loading.gif";
import notFound from "../assets/images/not_found.png";
import qs from "qs";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

import Tooltip from "@material-ui/core/Tooltip";
import { useHistory, useLocation } from "react-router-dom";

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

  const [pagination, setPagination] = useState({
    limit: (queryParams.limit && Number(queryParams.limit)) || 100,
    skip: 0,
    page: 0,
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
    history.push({
      pathname: "/characters",
      search: "?" + qs.stringify(newPagination),
    });
  };

  const getThumbnailURL = (data: { path: string; extension: string }) => {
    if (data.path.match(/(image_not_available|4c002e0305708)$/i))
      return notFound;
    return data.path + "." + data.extension;
  };

  return (
    <>
      {!characterList && (
        <div className="loader">
          <img src={loading} alt="loading animation" />
        </div>
      )}
      {characterList && (
        <div className={classes.root}>
          <ImageList cols={5} rowHeight={180}>
            {characterList.results.map((character, idx) => (
              <Tooltip
                title={character.description || "no description"}
                key={idx}
              >
                <ImageListItem>
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
          onRowsPerPageChange={(event) => {
            setPagination({
              page: pagination.page,
              skip: pagination.page * Number(event.target.value),
              limit: Number(event.target.value),
            });
            updateQueryParams({ limit: event.target.value });
          }}
        />
      )}
    </>
  );
};

export default Characters;
