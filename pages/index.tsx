import Modal from "../components/Modal";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../components/Banner";
import CatRow from "../components/CatRow";
import Header from "../components/Header";
import { auth, db } from "../firebase";
import { settingMyMovie, setUser } from "../store/AuthSlice";
import { RootState } from "../store/store";
import { Movie } from "../typing";
import requests from "../utils/requests";
import { collection, onSnapshot } from "firebase/firestore";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type propType = {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
};

const Index = (props: propType) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modal.isModalShow);
  const myMovie = useSelector((state: RootState) => state.user.myMovie);
  const [isLoad, setisLoad] = useState<boolean>(true);
  const [id, setId] = useState<string | undefined>();

  useEffect(() => {
    if (id === undefined)
      return () => {
        null;
      };
    else {
      const getMovie = onSnapshot(
        collection(db, "customers", id, "myList"),
        (snapshot) => {
          dispatch(
            settingMyMovie(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            )
          );
          setisLoad(false);
        },
        (error) => {
          console.log(error);
        }
      );
      return () => {
        getMovie();
      };
    }
  }, [db, id]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      if (current) {
        router.push("/");
        dispatch(setUser({ ...current }));
        setId(current.uid);
      } else {
        router.push("/login");
        setisLoad(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  if (isLoad) {
    return <Loader/>;
  }

  return (
    <div className="relative bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <ToastContainer position="bottom-center" />
      <Header />
      <main className=" lg:px-[70px] px-[20px]">
        <Banner netflixOriginals={props.netflixOriginals} />
        <div>
          <CatRow categoryTitle="Top Rated" movies={props.topRated} />
          <CatRow categoryTitle="Trending Now" movies={props.trendingNow} />
          <CatRow categoryTitle="Actions" movies={props.actionMovies} />
          <CatRow categoryTitle="Comedy" movies={props.comedyMovies} />
          <CatRow categoryTitle="Horror" movies={props.horrorMovies} />
          <CatRow categoryTitle="Romance" movies={props.romanceMovies} />
          <CatRow categoryTitle="Documentries" movies={props.documentaries} />
          <CatRow categoryTitle="My List" movies={myMovie} />
        </div>
        {modal && <Modal />}
      </main>
      <Footer/>
    </div>
  );
};

export default Index;

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  };
};
