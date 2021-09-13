import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Header,
  Image,
  Loader,
  Pagination,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Heart from "react-animated-heart";

const App = () => {
  const [state, setState] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(15);

  const baseLink =
    "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=";
  const api = "U6Fd2ZKHd8USVamQNyAeSNaF4tujjb29b966oCJv";

  useEffect(() => {
    if (localStorage.getItem("myData") === null) {
      fetch(baseLink + api)
        .then((res) => res.json())
        .then((json) => {
          setHasLoaded(true);
          setTotalData(Math.ceil(json.latest_photos.length / 15));
          const mainData = json.latest_photos.map((v) => ({
            ...v,
            isLiked: false,
          }));
          setState(mainData);
          localStorage.setItem("myData", JSON.stringify(mainData));
        })
        .catch((err) => {
          console.log(err);
          setHasError(true);
        });
    } else {
      setState(JSON.parse(localStorage.getItem("myData")));
      setHasLoaded(true);
      setTotalData(Math.ceil(state.length / 15));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTotalData(Math.ceil(state.length / 15));

    setSliceStart(Math.ceil(0 + 15 * (activePage - 1)));
    setSliceEnd(Math.ceil(15 + 15 * (activePage - 1)));
  }, [activePage, sliceStart, sliceEnd, state]);

  const onPagChange = (e, pageInfo) => {
    setActivePage(pageInfo.activePage);
  };

  const onLikeChange = (e, c) => {
    const index = state.findIndex((a) => a.id === c.id);

    state[index].isLiked = !state[index].isLiked;
    setState([...state]);
    localStorage.setItem("myData", JSON.stringify(state));
  };

  return (
    <Container>
      <div className="spacetagram-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: "1rem",
            paddingTop: "1rem",
          }}
        >
          <Header as="h2" textAlign="center">
            Spacestagram
            <Header.Subheader>
              Brought to you by NASA's Mars Rover Photos API
            </Header.Subheader>
          </Header>
          <br />
        </div>
        <div className="ui equal width grid centered spacetagram-content">
          {!hasError ? (
            !hasLoaded ? (
              <div className="my-loader">
                <Loader active inline="centered" />
              </div>
            ) : (
              state.slice(sliceStart, sliceEnd).map((d) => (
                <div
                  key={d.id}
                  id={d.id}
                  style={{
                    paddingBottom: "1rem",
                    paddingTop: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <Card>
                    <Image src={d.img_src} wrapped ui={false} />

                    <Card.Content>
                      <Card.Header>{d.rover?.name}</Card.Header>
                      <Card.Meta>
                        <span className="date">{d.earth_date}</span>
                      </Card.Meta>
                      <Card.Description>
                        Photo taken on {d.earth_date}, This picture was taken
                        with a {d?.camera?.full_name}.
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra onClick={(e, c) => onLikeChange(e, d)}>
                      <div
                        className="spacetagram-like-container"
                        onClick={(e, c) => onLikeChange(e, d)}
                      >
                        <Heart
                          isClick={d.isLiked}
                          onClick={(e, c) => onLikeChange(e, d)}
                        />
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              ))
            )
          ) : (
            <div className="my-loader">Error</div>
          )}
        </div>

        {totalData > 1 && (
          <>
            <Pagination
              onPageChange={(a, b) => onPagChange(a, b)}
              defaultActivePage={1}
              totalPages={totalData}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
            />
            <Button
              animated="fade"
              onClick={() => {
                localStorage.removeItem("myData");
                window.location.reload();
              }}
            >
              <Button.Content visible>
                Reset Likes and Reload Page
              </Button.Content>
              <Button.Content hidden>Reload</Button.Content>
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default App;
