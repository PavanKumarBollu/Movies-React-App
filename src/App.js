import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const errorMassageForNetWorkLost =
  "Can't Load the Movies Please Check Your Internet connection  and try Again..!";

const apiKey = "baa0df64";

export default function App() {
  const [query, setQuery] = useState("test");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectMovieId, setSelectMovieId] = useState(null);
  function handleSelectMovie(id) {
    setSelectMovieId((selectMovieId) => (selectMovieId === id ? null : id));
  }

  function handleMovieBackButton() {
    setSelectMovieId(null);
  }
  function handleAlreadyWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(
    function () {
      const fetchMovies = async function () {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
          );
          if (!res.ok) {
            throw new Error(errorMassageForNetWorkLost);
          }

          const data = await res.json();
          // console.log(data);

          if (data.Response === "False") {
            throw new Error(data.Error);
          }
          setMovies(data.Search);

          // console.log(data.Search);
        } catch (err) {
          setError(err.message);
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  // useEffect(funtion() {
  //   fetch("http://www.omdbapi.com/?apikey=baa0df64&s=pushpa")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMovies(data.Search);
  //       // console.log(data);
  //     })
  // }, []);

  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </Navbar>
      <Main>
        {/* <Box>{isLoading ? <Loading /> : <Movie movies={movies} />}</Box> */}
        <Box>
          {!isLoading && !error && (
            <Movie movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {isLoading ? <Loading /> : ""}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectMovieId ? (
            <SelectedMovie
              id={selectMovieId}
              onBackClick={handleMovieBackButton}
              onAlreadyWateched={handleAlreadyWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loading() {
  return <p className="loader">Loading....</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Movie({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() => {
            onSelectMovie(movie.imdbID);
          }}
        >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SelectedMovie({ id, onBackClick, onAlreadyWateched, watched }) {
  const [movie, setMovie] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isInWatchList = watched.map((movie) => console.log(movie.imdbID));

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      async function getMovie() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
        );
        const data = await res.json();
        // console.log(data);
        setIsLoading(false);
        setMovie(data);
      }
      getMovie();
    },
    [id]
  );

  function handleAlreadWatched() {
    const newWatchedMovie = {
      poster,
      title,
      imdbID: SelectedMovie,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAlreadyWateched(newWatchedMovie);
    onBackClick();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onBackClick}>
              &larr;{" "}
            </button>
            <img src={poster} alt={`movie ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐ </span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {true ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onsetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAlreadWatched}>
                      Already Watched..?
                    </button>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
