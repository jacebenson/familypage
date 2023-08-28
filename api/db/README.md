# Database stuff

## sqlite

When using sqlite, its a single file

On render.com you can not directly access this file, however if oyu want to download it here's how.

Introducing magic wormhole.

1.  Logon to render.com
2.  Goto your api service
3.  Open the shell in the browser
4.  navigate to the ./api/db
5.  run `wormhole send sqlite.db`
6.  note the code it gives you
7.  on your local machine, install magic wormhole
8.  navigate to the folder you want to download the file to
9.  run `wormhole receive`
10.  enter the code from step 6
11. update `.env` to point to the new file location
