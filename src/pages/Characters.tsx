import TablePagination from "@material-ui/core/TablePagination";
import { useDebounce } from "@react-hook/debounce";
import { useEffect } from "react";
import { useState } from "react";
import { getCharacters } from "../api/marvel";
import { GetCharactersResponse } from "../api/marvel.d";
import loading from "../assets/images/loading.gif";
import notFound from "../assets/images/not_found.jpg";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      width: "95%",
      height: "95%",
    },
  })
);

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

  const classes = useStyles();

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
              <Tooltip title={character.description || "no description"}>
                <ImageListItem key={idx}>
                  <img
                    src={getThumbnailURL(character.thumbnail)}
                    alt={character.name}
                    style={{ cursor: "pointer" }}
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
          onRowsPerPageChange={(event) =>
            setPagination({
              page: pagination.page,
              skip: pagination.page * Number(event.target.value),
              limit: Number(event.target.value),
            })
          }
        />
      )}
    </>
  );
};

export default Characters;
