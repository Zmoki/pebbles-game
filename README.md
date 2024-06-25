# Web Game with Pebbles

This project is a simple web page featuring two bowls with a random number of pebbles.
Users can drag and drop pebbles between the bowls, and the counts of pebbles
in each bowl are updated dynamically.
Additionally, it integrates MetaMask for Web3 wallet authentication
and displays the user's wallets address upon successful connection.

## Features

- Randomly generated number of pebbles in each bowl at the start.
- Drag-and-drop functionality to move pebbles between bowls.
- Dynamic count updates as pebbles are moved.
- Smooth animations for dragging pebbles.
- MetaMask integration for Web3 wallet connection.
- Displays the user's wallet address after connection.

## Demo

See https://pebbles-game.zmoki.xyz/

## Setup

1. Clone the repository:
    ```sh
    git clone git@github.com:Zmoki/pebbles-game.git
    ```

2. Navigate to the project directory:
    ```sh
    cd pebbles-game
    ```

3. Install dependencies:
    ```sh
    npm i
    ```

4. Run application
    ```sh
    npm run start
    ```

5. Open `http://localhost:1313` in your web browser to view the application.

6. Edit source code in the `src` folder to see changes.

## Stack

- The app uses [Parcel.js](https://parceljs.org/) as a builder.
- Entry point is the `src/index.html` file written in HTML.
- Styles in the `src/index.css` written in classic CSS.
- Scripts in the `src/*.ts` files written in TypeScript.

### Dependencies

- [Web3.js](https://web3js.org/)

## Production

1. Run build
    ```sh
    npm run build
    ```
2. See production files in the `dist` folder.

> GitHub repo integrated with Cloudflare. Every commit to the `main` branch will
> trigger redeploy of https://pebbles-game.zmoki.xyz/

## Author

- Zarema Khalilova

✨✨✨
