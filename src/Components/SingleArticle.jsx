import { useEffect, useState } from "react";
import { getSingleArticleFromApi } from "./Utils/api";
import { useParams } from "react-router-dom";
import { increaseVotes } from "./Utils/api";
import DisplayComments from "./DisplayComments";

export const SingleArticle = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { article_id } = useParams();
  const [article, setArticle] = useState({});
  const [err, setErr] = useState(null);
  const [votes, setVotes] = useState(article.votes);

  useEffect(() => {
    if (!article_id) return;
    getSingleArticleFromApi(article_id)
      .then((articlesApi) => {
        setArticle(articlesApi);
      })
      .then(() => setIsLoading(false))

      .catch((err) => {
        setErr(`Not found`);
      });
  }, [votes, article_id]);

  const UpvoteHandler = (e, increment) => {
    setArticle((currArticle) => {
      return { ...currArticle, votes: currArticle.votes + 1 };
    });
    setErr(null);
    increaseVotes(article_id, increment)
      .then((res) => {
        setVotes(res.votes);
      })
      .catch((err) => {
        setArticle((currArticle) => {
          return { ...currArticle, votes: currArticle.votes - 1 };
        });
        setErr("Something went wrong, please try again.");
        return <p> {err.response}</p>;
      });
  };

  const DownvoteHandler = (e, increment) => {
    setArticle((currArticle) => {
      return { ...currArticle, votes: currArticle.votes - 1 };
    });
    setErr(null);
    increaseVotes(article_id, increment)
      .then((res) => {
        setVotes(res.votes);
      })
      .catch((err) => {
        setArticle((currArticle) => {
          return { ...currArticle, votes: currArticle.votes + 1 };
        });
        setErr("Something went wrong, please try again.");
        return <p> {err.response}</p>;
      });
  };

  if (!isLoading && !article) return <p>"Error404"</p>;
  if (err) return <p>{err}</p>;
  if (isLoading) return <h1> Loading...</h1>;
  return (
    <div className="articleBody">
      <h2>{article.title}</h2>
      <p>{article.body}</p>
      <p>Article author: {article.author}</p>
      <p>Votes: {article.votes}</p>

      <button
        className="upvote__Button"
        onClick={(e) => {
          UpvoteHandler(e, 1);
        }}
      >
        ❤️
      </button>
      <button
        className="downvote__Button"
        onClick={(e) => {
          DownvoteHandler(e, -1);
        }}
      >
        💔
      </button>

      <DisplayComments />
    </div>
  );
};

export default SingleArticle;
