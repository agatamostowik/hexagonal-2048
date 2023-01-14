# hexagonal-2048

 Variation on the popular game 2048, in which the player must combine tiles with the same number until reaching the number 2048. Unlike the original version of the game, the player moves on 3 axes and movement is carried out in 6 directions.


The application consists of two parts - a client application written using the React.js library and a server running in the Node.js environment. The game board itself was created using Cartesian product. Each move is a combination of complex calculations on the client side. After each successful move the server  creates a new tile on the board.

Play the game [here](https://hexagonal-2048.up.railway.app/).



### ❗️This app is designed for desktop only

## Gameplay

Use below keys to slide the tiles in the desired direction until you reach the tile with number 2048. 

        W
    Q       E

    A       D
        S


### TODO - missing functionalities 
* scoring
* check for winning the game
* bug fix (request to the server shouldn't be sent if move is not possible)
* improve styles




