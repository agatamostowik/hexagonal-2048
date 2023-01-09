import { useSearchParams } from "react-router-dom";
import { Game } from "../Game/Game";
import { Form } from "../Form/Form";

export const App = () => {
  let [searchParams] = useSearchParams();

  if (searchParams.toString()) {
    const params = new URL(document.location).searchParams;

    const radius = parseInt(params.get("radius"));
    const hostname = params.get("hostname");

    console.log("hostname:", hostname);

    return <Game radius={radius} hostname={hostname} />;
  } else {
    return <Form />;
  }
};
