import { useDebounce } from "@react-hook/debounce";
import { useEffect } from "react";
import { useState } from "react";
import { getCharacters } from "../api/marvel";
import { GetCharactersResponse } from "../api/marvel.d";
import loading from "../assets/images/loading.gif";

export const Characters = () => {
  const [pagination, setPagination] = useState({ limit: 100, skip: 0 });
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
      <div className="loader">
        {!characterList && <img src={loading} alt="loading animation" />}
      </div>
    </div>
  );
};

export default Characters;
