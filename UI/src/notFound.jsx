import "./App.scss"
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <h2>Sorry Notfound 😀</h2>
    </div>
  );
}