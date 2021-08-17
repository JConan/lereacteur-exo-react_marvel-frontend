import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
} from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getCharacterComics } from "../api/marvel";
import { GetCharacterComics } from "../api/marvel.d";
import Loader from "../components/Loader";
import { getThumbnailURL } from "../helpers/tools";

import "./CharacterComics.scss";

export const CharacterComics = () => {
  const params = useParams<{ characterId: string }>();
  const [characterData, setCharacterData] = useState<GetCharacterComics>();

  useEffect(() => {
    getCharacterComics(params.characterId).then((data) =>
      setCharacterData(data)
    );
  }, []);

  return characterData ? (
    <div className="container">
      <div className="profil">
        <img
          className="photo"
          src={getThumbnailURL(characterData.thumbnail)}
          alt=""
        />
        <div className="detail">
          <div>Name: {characterData.name}</div>
          <div>
            Description: {characterData.description || "no description"}
          </div>
        </div>
      </div>
      <div className="comics">
        <ImageList cols={4} rowHeight={180}>
          {characterData.comics.map((comic, idx) => (
            <Tooltip title={comic.description || "no description"} key={idx}>
              <ImageListItem>
                <img
                  src={getThumbnailURL(comic.thumbnail)}
                  alt={comic.title}
                  style={{ cursor: "pointer" }}
                  loading="lazy"
                />
                <ImageListItemBar title={comic.title} />
              </ImageListItem>
            </Tooltip>
          ))}
        </ImageList>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CharacterComics;
