# retro_snake

Retro monochrome Snake with 1-player and 2-player party mode.

## 1 Player
Classic Snake with WASD, walls, two apples maximum, score and high-score display.

## 2 Player
Create a party to receive a random 5-character code, then have the other player join with that code. Both players should be on the same network.

The first player to 5 points wins. A player gets a point when the other player crashes into their snake, a wall, or their own body. A simultaneous head-on collision is treated as a draw.

Apples: maximum 2 active at once. When one is eaten, its replacement appears 3 seconds later.

## GitHub Pages
GitHub Pages hosts the static files. Because Pages cannot run a custom multiplayer server, this version uses PeerJS for WebRTC signaling and sends the actual game state peer-to-peer. Internet access is therefore still needed for the PeerJS signaling library/service, even though both players can be on the same LAN.

Upload `index.html`, `style.css`, and `script.js` to the repo root, enable GitHub Pages, and open the site on both devices.
