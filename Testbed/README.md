# Testbed
* because of COVID, running the mininet testbed on a GCP instance for same working environment, but mininet can be local if needed
* theres also VMs on GCP
* content generation
	* use bitcodin/bitmovin to encode a video file to MPEG-DASH format with different bit rates
	* upload to some server then transmit between web server and client
		* https://bitmovin.com/mp4box-dash-content-generation-x264/
* connect mininet to real network
* based off our ABR algorithm, have (minevents? framework) tune channel characteristics between virtual and real network via JSON config file.
* client side is nice for an artsy compare and contrast of buffering, but isn't strictly necessary per se if we only focus on QoE metric logging

## Goals
* use mininet to emulate a video streaming environment
* deploy testing and evaluation suite 
* be able to test and evaluate ABR algorithms in test bed

## Reference Papers for Test Bed
* https://ieeexplore.ieee.org/document/7561555
* 