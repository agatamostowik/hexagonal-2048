import { useEffect, useState, useMemo } from "react";
import { sortBy, range } from "lodash";
import {
  getCells,
  getSortedData,
  moveHex,
  createGrid,
  getNewPosition,
  isHexesAreSame,
} from "../../helpers";
import "./Game.css";

export const Game = (props) => {
  const { radius, hostname } = props;
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("playing");
  const [isMoveInProgress, setIsMoveInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rangeOfValues = range(-(radius - 1), radius);

  const isGameOver = status === "game-over";

  const grid = useMemo(() => {
    return createGrid(rangeOfValues);
  }, [rangeOfValues]);

  const gridByAxisX = useMemo(() => {
    return rangeOfValues.reduce((acc, value) => {
      return [
        ...acc,
        grid.filter((obj) => {
          return obj.x === value;
        }),
      ];
    }, []);
  }, [grid, rangeOfValues]);

  const sortedGridByAxisX = useMemo(() => {
    return gridByAxisX.map((column) => {
      return sortBy(column, ["z"]);
    });
  }, [gridByAxisX]);

  const { sortedDataByAxisX, sortedDataByAxisY, sortedDataByAxisZ } =
    getSortedData(data, rangeOfValues);

  const fetchNewHex = async (newData) => {
    setIsLoading(true);
    try {
      const url =
        hostname === "localhost"
          ? `http://${hostname}:3001/api/${radius}`
          : `http://${hostname}/${radius}`;

      const additionalCellFromServer = await getCells(url, newData);

      setData([...newData, ...additionalCellFromServer]);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setIsMoveInProgress(false);
  };

  const handleKeyDown = async (event) => {
    event.preventDefault();

    if (isMoveInProgress || isLoading) {
      return;
    }

    if (isGameOver) {
      return;
    }

    switch (event.keyCode) {
      // Top
      case 87: {
        setIsMoveInProgress(true);

        const newData = sortedDataByAxisX.reduce((acc, column) => {
          const newDataByColumn =
            column.length !== 0
              ? moveHex("top", column, rangeOfValues)
              : column;

          return [...acc, ...newDataByColumn];
        }, []);

        fetchNewHex(newData);
        break;
      }
      // Top Right
      case 69: {
        setIsMoveInProgress(true);

        const newData = sortedDataByAxisY.reduce((acc, column) => {
          const newDataByColumn =
            column.length !== 0
              ? moveHex("topRight", column, rangeOfValues)
              : column;

          return [...acc, ...newDataByColumn];
        }, []);

        fetchNewHex(newData);
        break;
      }
      // Top Left
      case 81: {
        setIsMoveInProgress(true);

        const newData = sortedDataByAxisZ.reduce((acc, column) => {
          const newDataByColumn =
            column.length !== 0
              ? moveHex("topLeft", column, rangeOfValues)
              : column;

          return [...acc, ...newDataByColumn];
        }, []);

        fetchNewHex(newData);
        break;
      }
      // Bottom
      case 83: {
        setIsMoveInProgress(true);

        const newData = sortedDataByAxisX.reduce((acc, column) => {
          const newDataByColumn =
            column.length !== 0
              ? moveHex("bottom", column.reverse(), rangeOfValues)
              : column;

          return [...acc, ...newDataByColumn];
        }, []);

        fetchNewHex(newData);
        break;
      }
      // Bottom Right
      case 68: {
        setIsMoveInProgress(true);

        const newData = sortedDataByAxisZ.reduce((acc, column) => {
          const newDataByColumn =
            column.length !== 0
              ? moveHex("bottomRight", column.reverse(), rangeOfValues)
              : column;

          return [...acc, ...newDataByColumn];
        }, []);

        fetchNewHex(newData);
        break;
      }
      // Bottom Left
      case 65: {
        setIsMoveInProgress(true);

        const newData = sortedDataByAxisY.reduce((acc, column) => {
          const newDataByColumn =
            column.length !== 0
              ? moveHex("bottomLeft", column.reverse(), rangeOfValues)
              : column;

          return [...acc, ...newDataByColumn];
        }, []);

        fetchNewHex(newData);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          hostname === "localhost"
            ? `http://${hostname}:3001/api/${radius}`
            : `https://${hostname}/api/${radius}`;

        const response = await getCells(url, []);

        setData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const directions = [
      "top",
      "topRight",
      "topLeft",
      "bottom",
      "bottomRight",
      "bottomLeft",
    ];

    if (data.length !== 0 && grid.length !== 0 && data.length === grid.length) {
      const isGameOver = data.every((cell) => {
        return directions.every((dir) => {
          const newPosition = getNewPosition(dir, cell);

          const newCell = data.find((d) => {
            return isHexesAreSame(d, newPosition);
          });

          if (cell.value !== newCell?.value) {
            return true;
          } else {
            return false;
          }
        });
      });

      if (isGameOver) {
        setStatus("game-over");
      }
    }
  }, [grid, data]);

  return (
    <div>
      <div className="board">
        {sortedGridByAxisX.map((column, index) => {
          return (
            <div key={index} className="column">
              {column.map((hex, index) => {
                const tile = data.find((cell) => {
                  return (
                    cell.x === hex.x && cell.y === hex.y && cell.z === hex.z
                  );
                });

                return (
                  <div key={index} className="wrapper">
                    <div className="cell" />

                    {tile && (
                      <div
                        key={index}
                        className={`hex no${tile.value}`}
                        data-x={tile.x}
                        data-y={tile.y}
                        data-z={tile.z}
                        data-value={tile.value}
                      >
                        {tile.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="status">
        Game Status: <span data-status={status}>{status}</span>
      </div>
    </div>
  );
};
