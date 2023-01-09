import { sortBy, last, head } from "lodash";

export const createGrid = (values) => {
  return values.reduce((a, v1) => {
    return values.reduce((b, v2) => {
      return values.reduce((c, v3) => {
        const isValid = v1 + v2 + v3 === 0;

        if (isValid) {
          return [...c, { x: v1, y: v2, z: v3 }];
        } else {
          return c;
        }
      }, b);
    }, a);
  }, []);
};

export const getCells = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const isHexesAreSame = (hexA, hexB) => {
  return hexA.x === hexB.x && hexA.y === hexB.y && hexA.z === hexB.z;
};

export const getNewPosition = (direction, hex) => {
  switch (direction) {
    case "top":
      return {
        ...hex,
        x: hex.x,
        y: hex.y + 1,
        z: hex.z - 1,
      };
    case "topRight":
      return {
        ...hex,
        x: hex.x + 1,
        y: hex.y,
        z: hex.z - 1,
      };
    case "topLeft":
      return {
        ...hex,
        x: hex.x - 1,
        y: hex.y + 1,
        z: hex.z,
      };
    case "bottom":
      return {
        ...hex,
        x: hex.x,
        y: hex.y - 1,
        z: hex.z + 1,
      };
    case "bottomRight":
      return {
        ...hex,
        x: hex.x + 1,
        y: hex.y - 1,
        z: hex.z,
      };
    case "bottomLeft":
      return {
        ...hex,
        x: hex.x - 1,
        y: hex.y,
        z: hex.z + 1,
      };
  }
};

const move = (direction, hex, data, rangeOfValues) => {
  const newHex = getNewPosition(direction, hex);

  const isNewPositionExtendOutOverEdge =
    newHex.x > last(rangeOfValues) ||
    newHex.x < head(rangeOfValues) ||
    newHex.y > last(rangeOfValues) ||
    newHex.y < head(rangeOfValues) ||
    newHex.z > last(rangeOfValues) ||
    newHex.z < head(rangeOfValues);

  const isNewPositionIsOccupied = Boolean(
    data.find((cell) => {
      return cell.x === newHex.x && cell.y === newHex.y && cell.z === newHex.z;
    })
  );
  const moveIsIllegal =
    isNewPositionExtendOutOverEdge || isNewPositionIsOccupied;

  if (moveIsIllegal) {
    return hex;
  } else {
    return move(direction, newHex, data, rangeOfValues);
  }
};

export const moveHex = (direction, column, rangeOfValues, result = []) => {
  const [firstElement, ...rest] = column;
  const [secondElement, ...rest2] = rest;

  if (!firstElement) {
    return result;
  }

  const hex = move(direction, firstElement, result, rangeOfValues);

  if (!secondElement) {
    return [...result, hex];
  }

  if (firstElement.value === secondElement.value) {
    const mergedElement = {
      ...hex,
      value: hex.value + secondElement.value,
    };

    return moveHex(direction, rest2, rangeOfValues, [...result, mergedElement]);
  } else {
    return moveHex(direction, rest, rangeOfValues, [...result, hex]);
  }
};

export const getSortedData = (data, rangeOfValues) => {
  const dataByAxisX = rangeOfValues.reduce((acc, value) => {
    return [
      ...acc,
      data.filter((obj) => {
        return obj.x === value;
      }),
    ];
  }, []);

  const sortedDataByAxisX = dataByAxisX.map((column) => {
    return sortBy(column, ["z"]);
  });

  const dataByAxisY = rangeOfValues.reduce((acc, value) => {
    return [
      ...acc,
      data.filter((obj) => {
        return obj.y === value;
      }),
    ];
  }, []);

  const sortedDataByAxisY = dataByAxisY.map((column) => {
    return sortBy(column, ["z"]);
  });

  const dataByAxisZ = rangeOfValues.reduce((acc, value) => {
    return [
      ...acc,
      data.filter((obj) => {
        return obj.z === value;
      }),
    ];
  }, []);

  const sortedDataByAxisZ = dataByAxisZ.map((column) => {
    return sortBy(column, ["x"]);
  });

  return {
    sortedDataByAxisX,
    sortedDataByAxisY,
    sortedDataByAxisZ,
  };
};
