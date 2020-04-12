# Video Streaming Over Mininet

# Dependencies
- Requires Mininet (`sudo apt-get install mininet`)
- Install controller as well (`sudo apt-get install openvswitch-testcontroller`)
- Google Chrome and Python
- Requires Flask
- Linux based OS

# How to run
- run `python topology.py` (may need to run as sudo if prompted), currently the topology is a simple Star topology with 3 hosts, host 2 is default server
- in Mininet console run `xterm h1 h2 h3` to get terminal emulators for the hosts
- in terminal for h2 run `./start_server.sh`
- in terminal for h1 and h3 run `./start_browser.sh`
- You should see Chrome open with video players for each of the hosts.

# Trying to run on GCP instance
- Currently we use a remote desktop solution to get a GUI on GCP (vcnserver) it can be a little buggy but overall it works
- run `sudo tigervncserver -kill :1` and `sudo tigervncserver -localhost no :1` to kill existing server and start a new one (always starts on port 5901)
- Once started, use a vncviewer to connect. TightVNC Viewer is the one I use. The IP to connect to is `34.83.132.41` and the password is `cloud2020`
- Sometimes when starting up you may see a black screen, go back to the GCP terminal and rerun the two commands in Step 2 to restart the vncserver, then try to reconnect.
- Now you can view the project with a GUI. Inside `/home/simonzeng9/CloudFinalProject/video_server` is where the video server is, you can now follow the How to run part to see video playback. 


# Notes
- There is a python flask server started locally on port 5000, this is to interface with future python scripts
- The server running on h2 is a simple server with CORS access appended to headers
