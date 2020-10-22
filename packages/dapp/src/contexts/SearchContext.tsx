import { search, SearchResult } from 'graphql/search';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

export type SearchContextType = {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  result: SearchResult | undefined;
  fetching: boolean;
};

export const SearchContext = createContext<SearchContextType>({
  search: '',
  setSearch: () => undefined,
  result: undefined,
  fetching: false,
});

export const SearchContextProvider: React.FC = ({ children }) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SearchResult | undefined>();

  useEffect(() => {
    if (query) {
      setFetching(true);
      search(query).then(res => {
        setResult(res);
        setFetching(false);
      });
    } else {
      setResult(undefined);
    }
  }, [query, setQuery]);

  return (
    <SearchContext.Provider
      value={{ search: query, setSearch: setQuery, fetching, result }}
    >
      {children}
    </SearchContext.Provider>
  );
};
