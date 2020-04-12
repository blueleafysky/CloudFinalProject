# Video Streaming Over Mininet

# Dependences
- Requires Mininet (`sudo apt-get install mininet`)
- Install controller as well (`sudo apt-get install openvswitch-testcontroller`)
- Google Chrome and Python installation(2.7 preferred)
- Linux based OS

# How to run
- run `python topology.py` (may need to run as sudo if prompted), currently the topology is a simple Star topology with 3 hosts, host 2 is default server
- in Mininet console run `xterm h1 h2 h3` to get terminal emulators for the hosts
- in terminal for h2 run `./start_browser.sh`
- in terminal for h1 and h3 run `./start_browser.sh`
- You should see Chrome open with video players for each of the hosts.
