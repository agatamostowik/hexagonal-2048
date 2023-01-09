import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Form.css";

export const Form = () => {
  const [radius, setRadius] = useState(2);
  const [hostname, setHostname] = useState(
    "hexagonal-2048-server-production.up.railway.app"
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const serverOptions = [
    { hostname: "hexagonal-2048-server-production.up.railway.app" },
    { hostname: "localhost" },
  ];

  const changeRadius = (event) => {
    setRadius(event.target.value);
  };

  const changeHostname = (event) => {
    setHostname(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const paramsObj = { hostname: hostname, radius: radius };
    const searchParams = new URLSearchParams(paramsObj);

    setSearchParams(searchParams.toString());
  };

  return (
    <form className="form_container" onSubmit={handleSubmit}>
      <div className="form_paragraph">
        <label htmlFor="hostname">Hostname</label>
        <select id="hostname" value={hostname} onChange={changeHostname}>
          {serverOptions.map((option, index) => (
            <option key={index}>{option.hostname}</option>
          ))}
        </select>
      </div>
      <div className="form_paragraph">
        <label htmlFor="radius">Radius:{radius}</label>
        <input
          id="radius"
          type="range"
          onChange={changeRadius}
          min={2}
          max={6}
          step={1}
          value={radius}
        ></input>
      </div>
      <button>Start</button>
    </form>
  );
};
